{
	const prevEl = document.querySelector('.advantages_slick_prev');
	const nextEl = document.querySelector('.advantages_slick_next');
	const sliderEl = document.querySelector('.advantages_slider');
	const originalItemEls = [ ...document.querySelectorAll('.advantage_item') ];

	const sliderState = {
		currentIndex: 0,
		itemWidth: 0,
		visibleItems: 0,
		cloneCount: 0,
		isScrolling: false
	}

	const updateSliderState = () => {
		const itemWidth = sliderEl.children[0].offsetWidth;
		const visibleItems = Math.round(sliderEl.offsetWidth / itemWidth);

		sliderState.itemWidth = itemWidth;
		sliderState.visibleItems = visibleItems;
		sliderState.cloneCount = visibleItems;
	}

	const createClones = () => {

		const originalLength = originalItemEls.length;

		for (let i = originalLength - 1; i >= originalLength - sliderState.cloneCount; i--) {
			const clone = originalItemEls[i].cloneNode(true);
			sliderEl.prepend(clone);
		}
		for (let i = 0; i < sliderState.cloneCount; i++) {
			const clone = originalItemEls[i].cloneNode(true);
			sliderEl.append(clone);
		}
	}

	const setStartPosition = () => {
		sliderState.currentIndex = sliderState.cloneCount;
		sliderEl.scrollLeft = sliderState.itemWidth * sliderState.currentIndex;
	}

	const checkClones = () => {
		const originalLength = originalItemEls.length;

		if (sliderState.currentIndex >= originalLength + sliderState.cloneCount) {
			sliderState.currentIndex -= originalLength;
			sliderEl.scrollLeft = sliderState.currentIndex * sliderState.itemWidth;
		}

		if (sliderState.currentIndex < sliderState.cloneCount) {
			sliderState.currentIndex += originalLength;
			sliderEl.scrollLeft = sliderState.currentIndex * sliderState.itemWidth;
		}
	}

	const prevSlide = () => {
		if (sliderState.isScrolling) return;
		sliderState.currentIndex -= 1;
		sliderState.isScrolling = true;

		sliderEl.scrollTo({
			left: sliderState.currentIndex * sliderState.itemWidth,
			behavior: "smooth",
		});
	}

	const nextSlide = () => {
		if (sliderState.isScrolling) return;
		sliderState.currentIndex += 1;
		sliderState.isScrolling = true;

		sliderEl.scrollTo({
			left: sliderState.currentIndex * sliderState.itemWidth,
			behavior: "smooth",
		});
	}

	prevEl.addEventListener('click', prevSlide);
	nextEl.addEventListener('click', nextSlide);

	updateSliderState();
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
		sliderState.currentIndex = sliderEl.scrollLeft / sliderState.itemWidth;
	});

	sliderEl.addEventListener('mouseup', () => {
		if (!isDragging) return;
		isDragging = false;
		sliderEl.classList.remove('drag');

		sliderState.currentIndex = Math.round(sliderEl.scrollLeft / sliderState.itemWidth);
		checkClones();

		sliderEl.scrollTo({
			left: sliderState.currentIndex * sliderState.itemWidth,
			behavior: "smooth"
		});
	});

	sliderEl.addEventListener('mouseleave', () => {
		isDragging = false;
		sliderEl.classList.remove('drag');

		sliderState.currentIndex = Math.round(sliderEl.scrollLeft / sliderState.itemWidth);

		sliderEl.scrollTo({
			left: sliderState.currentIndex * sliderState.itemWidth,
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
		updateSliderState();
		sliderEl.scrollTo({
			left: sliderState.currentIndex * sliderState.itemWidth,
			behavior: 'auto'
		});
	});

	/*sliderEl.addEventListener('scrollend', () => {
		sliderState.currentIndex = Math.round(sliderEl.scrollLeft / sliderState.itemWidth);
		checkClones();
		sliderState.isScrolling = false;
	});*/

	observer.observe(sliderEl);
}