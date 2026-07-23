<?php
/**
 * List View — Event Description
 *
 * Overrides the default excerpt in the archive/list view: no "[…]"
 * read-more suffix, and cut off at the end of the first paragraph
 * (the first newline in the raw content) rather than an arbitrary word
 * count. The 55-word `excerpt_length` filter (see functions.php) still
 * applies underneath as a safety net for an unusually long paragraph
 * with no line break at all.
 *
 * Override of: [plugin]/src/views/v2/list/event/description.php
 *
 * @link http://evnt.is/1aiy
 */

$full  = get_the_content( null, false, get_the_ID() );
$plain = trim( wp_strip_all_tags( $full ) );

// Stop at the end of the first paragraph.
$first_paragraph = preg_split( '/\r\n|\r|\n/', $plain, 2 )[0];

// Safety net: never exceed 55 words even within a single (unusually long)
// first paragraph. Empty $more so no "[…]" gets appended.
$excerpt = wp_trim_words( $first_paragraph, 55, '' );
?>

<?php if ( $excerpt ) : ?>
	<div class="tribe-events-calendar-list__event-description tribe-common-b2">
		<?php echo esc_html( $excerpt ); ?>
	</div>
<?php endif; ?>
