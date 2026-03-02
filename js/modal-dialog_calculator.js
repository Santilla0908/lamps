{
	const openModalEl = document.querySelector('.calculator_total_link');
	const modalEl = document.querySelector('.dialog_calculator');
	const closeModalEl = document.querySelector('.modal_close_calculator');

	openModalEl.addEventListener('click', e => {
		e.preventDefault();
		modalEl.showModal();
		document.body.classList.add('scroll-block');
	});

	closeModalEl.addEventListener('click', () => {
		modalEl.close();
	});

	modalEl.addEventListener('click', e => {
		const isOverlayClick = e.target === e.currentTarget;
		if (isOverlayClick) modalEl.close();
	});

	modalEl.addEventListener('click', () => {
		document.body.classList.remove('scroll-block');
	});
}
