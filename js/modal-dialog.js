{
	const modalEl = document.querySelector('.dialog');
	const openModalEls = document.querySelectorAll('.open_modal');
	const closeModalEl = document.querySelector('.modal_close');
	const submitBtnEl = document.querySelector('.submit_btn');
	const toastEl = document.querySelector('.toast');

	openModalEls.forEach(button => {
		button.addEventListener('click', () => {
			modalEl.showModal();
			document.body.classList.add('scroll-block');
		});
	});

	closeModalEl.addEventListener('click', () => {
		modalEl.close();
	});

	submitBtnEl.addEventListener('click', e => {
		modalEl.close('success');
	});

	const showToast = () => {
		toastEl.classList.add('toast_show');
		setTimeout(() => {
			toastEl.classList.remove('toast_show');
		}, 3000);
	}

	modalEl.addEventListener('click', e => {
		const isOverlayClick = e.target === e.currentTarget;
		if (isOverlayClick) modalEl.close();
	});

	modalEl.addEventListener('close', () => {
		document.body.classList.remove('scroll-block');
		if (modalEl.returnValue === 'success') return showToast();
	});
}
