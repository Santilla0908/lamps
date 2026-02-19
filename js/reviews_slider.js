const reviewsButtonPrevEl = document.querySelector('.reviews_slick_prev');
const reviewsButtonNextEl = document.querySelector('.reviews_slick_next');
const sliderViewportEl = document.querySelector('.reviews_slider');
const reviewsItemEls = [...document.querySelectorAll('.reviews_item')];

const getMaxScroll = () => {
	return sliderViewportEl.scrollWidth - sliderViewportEl.clientWidth;
};

const getItemWidth = () => {
	return reviewsItemEls[0].offsetWidth;
};

const updateButtons = () => {
	const maxScroll = getMaxScroll();
	reviewsButtonPrevEl.classList.toggle('inactive', sliderViewportEl.scrollLeft <= 0);
	reviewsButtonNextEl.classList.toggle('inactive', sliderViewportEl.scrollLeft >= maxScroll);
}

updateButtons();

reviewsButtonNextEl.addEventListener('click', () => {
	sliderViewportEl.scrollLeft += getItemWidth();
});

reviewsButtonPrevEl.addEventListener('click', () => {
	sliderViewportEl.scrollLeft -= getItemWidth();
});

sliderViewportEl.addEventListener('scroll', updateButtons);
window.addEventListener('resize', () => {
	const maxScroll = getMaxScroll();
	if (sliderViewportEl.scrollLeft > maxScroll) {
		sliderViewportEl.scrollLeft = maxScroll;
	}

	updateButtons();
});