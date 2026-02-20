{
	const modalDialogEl = document.querySelector('.dialog');
	const openModalButtonEls = document.querySelectorAll('.open_modal');
	const modalCloseButtonEl = document.querySelector('.modal_close');

	openModalButtonEls.forEach(button => {
		button.addEventListener('click', () => {
			modalDialogEl.showModal();
			document.body.classList.add('scroll-block');
		});
	});

	modalCloseButtonEl.addEventListener('click', () => {
		modalDialogEl.close();
	});

	modalDialogEl.addEventListener('click', e => {
		const isOverlayClick = e.target === e.currentTarget;
		if (isOverlayClick) modalDialogEl.close();
	});

	modalDialogEl.addEventListener('close', () => {
		document.body.classList.remove('scroll-block');
	});
}
