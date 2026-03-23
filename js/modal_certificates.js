{
	const certificatesItemEls = [ ...document.querySelectorAll('.certificates_item:not([data-clone])') ];
	const modalEl = document.querySelector('.modal_certificates');
	const viewportEl = document.querySelector('.modal_slider');
	const sliderEl = document.querySelector('.modal_slider_track');
	const modalItemEls = [ ...document.querySelectorAll('.modal_slider_item')];
	const closeModalEl = document.querySelector('.close_btn');
	const prevEl = document.querySelector('.arrow_left');
	const nextEl = document.querySelector('.arrow_right');
	const currentCounter = document.querySelector('.current');
	const totalCounter = document.querySelector('.total');

	totalCounter.innerText = modalItemEls.length;
	let currentSlideIndex = 0;
	let isDragging = false;

	const getSliderState = () => {
		const widthOfItem = modalItemEls[0].offsetWidth;
		const maxIndex = modalItemEls.length - 1;
		return { widthOfItem, maxIndex };
	}

	const updateButtons = () => {
		const { maxIndex } = getSliderState();
		prevEl.disabled = currentSlideIndex === 0;
		nextEl.disabled = currentSlideIndex === maxIndex;
	}

	const scrollToSlide = ((index, withAnimation = true) => {
		if (!withAnimation) {
			sliderEl.classList.add('slider_no_transition');
		}
		const { widthOfItem } = getSliderState();
		sliderEl.style.transform = `translateX(-${index * widthOfItem}px)`;

		requestAnimationFrame(() => {
			sliderEl.classList.remove('slider_no_transition');
		});

		currentCounter.innerText = index + 1;
		currentSlideIndex = index;
		updateButtons();
	});

	certificatesItemEls.forEach((item, index) => {
		item.addEventListener('click', () => {
			sliderEl.classList.add('slider_no_transition');
			modalEl.classList.add('active');
			scrollToSlide(index);
			requestAnimationFrame(() => {
				sliderEl.classList.remove('slider_no_transition');
			});
		});
	});

	closeModalEl.addEventListener('click', () => {
		modalEl.classList.remove('active');
	});

	const interactiveSelectors = [
		'.zoom_btn',
		'.close_btn',
		'.arrow_left',
		'.arrow_right',
		'.modal_slider_item'
	];

	modalEl.addEventListener('click', e => {
		const isInteractive = interactiveSelectors.some(selector => e.target.closest(selector));
		if (!isInteractive && isDragging) {
			modalEl.classList.remove('active');
		}
	});

	const prevSlide = () => {
		if (currentSlideIndex <= 0) return;
		scrollToSlide(currentSlideIndex - 1, false);
	}

	const nextSlide = () => {
		const { maxIndex } = getSliderState();
		if (currentSlideIndex >= maxIndex) return;
		scrollToSlide(currentSlideIndex + 1, false);
	}

	prevEl.addEventListener('click', prevSlide);
	nextEl.addEventListener('click', nextSlide);

	let startMouseX = 0;
	let startTranslateX = 0;

	const mouseMoveHandler = e => {
		const mouseMoveDistance = e.pageX - startMouseX;

		if (Math.abs(mouseMoveDistance) > 5) isDragging = true;

		let currentTranslate = startTranslateX + mouseMoveDistance;
		const { widthOfItem, maxIndex } = getSliderState();
		const maxTranslate = 0;
		const minTranslate = -maxIndex * widthOfItem;

		if (currentTranslate > maxTranslate) currentTranslate = maxTranslate;
		if (currentTranslate < minTranslate) currentTranslate = minTranslate;

		sliderEl.style.transform = `translateX(${currentTranslate}px)`;
	}

	const mouseUpHandler = e => {
		const mouseMoveDistance = e.pageX - startMouseX;
		const currentTranslate = startTranslateX + mouseMoveDistance;
		const { widthOfItem, maxIndex } = getSliderState();
		let newIndex =  Math.round(-currentTranslate / widthOfItem);
		if (newIndex < 0) newIndex = 0;
		if (newIndex > maxIndex) newIndex = maxIndex;
		scrollToSlide(newIndex);
		window.removeEventListener('mousemove', mouseMoveHandler);
		window.removeEventListener('mouseup', mouseUpHandler);
		window.addEventListener('mouseleave', mouseUpHandler);
		setTimeout(() => isDragging = false, 0);
	}

	sliderEl.addEventListener('mousedown', e => {
		e.preventDefault();
		startMouseX = e.pageX;
		startTranslateX = -(currentSlideIndex * getSliderState().widthOfItem);
		isDragging = false;
		window.addEventListener('mousemove', mouseMoveHandler);
		window.addEventListener('mouseup', mouseUpHandler);
		window.removeEventListener('mouseleave', mouseUpHandler);
	});

	window.addEventListener('keydown', e => {
		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();
				nextSlide();
				break;
			case 'ArrowLeft':
				e.preventDefault();
				prevSlide();
				break;
			case 'Escape':
				modalEl.classList.remove('active');
		}
	});
}