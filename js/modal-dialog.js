{
	const modalEl = document.querySelector('.dialog');
	const openModalEls = document.querySelectorAll('.open_modal');
	const closeModalEl = document.querySelector('.modal_close');
	const submitBtnEl = document.querySelectorAll('.submit_btn');
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

	let hideTimeout;

	toastEl.addEventListener('mouseenter', () => {
		clearTimeout(hideTimeout);
	});

	toastEl.addEventListener('mouseleave', () => {
		hideTimeout = setTimeout(() => {
			toastEl.classList.remove('toast_show');
		}, 1000);
	});

	const showToast = (duration = 3000) => {
		toastEl.classList.add('toast_show');
		clearTimeout(hideTimeout);
		hideTimeout = setTimeout(() => {
			toastEl.classList.remove('toast_show');
		}, duration);
	}

	submitBtnEl.forEach(button => {
		button.addEventListener('click', () => {
			const dialog = button.closest('.dialog');
			if (dialog) return modalEl.close('success');
			showToast();
		});
	});

	modalEl.addEventListener('click', e => {
		const isOverlayClick = e.target === e.currentTarget;
		if (isOverlayClick) modalEl.close();
	});

	modalEl.addEventListener('close', () => {
		document.body.classList.remove('scroll-block');
		if (modalEl.returnValue === 'success') return showToast();
	});
}
