{
	const prevEl = document.querySelector('.reviews_slick_prev');
	const nextEl = document.querySelector('.reviews_slick_next');
	const sliderEl = document.querySelector('.reviews_slider');
	const itemSliderEls = [ ...document.querySelectorAll('.reviews_item') ];

	let currentIndex = 0;

	const maxIndex = () => {
		const widthOfItem = itemSliderEls[0].offsetWidth;
		const visibleItems = Math.round(sliderEl.offsetWidth / widthOfItem);
		const maxIndex = itemSliderEls.length - visibleItems;

		return maxIndex;
	}

	const updateButtons = () => {
		prevEl.classList.toggle('disabled', currentIndex === 0);
		nextEl.classList.toggle('disabled', currentIndex === maxIndex());
	}

	updateButtons();

	prevEl.addEventListener('click', () => {
		currentIndex -= 1;
		itemSliderEls[currentIndex].scrollIntoView({
			behavior: "smooth",
			inline: "start",
			container: "nearest"
		});
		updateButtons();
	});

	nextEl.addEventListener('click', () => {
		currentIndex += 1;
		itemSliderEls[currentIndex].scrollIntoView({
			behavior: "smooth",
			inline: "start",
			container: "nearest"
		});
		updateButtons();
	});

	const observer = new ResizeObserver(() => {
		itemSliderEls[currentIndex].scrollIntoView({
			behavior: "auto",
			inline: "nearest",
			container: "nearest"
		});
	});

	observer.observe(sliderEl);
}