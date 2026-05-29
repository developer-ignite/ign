<?php
/**
 * Single Event Block Template
 *
 * Overrides the tec/single-event block render to prepend
 * the Event Hero block before the default TEC single event content.
 *
 * Override of: [plugin]/src/views/blocks/single-event.php
 *
 * @link http://evnt.is/1aiy
 *
 * @version 6.2.7
 */

use Tribe\Events\Views\V2\Assets as Event_Assets;
use Tribe\Events\Views\V2\Template_Bootstrap;

tribe_asset_enqueue_group( Event_Assets::$group_key );

?>
<main>
	<?php // Render the Event Hero block
	echo do_blocks( '<!-- wp:takt/event-hero /-->' ); ?>
	<div class="discourse-container">
		<div class="tribe-block tec-block__single-event">
			<?php echo tribe( Template_Bootstrap::class )->get_view_html(); ?>
		</div>
	</div>
</main>
