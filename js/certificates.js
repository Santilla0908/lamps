{
	const prevEl = document.querySelector('.slider_certificates_prev');
	const nextEl = document.querySelector('.slider_certificates_next');
	const viewportEl = document.querySelector('.viewport_slider_certificates');
	const sliderEl = document.querySelector('.certificates_slider');
	const originalItemEls = [ ...document.querySelectorAll('.certificates_item') ];

	let currentIndex = 0;
	let itemWidth = 0;
	let cloneCount = 0;
	let isAnimating = false;

	const getSliderState = () => {
		const width = originalItemEls[0].offsetWidth;
		const visibleItems = Math.round(viewportEl.offsetWidth / width);
		const cloneCount = visibleItems;

		return {
			itemWidth: width,
			visibleItems,
			cloneCount,
			originalLength: originalItemEls.length,
		}
	}

	const createClones = () => {
		const state = getSliderState();
		cloneCount = state.visibleItems;
		itemWidth = state.itemWidth;

		for (let i = state.originalLength - 1; i >= state.originalLength - state.cloneCount; i--) {
			const clone = originalItemEls[i].cloneNode(true);
			clone.dataset.clone = "true";
			sliderEl.prepend(clone);
		}

		for (let i = 0; i < state.cloneCount; i++) {
			const clone = originalItemEls[i].cloneNode(true);
			clone.dataset.clone = "true";
			sliderEl.append(clone);
		}
	}

	const updatePosition = () => {
		sliderEl.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
	}

	const setStartPosition = () => {
		currentIndex = cloneCount;
		updatePosition();
	}

	const checkClones = () => {
		const { originalLength } = getSliderState();

		if (currentIndex >= originalLength + cloneCount) {
			sliderEl.classList.add('slider_no_transition');
			currentIndex -= originalLength;
			updatePosition();
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					sliderEl.classList.remove('slider_no_transition');
				});
			});
		}

		if (currentIndex < cloneCount) {
			sliderEl.classList.add('slider_no_transition');
			currentIndex += originalLength;
			updatePosition();
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					sliderEl.classList.remove('slider_no_transition');
				});
			});
		}
	}

	const prevSlide = () => {
		if (isAnimating) return;
		isAnimating = true;
		currentIndex -= 1;
		updatePosition();
	}
	const nextSlide = () => {
		if (isAnimating) return;
		isAnimating = true;
		currentIndex += 1;
		updatePosition();
	}

	prevEl.addEventListener('click', prevSlide);
	nextEl.addEventListener('click', nextSlide);

	createClones();
	setStartPosition();

	sliderEl.addEventListener('click', () => {
		sliderEl.focus();
	});

	let startMouseX = 0;
	let startTranslateX = 0;

	const mouseMoveHandler = e => {
		const mouseMoveDistance = e.pageX - startMouseX;
		const currentTranslate = startTranslateX + mouseMoveDistance;
		sliderEl.style.transform = `translateX(${startTranslateX + mouseMoveDistance}px)`;

		const tempIndex = Math.round(-currentTranslate / itemWidth);
		const { originalLength } = getSliderState();

		if (tempIndex >= originalLength + cloneCount) {
			startTranslateX += originalLength * itemWidth;
		}
		if (tempIndex < cloneCount) {
			startTranslateX -= originalLength * itemWidth;
		}
	}

	const mouseUpHandler = e => {
		const mouseMoveDistance = e.pageX - startMouseX;
		const currentTranslate = startTranslateX + mouseMoveDistance;
		currentIndex = Math.round(-currentTranslate / itemWidth);
		sliderEl.classList.remove('slider_no_transition');
		updatePosition();

		window.removeEventListener('mousemove', mouseMoveHandler);
		window.removeEventListener('mouseup', mouseUpHandler);
		window.removeEventListener('mouseleave', mouseUpHandler);
	}

	sliderEl.addEventListener('mousedown', e => {
		if (isAnimating) return;
		e.preventDefault();
		startMouseX = e.pageX;
		startTranslateX = -(currentIndex * itemWidth);
		sliderEl.classList.add('slider_no_transition');

		window.addEventListener('mousemove', mouseMoveHandler);
		window.addEventListener('mouseup', mouseUpHandler);
		window.addEventListener('mouseleave', mouseUpHandler);
	});

	sliderEl.addEventListener('keydown', e => {
		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();
				nextSlide();
				break;
			case 'ArrowLeft':
				e.preventDefault();
				prevSlide();
				break;
		}
	});

	sliderEl.addEventListener('transitionend', () => {
		checkClones();
		isAnimating = false;
	});

	const resizeObserver = new ResizeObserver(() => {
		const clones = sliderEl.querySelectorAll('[data-clone]');
		clones.forEach(clone => clone.remove());
		const realIndex = currentIndex - cloneCount;
		createClones();
		setStartPosition();
		currentIndex += realIndex;
		updatePosition();
	});
	resizeObserver.observe(viewportEl);

}