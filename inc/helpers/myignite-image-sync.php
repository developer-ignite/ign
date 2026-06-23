<?php
/**
 * MyIGNITE — CampusGroups Event Image Sync
 *
 * Problem this solves:
 * Events imported from the ReadyEducation CampusGroups ICS feed (via The
 * Events Calendar's Event Aggregator) never carry an image, because ICS
 * feeds have no image field. CampusGroups DOES put the original event
 * page URL into the imported event's "Event Website" field. That public
 * event page has an <meta property="og:image"> tag IF an image was
 * uploaded when the event was created on CampusGroups — and has no such
 * tag at all if it wasn't. This script:
 *
 *   1. Finds events that have a Website URL but no featured image yet.
 *   2. Fetches that CampusGroups page.
 *   3. Looks for og:image. If absent, skips the event — this is expected
 *      and not an error (CampusGroups organizer just didn't upload one).
 *   4. If present, downloads the image and sets it as the event's
 *      WordPress featured image (which is what The Events Calendar uses
 *      for event listing/single-event images).
 *
 * Runs two ways:
 *   - On a schedule, hourly, via WP-Cron (paired with WP Engine's
 *     "Alternate cron" toggle in the User Portal, so this isn't dependent
 *     on live site traffic to fire on time).
 *   - On demand, manually, via WP-CLI:  wp myignite sync-images
 *     (Useful for testing without waiting for the hourly run.)
 *
 * Logs every run to: wp-content/myignite-image-sync.log
 * Each line is timestamped and says exactly what happened to each event
 * (updated / skipped-no-og-image / skipped-already-has-image /
 * skipped-no-website / error-with-reason) so that anyone debugging this
 * later — including someone with zero prior context on this script —
 * can read the log and understand exactly what the script saw and did,
 * without needing to read the code first.
 *
 * Where this file lives:
 *   wp-content/themes/YOUR-THEME/inc/helpers/myignite-image-sync.php
 *   required from the theme's functions.php — see the one-line snippet
 *   in the comment at the very bottom of this file.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't allow this file to be loaded directly outside WordPress.
}

// -----------------------------------------------------------------------
// CONFIG — the only section you should need to touch to adjust behavior.
// -----------------------------------------------------------------------

// How often the sync runs when triggered by WP-Cron.
// Must match a registered WP-Cron interval name — 'hourly' is built into
// WordPress core already, so no custom interval needs to be registered.
define( 'MYIGNITE_SYNC_CRON_INTERVAL', 'hourly' );

// Where the log file is written. wp-content/ is writable on WP Engine and
// is NOT publicly web-accessible in a way that exposes raw PHP, but a
// .log file sitting there IS fetchable by URL if someone guesses the path,
// so we deny direct access to it via .htaccess-equivalent logic further
// down (MYIGNITE_block_log_file_access).
define( 'MYIGNITE_SYNC_LOG_PATH', WP_CONTENT_DIR . '/myignite-image-sync.log' );

// Safety cap: max events processed in a single run, so a feed problem or
// huge backlog can't make one run hang indefinitely or hammer
// CampusGroups with hundreds of rapid requests.
define( 'MYIGNITE_SYNC_MAX_PER_RUN', 50 );

// Pause between each external HTTP request to CampusGroups, in seconds.
// A small delay is courteous to CampusGroups' servers and reduces the
// chance of being rate-limited or blocked outright.
define( 'MYIGNITE_SYNC_REQUEST_DELAY', 1 );


// -----------------------------------------------------------------------
// LOGGING
// -----------------------------------------------------------------------

/**
 * Append one line to the sync log, with a timestamp.
 *
 * @param string $message Human-readable line, e.g. "Event 1234: updated featured image".
 */
function myignite_sync_log( $message ) {
	$line = sprintf( '[%s] %s' . PHP_EOL, current_time( 'Y-m-d H:i:s' ), $message );
	// FILE_APPEND keeps adding to the same file rather than overwriting it.
	// LOCK_EX avoids two overlapping runs corrupting the file if they ever
	// somehow run at the same time.
	file_put_contents( MYIGNITE_SYNC_LOG_PATH, $line, FILE_APPEND | LOCK_EX );
}

/**
 * Block direct web access to the log file, since wp-content/ is inside
 * the web root and the file would otherwise be fetchable by anyone who
 * guesses or finds its URL. This denies the request at the WordPress
 * level for any request that matches the log file's name.
 *
 * This is a basic safety net, not a replacement for proper server-level
 * rules — if you have access to edit your site's main .htaccess file
 * (or equivalent on WP Engine), adding a rule there to block
 * myignite-image-sync.log directly is a more robust belt-and-suspenders
 * option, but isn't required for this to work.
 */
add_action( 'init', 'myignite_block_log_file_access' );
function myignite_block_log_file_access() {
	if ( isset( $_SERVER['REQUEST_URI'] ) && false !== strpos( $_SERVER['REQUEST_URI'], 'myignite-image-sync.log' ) ) {
		wp_die( 'Not found.', '', array( 'response' => 404 ) );
	}
}


// -----------------------------------------------------------------------
// CORE SYNC LOGIC
// -----------------------------------------------------------------------

/**
 * Run the full sync: find eligible events, attempt to pull an image for
 * each, log the outcome. This is the single function both the WP-Cron
 * hook and the WP-CLI command call — so behavior is identical whether
 * it's triggered automatically or run manually.
 */
function myignite_run_image_sync() {
	myignite_sync_log( 'Sync run started.' );

	// Pull events that don't yet have a featured image. We query by
	// post type directly with WP_Query rather than going through any
	// REST layer, since this all runs server-side inside WordPress —
	// no HTTP round-trip to itself needed.
	$query = new WP_Query(
		array(
			'post_type'      => 'tribe_events',
			'post_status'    => 'publish',
			'posts_per_page' => MYIGNITE_SYNC_MAX_PER_RUN,
			'meta_query'     => array(
				array(
					'key'     => '_thumbnail_id',
					'compare' => 'NOT EXISTS',
				),
			),
		)
	);

	if ( ! $query->have_posts() ) {
		myignite_sync_log( 'No events without a featured image were found. Nothing to do.' );
		return;
	}

	$processed = 0;
	$updated   = 0;
	$skipped   = 0;
	$errors    = 0;

	foreach ( $query->posts as $event_post ) {
		$event_id = $event_post->ID;
		$processed++;

		// The Events Calendar stores the "Event Website" field in this
		// post meta key. Confirmed by checking an imported event's
		// custom fields in wp-admin (classic editor "Event Website" box
		// writes here).
		$website_url = get_post_meta( $event_id, '_EventURL', true );

		if ( empty( $website_url ) ) {
			myignite_sync_log( "Event {$event_id}: skipped — no Event Website URL set." );
			$skipped++;
			continue;
		}

		$image_url = myignite_extract_og_image( $website_url, $event_id );

		if ( false === $image_url ) {
			// myignite_extract_og_image() already logged the specific
			// reason (no og:image tag, or the fetch itself failed), so
			// we don't log again here — just count it and move on.
			$skipped++;
			// Be polite to CampusGroups' servers between requests.
			sleep( MYIGNITE_SYNC_REQUEST_DELAY );
			continue;
		}

		$result = myignite_set_featured_image_from_url( $event_id, $image_url );

		if ( is_wp_error( $result ) ) {
			myignite_sync_log( "Event {$event_id}: ERROR — " . $result->get_error_message() );
			$errors++;
		} else {
			myignite_sync_log( "Event {$event_id}: updated featured image from {$image_url}" );
			$updated++;
		}

		sleep( MYIGNITE_SYNC_REQUEST_DELAY );
	}

	myignite_sync_log(
		sprintf(
			'Sync run finished. Processed: %d, Updated: %d, Skipped: %d, Errors: %d.',
			$processed,
			$updated,
			$skipped,
			$errors
		)
	);
}

/**
 * Fetch a CampusGroups event page and pull the og:image URL out of it,
 * if one exists.
 *
 * @param string $page_url The CampusGroups event page URL (from the Event Website field).
 * @param int    $event_id Used only for logging context.
 * @return string|false The image URL if found, or false if no og:image
 *                       tag exists, or the page couldn't be fetched.
 */
function myignite_extract_og_image( $page_url, $event_id ) {
	$response = wp_remote_get(
		$page_url,
		array(
			'timeout'    => 15,
			'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		)
	);

	if ( is_wp_error( $response ) ) {
		myignite_sync_log( "Event {$event_id}: skipped — could not fetch {$page_url} ({$response->get_error_message()})." );
		return false;
	}

	$status_code = wp_remote_retrieve_response_code( $response );
	if ( 200 !== (int) $status_code ) {
		myignite_sync_log( "Event {$event_id}: skipped — {$page_url} returned HTTP {$status_code}." );
		return false;
	}

	$html = wp_remote_retrieve_body( $response );

	// Look for <meta property="og:image" content="...">, tolerant of
	// single or double quotes and attribute order, since we don't fully
	// control CampusGroups' markup and it could vary between events or
	// change over time.
	$pattern = '/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\'][^>]*>/i';

	if ( ! preg_match( $pattern, $html, $matches ) ) {
		// Also try the reversed attribute order (content before property),
		// since some platforms emit it that way.
		$pattern_reversed = '/<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\'][^>]*>/i';
		if ( ! preg_match( $pattern_reversed, $html, $matches ) ) {
			myignite_sync_log( "Event {$event_id}: skipped — no og:image tag on {$page_url} (event likely has no image on CampusGroups)." );
			return false;
		}
	}

	$image_url = html_entity_decode( $matches[1] );

	if ( empty( $image_url ) || ! filter_var( $image_url, FILTER_VALIDATE_URL ) ) {
		myignite_sync_log( "Event {$event_id}: skipped — og:image tag found but content was not a valid URL ('{$image_url}')." );
		return false;
	}

	return $image_url;
}

/**
 * Download an image from a URL and set it as the featured image for a
 * given event post. Uses WordPress's own media-sideloading function,
 * which handles file-type detection and the media library upload
 * itself — so this works correctly whether CampusGroups serves jpg,
 * png, webp, or anything else, without needing to hardcode a content
 * type anywhere.
 *
 * @param int    $event_id  The WordPress post ID of the event.
 * @param string $image_url The image URL to download and attach.
 * @return true|WP_Error True on success, WP_Error with a reason on failure.
 */
function myignite_set_featured_image_from_url( $event_id, $image_url ) {
	// These helpers aren't autoloaded outside wp-admin contexts
	// (e.g. when this runs via WP-Cron or WP-CLI).
	if ( ! function_exists( 'media_handle_sideload' ) ) {
		require_once ABSPATH . 'wp-admin/includes/media.php';
	}
	if ( ! function_exists( 'download_url' ) ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
	}
	if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
		require_once ABSPATH . 'wp-admin/includes/image.php';
	}

	// Build a clean filename from the event title rather than inheriting
	// whatever CampusGroups named the file (e.g. r3_image_upload_599695_…).
	// Strip the query string before reading the extension so URLs like
	// "…/photo.jpeg?v=2" still resolve to "jpeg".
	$ext      = strtolower( pathinfo( strtok( $image_url, '?' ), PATHINFO_EXTENSION ) ) ?: 'jpg';
	$filename = sanitize_title( get_the_title( $event_id ) ) . '_myignite_import.' . $ext;

	$tmp = download_url( $image_url );
	if ( is_wp_error( $tmp ) ) {
		return $tmp;
	}

	$file_array = [
		'name'     => $filename,
		'tmp_name' => $tmp,
	];

	$attachment_id = media_handle_sideload( $file_array, $event_id );

	if ( is_wp_error( $attachment_id ) ) {
		// media_handle_sideload() doesn't clean up the temp file on failure.
		@unlink( $tmp );
		return $attachment_id;
	}

	$thumbnail_set = set_post_thumbnail( $event_id, $attachment_id );

	if ( false === $thumbnail_set ) {
		return new WP_Error(
			'myignite_thumbnail_set_failed',
			"media_handle_sideload succeeded (attachment {$attachment_id}) but set_post_thumbnail failed."
		);
	}

	// Keep a record of where this image actually came from, directly on
	// the attachment — helpful later if anyone wonders why a particular
	// image is attached to a particular event.
	update_post_meta( $attachment_id, '_myignite_source_url', $image_url );

	return true;
}


// -----------------------------------------------------------------------
// WP-CRON: scheduled automatic runs
// -----------------------------------------------------------------------

/**
 * Register the cron event on theme activation / first load if it isn't
 * already scheduled. wp_next_scheduled() prevents this from stacking up
 * duplicate scheduled events on every page load — it only schedules once.
 */
add_action( 'init', 'myignite_schedule_image_sync' );
function myignite_schedule_image_sync() {
	if ( ! wp_next_scheduled( 'myignite_image_sync_event' ) ) {
		wp_schedule_event( time(), MYIGNITE_SYNC_CRON_INTERVAL, 'myignite_image_sync_event' );
	}
}

// When the scheduled event fires, run the sync.
add_action( 'myignite_image_sync_event', 'myignite_run_image_sync' );

/**
 * Unschedule the cron event if this file is ever removed from the theme
 * — without this, WordPress would keep trying to fire an action hook
 * that no longer exists. There's no plugin "deactivation" hook available
 * since this lives in the theme rather than a plugin, so the practical
 * way to clean this up if you ever remove this feature entirely is to
 * temporarily add a one-time call to myignite_unschedule_image_sync()
 * in functions.php, load the site once, then remove that call.
 */
function myignite_unschedule_image_sync() {
	$timestamp = wp_next_scheduled( 'myignite_image_sync_event' );
	if ( $timestamp ) {
		wp_unschedule_event( $timestamp, 'myignite_image_sync_event' );
	}
}


// -----------------------------------------------------------------------
// WP-CLI: manual on-demand runs
// -----------------------------------------------------------------------

/**
 * Registers `wp myignite sync-images` as a WP-CLI command, only when
 * running under WP-CLI (this class/registration would error if loaded
 * in a normal web request, since the WP_CLI base class wouldn't exist).
 *
 * Usage once SSH'd in via WP Engine's SSH Gateway:
 *   wp myignite sync-images
 *
 * This calls the exact same myignite_run_image_sync() function as the
 * hourly cron does — so testing manually and waiting for the schedule
 * produce identical behavior, just triggered differently.
 */
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	class MyIGNITE_CLI_Commands {
		/**
		 * Sync event images from CampusGroups source pages.
		 *
		 * ## EXAMPLES
		 *
		 *     wp myignite sync-images
		 */
		public function sync_images( $args, $assoc_args ) {
			myignite_run_image_sync();
			WP_CLI::success( 'Image sync run complete. Check wp-content/myignite-image-sync.log for details.' );
		}

		/**
		 * Remove the "— Event Details: URL" footer that CampusGroups appends to
		 * event descriptions in the ICS feed. New imports are cleaned automatically
		 * by the wp_insert_post_data filter in tribe-events.php; this command is
		 * a one-time cleanup for events already in the database.
		 *
		 * ## EXAMPLES
		 *
		 *     wp myignite clean-descriptions
		 */
		public function clean_descriptions( $args, $assoc_args ) {
			$pattern = '/\s*(?:\x{2014}|-{1,2})\s*Event Details:\s*https?:\/\/\S+\s*$/u';

			$query = new WP_Query( [
				'post_type'      => 'tribe_events',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
			] );

			$cleaned = 0;
			$skipped = 0;

			foreach ( $query->posts as $event_id ) {
				$post    = get_post( $event_id );
				$content = $post->post_content;
				$excerpt = $post->post_excerpt;

				$new_content = preg_replace( $pattern, '', $content );
				$new_excerpt = preg_replace( $pattern, '', $excerpt );

				if ( $new_content === $content && $new_excerpt === $excerpt ) {
					$skipped++;
					continue;
				}

				wp_update_post( [
					'ID'           => $event_id,
					'post_content' => $new_content,
					'post_excerpt' => $new_excerpt,
				] );

				WP_CLI::log( "Event {$event_id}: cleaned." );
				$cleaned++;
			}

			WP_CLI::success( "Done. Cleaned: {$cleaned}, Already clean: {$skipped}." );
		}
	}
	WP_CLI::add_command( 'myignite', 'MyIGNITE_CLI_Commands' );
}


/**
 * ---------------------------------------------------------------------
 * SETUP — one-time steps, not code to run automatically:
 * ---------------------------------------------------------------------
 *
 * 1. Save this file as:
 *    wp-content/themes/YOUR-THEME/inc/helpers/myignite-image-sync.php
 *
 * 2. In your theme's functions.php, add this single line:
 *
 *    require_once 'inc/helpers/myignite-image-sync.php';
 *
 * 3. In the WP Engine User Portal, enable "Alternate cron" for this
 *    environment (Sites → [your install] → [environment] → Utilities →
 *    Advanced → Alternate cron toggle). This makes the hourly schedule
 *    registered above actually fire on time, instead of depending on
 *    someone visiting the site.
 *
 * 4. Test manually before waiting for the schedule. SSH in via WP
 *    Engine's SSH Gateway, navigate to the site, run:
 *
 *      wp myignite sync-images
 *
 *    Then check wp-content/myignite-image-sync.log to see exactly what
 *    happened, and check a real event in wp-admin to visually confirm
 *    the featured image actually landed.
 */
