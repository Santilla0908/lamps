{
	const prevEl = document.querySelector('.advantages_slick_prev');
	const nextEl = document.querySelector('.advantages_slick_next');
	const sliderEl = document.querySelector('.advantages_slider');
	const originalItemEls = [ ...document.querySelectorAll('.advantage_item') ];

	let currentIndex = 0;
	let itemWidth = 0;
	let visibleItems = 0;
	let cloneCount = 0;
	let isScrolling = false;

	const updateSliderState = () => {
		const newItemWidth = sliderEl.children[0].offsetWidth;
		const newVisibleItems = Math.round(sliderEl.offsetWidth / newItemWidth);

		itemWidth = newItemWidth;
		visibleItems = newVisibleItems;
		cloneCount = newVisibleItems;
	}

	const createClones = () => {
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
		currentIndex = cloneCount;
		sliderEl.scrollLeft = itemWidth * currentIndex;
	}

	const checkClones = () => {
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
		if (isScrolling) return;
		currentIndex -= 1;
		isScrolling = true;

		sliderEl.scrollTo({
			left: currentIndex * itemWidth,
			behavior: "smooth",
		});
		setTimeout(() => {
			checkClones();
			isScrolling = false;
		}, 300);
	}

	const nextSlide = () => {
		if (isScrolling) return;
		currentIndex += 1;
		isScrolling = true;

		sliderEl.scrollTo({
			left: currentIndex * itemWidth,
			behavior: "smooth",
		});
		setTimeout(() => {
			checkClones();
			isScrolling = false;
		}, 300);
	}

	prevEl.addEventListener('click', prevSlide);
	nextEl.addEventListener('click', nextSlide);
	sliderEl.addEventListener('click', () => {
		sliderEl.focus();
	});

	updateSliderState();
	createClones();
	setStartPosition();

	const maxScrollLeft = sliderEl.scrollWidth - sliderEl.clientWidth;
	const minScrollLeft = 0;
	const resetScrollPosition = sliderEl.scrollLeft;
	const reset2ScrollPosition = resetScrollPosition + ((originalItemEls.length - cloneCount) * itemWidth);
	let scrollStartPos = resetScrollPosition;
	let pointerStartX;

	const mouseMoveHandler = e => {
		const moveX = pointerStartX - e.pageX;
		sliderEl.scrollLeft = (() => {
			const toScroll = scrollStartPos + moveX;
			if (moveX >= 0) {
				if (toScroll <= maxScrollLeft) return toScroll;
				const overflow = toScroll - maxScrollLeft;
				return resetScrollPosition + overflow;
			} else {
				if (toScroll >= minScrollLeft) return toScroll;
				const overflow = minScrollLeft - toScroll;
				return reset2ScrollPosition - overflow;
			}
		})();
	};

	const mouseUpHandler = e => {
		window.removeEventListener('mousemove', mouseMoveHandler);
		window.removeEventListener('mouseup', mouseUpHandler);
		window.removeEventListener('mouseleave', mouseUpHandler);

		currentIndex = Math.round(sliderEl.scrollLeft / itemWidth);

		sliderEl.scrollTo({
			left: currentIndex * itemWidth,
			behavior: "smooth"
		});
		setTimeout(() => {
			checkClones();
			isScrolling = false;
		}, 300);
	}

	sliderEl.addEventListener('mousedown', e => {
		e.preventDefault();

		pointerStartX = e.pageX;
		scrollStartPos = sliderEl.scrollLeft;

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

	const observer = new ResizeObserver(() => {
		updateSliderState();
		sliderEl.scrollTo({
			left: currentIndex * itemWidth,
			behavior: 'auto'
		});
		setTimeout(() => {
			checkClones();
			isScrolling = false;
		}, 300);
	});

	observer.observe(sliderEl);
}