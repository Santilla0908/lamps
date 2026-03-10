{
	const prevEl = document.querySelector('.advantages_slick_prev');
	const nextEl = document.querySelector('.advantages_slick_next');
	const sliderEl = document.querySelector('.advantages_slider');
	const originalItemEls = [ ...document.querySelectorAll('.advantage_item') ];

	let currentIndex = 0;

	const getSliderState = () => {
		const itemWidth = sliderEl.children[0].offsetWidth;
		const visibleItems = Math.round(sliderEl.offsetWidth / itemWidth);
		return {
			itemWidth,
			visibleItems,
			cloneCount: visibleItems
		};
	}

	const createClones = () => {
		const { cloneCount } = getSliderState();
		const originalLength = originalItemEls.length;

		for (let i = originalLength - 1; i >= originalLength - cloneCount; i--) {
			const clone = originalItemEls[i].cloneNode(true);
			sliderEl.prepend(clone);
		}
		for (let i = 0; i < cloneCount; i++) {
			const clone = originalItemEls[i].cloneNode(true);
			sliderEl.append(clone);
		}
	}

	const setStartPosition = () => {
		const { itemWidth, cloneCount } = getSliderState();
		currentIndex = cloneCount;
		sliderEl.scrollLeft = itemWidth * currentIndex;
	}

	const checkClones = () => {
		const { itemWidth, cloneCount } = getSliderState();
		const originalLength = originalItemEls.length;

		if (currentIndex >= originalLength + cloneCount) {
			currentIndex -= originalLength;
			sliderEl.scrollLeft = currentIndex * itemWidth;
		}

		if (currentIndex < cloneCount) {
			currentIndex += originalLength;
			sliderEl.scrollLeft = currentIndex * itemWidth;
		}
	}

	const prevSlide = () => {
		const { itemWidth } = getSliderState();
		currentIndex -= 1;
		sliderEl.scrollTo({
			left: currentIndex * itemWidth,
			behavior: "smooth",
		});
	}

	const nextSlide = () => {
		const { itemWidth } = getSliderState();
		currentIndex += 1;
		sliderEl.scrollTo({
			left: currentIndex * itemWidth,
			behavior: "smooth",
		});
	}

	prevEl.addEventListener('click', prevSlide);
	nextEl.addEventListener('click', nextSlide);

	createClones();
	setStartPosition();

	let isDragging = false;
	let startX = 0;
	let startScrollLeft = 0;

	sliderEl.addEventListener('click', () => {
		sliderEl.focus();
	});

	sliderEl.addEventListener('mousedown', e => {
		e.preventDefault();
		isDragging = true;
		startX = e.clientX;
		startScrollLeft = sliderEl.scrollLeft;
		sliderEl.classList.add('drag');
	});

	sliderEl.addEventListener('mousemove', e => {
		if (!isDragging) return;
		const moveX = e.clientX - startX;
		sliderEl.scrollLeft = startScrollLeft - moveX;
		const { itemWidth } = getSliderState();
		currentIndex = sliderEl.scrollLeft / itemWidth;
	});

	sliderEl.addEventListener('mouseup', () => {
		if (!isDragging) return;
		isDragging = false;
		sliderEl.classList.remove('drag');

		const { itemWidth } = getSliderState();
		currentIndex = Math.round(sliderEl.scrollLeft / itemWidth);
		checkClones();

		sliderEl.scrollTo({
			left: currentIndex * itemWidth,
			behavior: "smooth"
		});
	});

	sliderEl.addEventListener('mouseleave', () => {
		isDragging = false;
		sliderEl.classList.remove('drag');

		const { itemWidth } = getSliderState();
		currentIndex = Math.round(sliderEl.scrollLeft / itemWidth);

		sliderEl.scrollTo({
			left: currentIndex * itemWidth,
			behavior: "smooth"
		});
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

	const observer = new ResizeObserver(() => {
		const { itemWidth } = getSliderState();
		sliderEl.scrollTo({
			left: currentIndex * itemWidth,
			behavior: 'auto'
		});
	});
	sliderEl.addEventListener('scrollend', () => {
		const { itemWidth } = getSliderState();
		currentIndex = Math.round(sliderEl.scrollLeft / itemWidth);
		checkClones();
	});
	observer.observe(sliderEl);
}