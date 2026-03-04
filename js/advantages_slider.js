{
	const prevEl = document.querySelector('.advantages_slick_prev');
	const nextEl = document.querySelector('.advantages_slick_next');
	const sliderEl = document.querySelector('.advantages_slider');
	const itemSliderEls = [ ...document.querySelectorAll('.advantage_item')];

	const cloneCount = 4;
	const createClones = () => {
		const originalItems = [...sliderEl.children];
		const originalLength = originalItems.length;

		for (let i = originalLength - cloneCount; i < originalLength; i++) {
			const clone = originalItems[i].cloneNode(true);
			sliderEl.prepend(clone);
		}
		for (let i = 0; i < cloneCount; i++) {
			const clone = originalItems[i].cloneNode(true);
			sliderEl.append(clone);
		}
	}

	createClones(); 




}