{
	const prevEl = document.querySelector('.reviews_slick_prev');
	const nextEl = document.querySelector('.reviews_slick_next');
	const sliderEl = document.querySelector('.reviews_slider');
	const itemSliderEls = [ ...document.querySelectorAll('.reviews_item') ];

	let currentIndex = 0;

	const getSliderState = () => {
		const widthOfItem = itemSliderEls[0].offsetWidth;
		const visibleItems = Math.round(sliderEl.offsetWidth / widthOfItem);
		const maxIndex = itemSliderEls.length - visibleItems;

		return { widthOfItem, maxIndex };
	}

	const updateButtons = () => {
		const { maxIndex } = getSliderState();
		prevEl.classList.toggle('disabled', currentIndex === 0);
		nextEl.classList.toggle('disabled', currentIndex === maxIndex);
	}

	updateButtons();

	prevEl.addEventListener('click', () => {
		const { widthOfItem } = getSliderState();
		currentIndex -= 1;
		sliderEl.scrollTo({
			left: currentIndex * widthOfItem,
			behavior: "smooth",
		});
		updateButtons();
	});

	nextEl.addEventListener('click', () => {
		const { widthOfItem } = getSliderState();
		currentIndex += 1;
		sliderEl.scrollTo({
			left: currentIndex * widthOfItem,
			behavior: "smooth",
		});
		updateButtons();
	});

	const observer = new ResizeObserver(() => {
		const { widthOfItem } = getSliderState();
		sliderEl.scrollTo({
			left: currentIndex * widthOfItem,
			behavior: 'auto'
		});
	});

	observer.observe(sliderEl);
}