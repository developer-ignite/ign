import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./PostHero";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./PostHero.svg";

registerBlockType(metadata.name, { icon: { src: blockIcon }, edit, save });
