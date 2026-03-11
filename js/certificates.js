{
	const prevEl = document.querySelector('.slider_certificates_prev');
	const nextEl = document.querySelector('.slider_certificates_next');
	const viewportEl = document.querySelector('.viewport_slider_certificates');
	const sliderEl = document.querySelector('.certificates_slider');
	const originalItemEls = [ ...document.querySelectorAll('.certificates_item') ];

	let currentIndex = 0;

	const getSliderState = () => {
		const itemWidth = originalItemEls[0].getBoundingClientRect().width;
		const viewportWidth = viewportEl.getBoundingClientRect().width;
		const visibleItems = viewportWidth / itemWidth;

		return {
			itemWidth,
			visibleItems,
			cloneCount: visibleItems,
			originalLength: originalItemEls.length,
		}
	}

	const createClones = () => {
		const { cloneCount, originalLength } = getSliderState();

		for (let i = originalLength - 1; i >= originalLength - cloneCount; i--) {
			const clone = originalItemEls[i].cloneNode(true);
			sliderEl.prepend(clone);
		}

		for (let i = 0; i < cloneCount; i++) {
			const clone = originalItemEls[i].cloneNode(true);
			sliderEl.append(clone);
		}
	}

	const updatePosition = () => {
		const { cloneCount } = getSliderState();
		const offset = originalItemEls[cloneCount].offsetLeft;
		sliderEl.style.transform = `translateX(-${offset}px)`;
	}

	const setStartPosition = () => {
		const { cloneCount } = getSliderState();
		currentIndex = cloneCount;
		updatePosition();
	}


	createClones();
	setStartPosition();

}