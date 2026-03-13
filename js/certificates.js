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

	prevEl.addEventListener('click', prevSlide);
	nextEl.addEventListener('click', nextSlide);

	createClones();
	setStartPosition();

	const dragState = {
		isDragging: false,
		startMouseX: 0,
		startTranslateX: 0
	}

	sliderEl.addEventListener('click', () => {
		sliderEl.focus();
	});

	sliderEl.addEventListener('mousedown', e => {
		if (sliderState.isAnimating) return;

		dragState.isDragging = true;
		dragState.startMouseX = e.clientX;
		dragState.startTranslateX = -(sliderState.currentIndex * sliderState.itemWidth);
		sliderEl.classList.add('slider_no_transition');
	});

	sliderEl.addEventListener('mousemove', e => {
		if (!dragState.isDragging) return;
		const mouseMoveDistance = e.clientX - dragState.startMouseX;
		sliderEl.style.transform = `translateX(${dragState.startTranslateX + mouseMoveDistance}px)`;
	});

	sliderEl.addEventListener('mouseup', e => {
		if (!dragState.isDragging) return;
		dragState.isDragging = false;
		sliderEl.classList.remove('slider_no_transition');
		const mouseMoveDistance = e.clientX - dragState.startMouseX;
		const currentTranslate = dragState.startTranslateX + mouseMoveDistance;
		sliderState.currentIndex = Math.round(-currentTranslate / sliderState.itemWidth);
		updatePosition();
	});

	sliderEl.addEventListener('mouseleave', e => {
		if (!dragState.isDragging) return;
		dragState.isDragging = false;
		sliderEl.classList.remove('slider_no_transition');
		const mouseMoveDistance = e.clientX - dragState.startMouseX;
		const currentTranslate = dragState.startTranslateX + mouseMoveDistance;
		sliderState.currentIndex = Math.round(-currentTranslate / sliderState.itemWidth);
		updatePosition();
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
		sliderState.isAnimating = false;
	});

	const resizeObserver = new ResizeObserver(() => {
		const clones = sliderEl.querySelectorAll('[data-clone]');
		clones.forEach(clone => clone.remove());

		const realIndex = sliderState.currentIndex - sliderState.cloneCount;
		createClones();
		setStartPosition();
		sliderState.currentIndex += realIndex;
		updatePosition();
	});
	resizeObserver.observe(viewportEl);
}