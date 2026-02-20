{
	const modalEl = document.querySelector('.dialog');
	const openModalEls = document.querySelectorAll('.open_modal');
	const closeModalEl = document.querySelector('.modal_close');

	openModalEls.forEach(button => {
		button.addEventListener('click', () => {
			modalEl.showModal();
			document.body.classList.add('scroll-block');
		});
	});

	closeModalEl.addEventListener('click', () => {
		modalEl.close();
	});

	modalEl.addEventListener('click', e => {
		const isOverlayClick = e.target === e.currentTarget;
		if (isOverlayClick) modalEl.close();
	});

	modalEl.addEventListener('close', () => {
		document.body.classList.remove('scroll-block');
	});
}
