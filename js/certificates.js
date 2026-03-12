{
	const prevEl = document.querySelector('.slider_certificates_prev');
	const nextEl = document.querySelector('.slider_certificates_next');
	const viewportEl = document.querySelector('.viewport_slider_certificates');
	const sliderEl = document.querySelector('.certificates_slider');
	const originalItemEls = [ ...document.querySelectorAll('.certificates_item') ];

	const sliderState = {
		currentIndex: 0,
		itemWidth: 0,
		cloneCount: 0,
		isAnimating: false
	}

	const getSliderState = () => {
		const width = originalItemEls[0].offsetWidth;
		const viewportWidth = viewportEl.offsetWidth;
		const visibleItems = Math.ceil(viewportWidth / width);
		const cloneCount = visibleItems;

		return {
			itemWidth: width,
			visibleItems,
			cloneCount,
			originalLength: originalItemEls.length,
		}
	}

	const createClones = () => {
		const { visibleItems, originalLength, itemWidth } = getSliderState();
		sliderState.cloneCount = visibleItems;
		sliderState.itemWidth = itemWidth;

		for (let i = originalLength - 1; i >= originalLength - sliderState.cloneCount; i--) {
			const clone = originalItemEls[i].cloneNode(true);
			clone.dataset.clone = "true";
			sliderEl.prepend(clone);
		}

		for (let i = 0; i < sliderState.cloneCount; i++) {
			const clone = originalItemEls[i].cloneNode(true);
			clone.dataset.clone = "true";
			sliderEl.append(clone);
		}
	}

	const updatePosition = () => {
		sliderEl.style.transform = `translateX(-${sliderState.currentIndex * sliderState.itemWidth}px)`;
	}

	const setStartPosition = () => {
		sliderState.currentIndex = sliderState.cloneCount;
		updatePosition();
	}

	const checkClones = () => {
		const { originalLength } = getSliderState();

		if (sliderState.currentIndex >= originalLength + sliderState.cloneCount) {
			sliderEl.classList.add('slider_no_transition');
			sliderState.currentIndex -= originalLength;
			updatePosition();
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					sliderEl.classList.remove('slider_no_transition');
				});
			});
		}

		if (sliderState.currentIndex < sliderState.cloneCount) {
			sliderEl.classList.add('slider_no_transition');
			sliderState.currentIndex += originalLength;
			updatePosition();
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					sliderEl.classList.remove('slider_no_transition');
				});
			});
		}
	}

	const prevSlide = () => {
		if (sliderState.isAnimating) return;
		sliderState.isAnimating = true;
		sliderState.currentIndex -= 1;
		updatePosition();
	}
	const nextSlide = () => {
		if (sliderState.isAnimating) return;
		sliderState.isAnimating = true;
		sliderState.currentIndex += 1;
		updatePosition();
	}

	createClones();
	setStartPosition();

	prevEl.addEventListener('click', prevSlide);
	nextEl.addEventListener('click', nextSlide);

	sliderEl.addEventListener('transitionend', () => {
		checkClones();
		sliderState.isAnimating = false;
	});
}