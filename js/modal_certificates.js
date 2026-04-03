{
	const certificateImgEls = [ ...document.querySelectorAll('.certificates_item_img') ];
	const modalEl = document.querySelector('.modal_certificates');
	const viewportEl = document.querySelector('.modal_slider');
	const sliderEl = document.querySelector('.modal_slider_track');
	const modalItemEls = [ ...document.querySelectorAll('.modal_slider_item')];
	const closeModalEl = document.querySelector('.close_btn');
	const prevEl = document.querySelector('.arrow_left');
	const nextEl = document.querySelector('.arrow_right');
	const currentCounterEl = document.querySelector('.current');
	const totalCounterEl = document.querySelector('.total');
	const ovCounterEl = document.querySelector('.ov_counter');
	const zoomEl = document.querySelector('.zoom_btn');

	totalCounterEl.innerText = modalItemEls.length;
	let currentSlideIndex = 0;
	let isDragging = false;
	let isZoomed = false;
	let cachedWidth = 0;
	let currentTranslateX = 0;

	const uiElements = [
		closeModalEl,
		zoomEl,
		prevEl,
		nextEl,
		ovCounterEl
	];

	let uiTimeout = null;
	let activeImg = null;

	const hideUI = () => {
		if (isZoomed) return;
		uiElements.forEach(el => el.classList.add('hidden_ui'));
	}

	const showUI = () => {
		if (!modalEl.classList.contains('active')) return;
		uiElements.forEach(el => el.classList.remove('hidden_ui'));
		clearTimeout(uiTimeout);
		uiTimeout = setTimeout(hideUI, 2000);
	}

	const handleUserActivity = () => {
		if (!modalEl.classList.contains('active')) return;
		showUI();
	}

	const addActivityListeners = () => {
		window.addEventListener('mousemove', handleUserActivity);
		window.addEventListener('mousedown', handleUserActivity);
		window.addEventListener('keydown', handleUserActivity);
		modalEl.addEventListener('wheel', handleUserActivity, { passive: true });
	};

	const removeActivityListeners = () => {
		window.removeEventListener('mousemove', handleUserActivity);
		window.removeEventListener('mousedown', handleUserActivity);
		window.removeEventListener('keydown', handleUserActivity);
		modalEl.removeEventListener('wheel', handleUserActivity);
	};

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
		prevEl.classList.toggle('disabled', currentSlideIndex === 0);
		nextEl.classList.toggle('disabled', currentSlideIndex === maxIndex);
	}

	const resetZoom = () => {
		isZoomed = false;
		zoomTranslateY = 0;

		const img = getActiveImg();
		if (img) {
			img.style.transform = '';
			img.classList.remove('zoomed');
		}
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
		resetZoom();
		const { widthOfItem } = getSliderState();

		currentSlideIndex = index;
		currentTranslateX = -(index * widthOfItem);

		sliderEl.style.transform = `translateX(${currentTranslateX}px) translateY(0)`;

		currentCounterEl.innerText = index + 1;
		updateButtons();
	}

	certificateImgEls.forEach((img, index) => {
		img.addEventListener('click', () => {
			modalEl.classList.add('active');
			document.body.classList.add('scroll-block');
			addActivityListeners();
			disableTransitionTemporarily();
			scrollToSlide(index);
			showUI();
		});
	});

	closeModalEl.addEventListener('click', () => {
		modalEl.classList.remove('active');
		document.body.classList.remove('scroll-block');
		clearTimeout(uiTimeout);
		removeActivityListeners();
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
		showUI();
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

		let newTranslateX = startTranslateX;

		if (dragDirection === 'x') {
			newTranslateX = startTranslateX + mouseMoveDistanceX;
			const { widthOfItem, maxIndex } = getSliderState();

			const maxTranslate = 0;
			const minTranslate = -maxIndex * widthOfItem;

			if (newTranslateX > maxTranslate) newTranslateX = maxTranslate;
			if (newTranslateX < minTranslate) newTranslateX = minTranslate;
			currentTranslateX = newTranslateX;
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

		const { widthOfItem, maxIndex } = getSliderState();

		let newIndex =  Math.round(-currentTranslateX / widthOfItem);
		if (newIndex < 0) newIndex = 0;
		if (newIndex > maxIndex) newIndex = maxIndex;

		if (dragDirection === 'y' && Math.abs(e.pageY - startMouseY) > thresholdY) {
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
			startTranslateX = currentTranslateX;
		}

		isDragging = false;
		dragDirection = null;
		window.addEventListener('mousemove', mouseMoveHandler);
		window.addEventListener('mouseup', mouseUpHandler);
		window.addEventListener('mouseleave', mouseUpHandler);
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

	let isWheelLocked = false;

	modalEl.addEventListener('wheel', e => {
		if (!modalEl.classList.contains('active') || isZoomed) return;
		e.preventDefault();
		if (isWheelLocked) return;
		isWheelLocked = true;
		if (e.deltaY > 0) nextSlide();
		else prevSlide();
		setTimeout(() => {
			isWheelLocked = false;
		}, 250);
	}, { passive: false });

	const resizeObserver = new ResizeObserver(() => {
		cachedWidth = 0;
		scrollToSlide(currentSlideIndex);
	});
	resizeObserver.observe(viewportEl);
}
