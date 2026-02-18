const reviewsButtonPrevEl = document.querySelector('.reviews_slick_prev');
const reviewsButtonNextEl = document.querySelector('.reviews_slick_next');
const viewportEl = document.querySelector('.reviews_viewport');
const containerReviewsSliderEl = document.querySelector('.reviews_slider');
const reviewsItemEls = [...document.querySelectorAll('.reviews_item')];

let currentIndex = 0;

const getSliderData = () => {
	const widthOfItem = reviewsItemEls[0].getBoundingClientRect().width;
	const visibleItems = Math.round(viewportEl.offsetWidth / widthOfItem );
	const maxIndex = reviewsItemEls.length - visibleItems;

	return { widthOfItem, maxIndex };
}

const updateButtons = () => {
	const { maxIndex } = getSliderData();
	reviewsButtonPrevEl.classList.toggle('inactive', currentIndex === 0);
	reviewsButtonNextEl.classList.toggle('inactive', currentIndex === maxIndex);
}

updateButtons();

const updateSliderPosition = () => {
	const { widthOfItem } = getSliderData();
	containerReviewsSliderEl.style.transform = `translateX(-${currentIndex * widthOfItem}px)`;
}

reviewsButtonNextEl.addEventListener('click', () => {
	const { maxIndex } = getSliderData();
	if (currentIndex < maxIndex) {
		currentIndex += 1;
		updateButtons();
		updateSliderPosition();
	}
});

reviewsButtonPrevEl.addEventListener('click', () => {
	if (currentIndex > 0) {
		currentIndex -= 1;
		updateButtons();
		updateSliderPosition();
	}
});

window.addEventListener('resize', () => {
	const { maxIndex } = getSliderData();
	if (currentIndex > maxIndex) {
		currentIndex = maxIndex;
	}
	updateButtons();
	updateSliderPosition();
});