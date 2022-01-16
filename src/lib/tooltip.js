// popper core version relies on node's 'process.env' - umd does not
// see https://popper.js.org/docs/v2/#distribution-targets
import { createPopper } from '@popperjs/core';

export function tooltip(node, options) {
	const button = node;
	const tooltipComponent = options.content;

	let popperInstance, componentInstance;

	button.addEventListener('mouseover', show);
	button.addEventListener('mouseout', hide);

	function show() {
		componentInstance = new tooltipComponent({
			target: document.body,
			props: { message: options.message }
		});

		const tooltip_el = document.querySelector('#tooltip');
		tooltip_el.setAttribute('data-show', '');

		popperInstance = createPopper(button, tooltip_el, {
			placement: 'top',
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: [0, 8]
					}
				}
			]
		});
	}

	function hide() {
		const tooltip_el = document.querySelector('#tooltip');
		tooltip_el.removeAttribute('data-show');

		if (popperInstance) {
			popperInstance.destroy();
			popperInstance = null;
		}

		componentInstance.$destroy();
	}

	return {
		destroy() {
			button.removeEventListener('mouseover', show);
			button.removeEventListener('mouseout', hide);
		}
	};
}
