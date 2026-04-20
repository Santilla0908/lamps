{
	function initSlider( { prevEl, nextEl, viewportEl, sliderEl, itemEls, disableKeyboardCondition } ) {
		const originalItemEls = [...itemEls];
		originalItemEls.forEach((item, index) => {
			item.dataset.index = index.toString();
		});

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
				clone.dataset.index = originalItemEls[i].dataset.index;
				sliderEl.prepend(clone);
			}

			for (let i = 0; i < state.cloneCount; i++) {
				const clone = originalItemEls[i].cloneNode(true);
				clone.dataset.clone = "true";
				clone.dataset.index = originalItemEls[i].dataset.index;
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

		sliderEl.classList.add('slider_no_transition');

		createClones();
		setStartPosition();

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				sliderEl.classList.remove('slider_no_transition');
			});
		});

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
			if (disableKeyboardCondition && disableKeyboardCondition()) return;
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

	initSlider({
		prevEl: document.querySelector('.advantages_slick_prev'),
		nextEl: document.querySelector('.advantages_slick_next'),
		viewportEl: document.querySelector('.viewport_advantages_slider'),
		sliderEl: document.querySelector('.advantages_slider'),
		itemEls: document.querySelectorAll('.advantage_item')
	});

	const modalEl = document.querySelector('.modal_certificates');

	initSlider({
		prevEl: document.querySelector('.slider_certificates_prev'),
		nextEl: document.querySelector('.slider_certificates_next'),
		viewportEl: document.querySelector('.viewport_slider_certificates'),
		sliderEl: document.querySelector('.certificates_slider'),
		itemEls: document.querySelectorAll('.certificates_item'),
		disableKeyboardCondition: () => modalEl.classList.contains('active')
	});
}

