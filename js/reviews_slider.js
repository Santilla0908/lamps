const reviewsButtonPrevEl = document.querySelector('.reviews_slick_prev');
const reviewsButtonNextEl = document.querySelector('.reviews_slick_next');
const viewportEl = document.querySelector('.reviews_viewport');
const containerReviewsSliderEl = document.querySelector('.reviews_slider');
const reviewsItemEls = [...document.querySelectorAll('.reviews_item')];

let currentIndex = 0;

const widthOfItem = reviewsItemEls[0].offsetWidth;

const visibleItems = Math.floor(viewportEl.offsetWidth / widthOfItem );

const maxIndex = reviewsItemEls.length - visibleItems;

console.log("item width:", widthOfItem);
console.log("viewport width:", viewportEl.offsetWidth);
console.log("visibleItems:", visibleItems);
console.log("maxIndex:", maxIndex);

const updateSliderPosition = () => {
	const offset = currentIndex * widthOfItem;

	console.log("offset:", offset);

	containerReviewsSliderEl.style.transform = `translateX(-${offset}px)`;
}

reviewsButtonNextEl.addEventListener('click', () => {
	if (currentIndex < maxIndex) {
		currentIndex += 1;
		updateSliderPosition();
	}
});

reviewsButtonPrevEl.addEventListener('click', () => {
	if (currentIndex > 0) {
		currentIndex -= 1;
		updateSliderPosition();
	}
});