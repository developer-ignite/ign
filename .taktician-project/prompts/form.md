Create a Form block.

Use the block type form

Use https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=810-58439&m=dev for the desktop design. 

Use https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=810-58484&m=dev for the mobile design.

For the form fields styling refactor /var/www/ign/wp-content/themes/ign/resources/css/screen/forms.css . Try to use Gravity Forms classes as much as possible. Include styles for all possible field types. Remember that Tailwind 4 uses layers, so you need to make sure the content on that file will have priority over the default Gravity Forms style.

You can change everything on the forms.css as long as your code is easier and cover all scenarios. I actually want it to be refactored to be easier to use and update. The styling is supposed to be applied on both gravity forms fields and on fields that doesn't have any custom styling.