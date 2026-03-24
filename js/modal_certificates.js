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

	modalEl.addEventListener('click', e => {
		const currentImg = modalItemEls[currentSlideIndex].querySelector('.modal_img');
		const imgRect = currentImg.getBoundingClientRect();

		const pointerX = e.clientX;
		const pointerY = e.clientY;

		const isInteractive = e.target.closest('.zoom_btn, .close_btn, .arrow_left, .arrow_right');

		const isOutsideImage = pointerX < imgRect.left || pointerX > imgRect.right || pointerY < imgRect.top || pointerY > imgRect.bottom;

		if (!isInteractive && isOutsideImage && !isDragging) {
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
	let startMouseY = 0;
	let currentTranslateY = 0;
	const thresholdY = 150;
	let dragDirection = null;

	const mouseMoveHandler = e => {
		const mouseMoveDistanceX = e.pageX - startMouseX;
		const mouseMoveDistanceY = e.pageY - startMouseY;

		if (!dragDirection) {
			if (Math.abs(mouseMoveDistanceX) > 5 || Math.abs(mouseMoveDistanceY) > 5) {
				dragDirection = Math.abs(mouseMoveDistanceX) > Math.abs(mouseMoveDistanceY) ? 'x' : 'y';
				isDragging = true;
			}
		}

		let currentTranslateX = startTranslateX;

		if (dragDirection === 'x') {
			currentTranslateX = startTranslateX + mouseMoveDistanceX;

			const { widthOfItem, maxIndex } = getSliderState();

			const maxTranslate = 0;
			const minTranslate = -maxIndex * widthOfItem;

			if (currentTranslateX > maxTranslate) currentTranslateX = maxTranslate;
			if (currentTranslateX < minTranslate) currentTranslateX = minTranslate;
			currentTranslateY = 0;
		}

		if (dragDirection === 'y') {
			currentTranslateY = mouseMoveDistanceY;
		}

		sliderEl.style.transform = `translateX(${currentTranslateX}px) translateY(${currentTranslateY}px)`;
	}

	const mouseUpHandler = e => {
		const mouseMoveDistanceX = e.pageX - startMouseX;
		const mouseMoveDistanceY = e.pageY - startMouseY;

		const { widthOfItem, maxIndex } = getSliderState();

		const currentTranslateX = startTranslateX + mouseMoveDistanceX;

		let newIndex =  Math.round(-currentTranslateX / widthOfItem);
		if (newIndex < 0) newIndex = 0;
		if (newIndex > maxIndex) newIndex = maxIndex;

		if (dragDirection === 'y' && Math.abs(mouseMoveDistanceY) > thresholdY) {
			modalEl.classList.remove('active');
		} else {
			scrollToSlide(newIndex);
		}

		window.removeEventListener('mousemove', mouseMoveHandler);
		window.removeEventListener('mouseup', mouseUpHandler);
		window.addEventListener('mouseleave', mouseUpHandler);
	}

	sliderEl.addEventListener('mousedown', e => {
		e.preventDefault();
		startMouseX = e.pageX;
		startMouseY = e.pageY;

		startTranslateX = -(currentSlideIndex * getSliderState().widthOfItem);
		isDragging = false;
		dragDirection = null;
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
