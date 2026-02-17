const modalDialogEl = document.querySelector('.dialog');
const openModalButtonEls = document.querySelectorAll('.open_modal');
const modalCloseButtonEl = document.querySelector('.modal_close');

const openModal = () => {
	modalDialogEl.showModal();
	document.body.classList.add('scroll-block');
}

const enableScroll = () => {
	document.body.classList.remove('scroll-block');
}

const closeModal = () => {
	modalDialogEl.close();
}

const handleOverlayClick = e => {
	const isOverlayClick = e.target === e.currentTarget;
	if (isOverlayClick) return closeModal();
}

openModalButtonEls.forEach(button => {
	button.addEventListener('click', openModal);
});
modalCloseButtonEl.addEventListener('click', closeModal);
modalDialogEl.addEventListener('click', handleOverlayClick);
modalDialogEl.addEventListener('close', enableScroll);