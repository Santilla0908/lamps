const dialog = document.querySelector('.dialog');
const openModalButtons = document.querySelectorAll('.open_modal');
const modalClose = document.querySelector('.modal_close');

function closeOnOverlayClick({ currentTarget, target }) {
	const isOnOverlayClick = target === currentTarget;
	if (isOnOverlayClick) {
		close();
	}
}

function openModalAndBlockScroll() {
	dialog.showModal();
	document.body.classList.add('scroll-block');
}

function returnScroll() {
	document.body.classList.remove('scroll-block');
}

function close() {
	dialog.close();
	returnScroll();
}

openModalButtons.forEach(button => {
	button.addEventListener('click', openModalAndBlockScroll);
});
modalClose.addEventListener('click', close);
dialog.addEventListener('click', closeOnOverlayClick);
dialog.addEventListener('cancel', () => {
	returnScroll();
});