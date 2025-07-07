const openBtn = document.querySelector('.calculator_total_link');
const modal = document.querySelector('.dialog_calculator');
const closeBtn = document.querySelector('.modal_close_calculator');

function blockScroll() {
	document.body.classList.add('scroll-block');
}

function unblockScroll() {
	document.body.classList.remove('scroll-block');
}

openBtn.addEventListener('click', (e) => {
	e.preventDefault();
	modal.showModal();
	blockScroll(); // Блокируем скролл
});

function closeModal() {
	modal.close();
	unblockScroll();
}

closeBtn.addEventListener('click', closeModal);


modal.addEventListener('click', (e) => {
	if (e.target === modal) {
		closeModal();
	}
});

modal.addEventListener('close', unblockScroll);