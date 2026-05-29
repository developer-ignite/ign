import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./EventHero";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./EventHero.svg";

registerBlockType(metadata.name, { icon: { src: blockIcon }, edit, save });
