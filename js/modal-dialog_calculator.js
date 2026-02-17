const openButtonModalCalculatorEl = document.querySelector('.calculator_total_link');
const modalCalculatorEl = document.querySelector('.dialog_calculator');
const closeButtonModalCalculatorEl = document.querySelector('.modal_close_calculator');

const openCalculatorModal = e => {
	e.preventDefault();
	modalCalculatorEl.showModal();
	document.body.classList.add('scroll-block');
}

const enablePageScroll = () => {
	document.body.classList.remove('scroll-block');
}

const closeCalculatorModal = () => {
	modalCalculatorEl.close();
}

const closeOnOverlayClick = e => {
	const isOverlayClick = e.target === e.currentTarget;
	if (isOverlayClick) return closeCalculatorModal();
}

openButtonModalCalculatorEl.addEventListener('click', openCalculatorModal);
closeButtonModalCalculatorEl.addEventListener('click', closeCalculatorModal);
modalCalculatorEl.addEventListener('click', closeOnOverlayClick);
modalCalculatorEl.addEventListener('click', enablePageScroll);