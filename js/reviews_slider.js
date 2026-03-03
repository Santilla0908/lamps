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

	const prevSlide = () => {
		const { widthOfItem } = getSliderState();
		currentIndex -= 1;
		sliderEl.scrollTo({
			left: currentIndex * widthOfItem,
			behavior: "smooth",
		});
		updateButtons();
	}

	const nextSlide = () => {
		const { widthOfItem } = getSliderState();
		currentIndex += 1;
		sliderEl.scrollTo({
			left: currentIndex * widthOfItem,
			behavior: "smooth",
		});
		updateButtons();
	}

	prevEl.addEventListener('click', prevSlide);
	nextEl.addEventListener('click', nextSlide);

	sliderEl.addEventListener('click', () => {
		sliderEl.focus();
	});

	let isDragging = false;
	let startX = 0;
	let startScrollLeft = 0;

	sliderEl.addEventListener('mousedown', e => {
		e.preventDefault();
		isDragging = true;
		startX = e.clientX;
		startScrollLeft = sliderEl.scrollLeft;
		sliderEl.classList.add('dragging');
	});

	sliderEl.addEventListener('mousemove', e => {
		if (!isDragging) return;
		const moveX = e.clientX - startX;
		sliderEl.scrollLeft = startScrollLeft - moveX;
	});

	sliderEl.addEventListener('mouseup', () => {
		if (!isDragging) return;
		isDragging = false;
		sliderEl.classList.remove('dragging');

		const { widthOfItem, maxIndex } = getSliderState();
		let newIndex = Math.round(sliderEl.scrollLeft / widthOfItem);
		if (newIndex < 0) {
			newIndex = 0;
		}
		if (newIndex > maxIndex) {
			newIndex = maxIndex;
		}
		currentIndex = newIndex;
		sliderEl.scrollTo({
			left: currentIndex * widthOfItem,
			behavior: "smooth"
		});
		updateButtons();
	});

	sliderEl.addEventListener('mouseleave', () => {
		isDragging = false;
	});

	sliderEl.addEventListener('keydown', e => {
		const { maxIndex } = getSliderState();

		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();
				if (currentIndex < maxIndex) nextSlide();
				break;
			case 'ArrowLeft':
				e.preventDefault();
				if (currentIndex > 0) prevSlide();
				break;
		}
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