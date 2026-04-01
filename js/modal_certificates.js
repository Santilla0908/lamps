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
	const zoomEl = document.querySelector('.zoom_btn');

	totalCounter.innerText = modalItemEls.length;
	let currentSlideIndex = 0;
	let isDragging = false;
	let isZoomed = false;
	let cachedWidth = 0;
	let currentTranslateX = 0;

	let activeImg = null;
	const getActiveImg = () => {
		return modalItemEls[currentSlideIndex]?.querySelector('.modal_img')
	}

	const getSliderState = () => {
		if (!cachedWidth) {
			cachedWidth = modalItemEls[0]?.offsetWidth || 0;
		}
		return {
			widthOfItem: cachedWidth,
			maxIndex: modalItemEls.length - 1
		}
	}

	const updateButtons = () => {
		const { maxIndex } = getSliderState();
		prevEl.disabled = currentSlideIndex === 0;
		nextEl.disabled = currentSlideIndex === maxIndex;
	}

	const disableTransitionTemporarily = () => {
		sliderEl.classList.add('slider_no_transition');
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				sliderEl.classList.remove('slider_no_transition');
			});
		});
	}

	const scrollToSlide = index => {
		const { widthOfItem } = getSliderState();
		sliderEl.style.transform = `translateX(-${index * widthOfItem}px)`;

		currentCounter.innerText = index + 1;
		currentSlideIndex = index;
		updateButtons();
	}

	certificatesItemEls.forEach((item, index) => {
		item.addEventListener('click', () => {
			modalEl.classList.add('active');
			disableTransitionTemporarily();
			scrollToSlide(index);
		});
	});

	closeModalEl.addEventListener('click', () => {
		modalEl.classList.remove('active');
	});

	modalEl.addEventListener('click', e => {
		activeImg = getActiveImg();
		const imgRect = activeImg.getBoundingClientRect();

		const pointerX = e.clientX;
		const pointerY = e.clientY;

		const isInteractive = e.target.closest('.zoom_btn, .close_btn, .arrow_left, .arrow_right');

		const isOutsideImage = pointerX < imgRect.left || pointerX > imgRect.right || pointerY < imgRect.top || pointerY > imgRect.bottom;

		if (!isInteractive && isOutsideImage && !isDragging && !isZoomed) {
			modalEl.classList.remove('active');
		}
	});

	const prevSlide = () => {
		if (currentSlideIndex <= 0) return;
		disableTransitionTemporarily();
		scrollToSlide(currentSlideIndex - 1);
	}

	const nextSlide = () => {
		const { maxIndex } = getSliderState();
		if (currentSlideIndex >= maxIndex) return;
		disableTransitionTemporarily();
		scrollToSlide(currentSlideIndex + 1);
	}

	prevEl.addEventListener('click', prevSlide);
	nextEl.addEventListener('click', nextSlide);

	let currentTranslateY = 0;
	let zoomTranslateY = 0;
	let startMouseX = 0;
	let startMouseY = 0;
	let startZoomY = 0;
	let startMouseYZoom = 0;
	let startTranslateX = 0;
	const thresholdY = 150;
	let dragDirection = null;
	const zoomScale = 1.1;

	const updateImageScale = () => {
		activeImg = getActiveImg();
		if (!activeImg) return;
		const scale = isZoomed ? zoomScale : 1;
		activeImg.style.transform = `scale(${scale}) translateY(${zoomTranslateY}px)`;
		activeImg.classList.toggle('zoomed', isZoomed);
	}

	const toggleZoom = () => {
		activeImg = getActiveImg();
		isZoomed = !isZoomed;
		if (!isZoomed) zoomTranslateY = 0;
		updateImageScale();
	}

	modalItemEls.forEach(item => {
		const img = item.querySelector('.modal_img');
		img.addEventListener('click', e => {
			if (isDragging) return;
			toggleZoom();
		});
	});

	zoomEl.addEventListener('click', toggleZoom);

	const mouseMoveHandler = e => {
		if (isZoomed) {
			const mouseMoveDistance = e.pageY - startMouseYZoom;
			if (Math.abs(mouseMoveDistance) > 5) {
				isDragging = true;
			}
			zoomTranslateY = startZoomY +  mouseMoveDistance;
			updateImageScale();
			return;
		}

		const mouseMoveDistanceX = e.pageX - startMouseX;
		const mouseMoveDistanceY = e.pageY - startMouseY;

		if (!dragDirection) {
			if (Math.abs(mouseMoveDistanceX) > 5 || Math.abs(mouseMoveDistanceY) > 5) {
				dragDirection = Math.abs(mouseMoveDistanceX) > Math.abs(mouseMoveDistanceY) ? 'x' : 'y';
				isDragging = true;
			}
		}

		currentTranslateX = startTranslateX;

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
		e.preventDefault();
		if (isZoomed) {
			requestAnimationFrame(() => {
				activeImg.classList.remove('no-transition');
			});
			window.removeEventListener('mousemove', mouseMoveHandler);
			window.removeEventListener('mouseup', mouseUpHandler);
			return;
		}
		const mouseMoveDistanceX = e.pageX - startMouseX;
		const mouseMoveDistanceY = e.pageY - startMouseY;

		const { widthOfItem, maxIndex } = getSliderState();

		const finalTranslateX = startTranslateX + mouseMoveDistanceX;

		let newIndex =  Math.round(-finalTranslateX / widthOfItem);
		if (newIndex < 0) newIndex = 0;
		if (newIndex > maxIndex) newIndex = maxIndex;

		if (dragDirection === 'y' && Math.abs(mouseMoveDistanceY) > thresholdY) {
			modalEl.classList.remove('active');
		} else {
			scrollToSlide(newIndex);
		}

		window.removeEventListener('mousemove', mouseMoveHandler);
		window.removeEventListener('mouseup', mouseUpHandler);
		window.removeEventListener('mouseleave', mouseUpHandler);
	}

	sliderEl.addEventListener('mousedown', e => {
		e.preventDefault();

		if (isZoomed) {
			activeImg = getActiveImg();
			startMouseYZoom = e.pageY;
			startZoomY = zoomTranslateY;

			activeImg.classList.add('no-transition');
		} else {
			startMouseX = e.pageX;
			startMouseY = e.pageY;
			startTranslateX = -(currentSlideIndex * getSliderState().widthOfItem);
		}

		isDragging = false;
		dragDirection = null;
		window.addEventListener('mousemove', mouseMoveHandler);
		window.addEventListener('mouseup', mouseUpHandler);
		window.addEventListener('mouseleave', mouseUpHandler);
	});

	window.addEventListener('keydown', e => {
		//if (!modalEl.classList.contains('active') || isZoomed) return;
		//e.stopPropagation();
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

	modalEl.addEventListener('wheel', e => {
		if (!modalEl.classList.contains('active') || isZoomed) return;
		e.preventDefault();
		if (e.deltaY > 0) nextSlide();
		else prevSlide();
	}, { passive: false });

	const resizeObserver = new ResizeObserver(() => {
		cachedWidth = 0;
		scrollToSlide(currentSlideIndex);
	});
	resizeObserver.observe(viewportEl);
}
