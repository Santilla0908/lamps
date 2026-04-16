{
	const modalEl = document.querySelector('.dialog');
	const openModalEls = document.querySelectorAll('.open_modal');
	const closeModalEl = document.querySelector('.modal_close');
	const submitBtnEl = document.querySelectorAll('.submit_btn');
	const toastEl = document.querySelector('.toast');
	const formEls = [ ...document.querySelectorAll('.js_form') ];

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

	modalEl.addEventListener('click', e => {
		const isOverlayClick = e.target === e.currentTarget;
		if (isOverlayClick) modalEl.close();
	});

	modalEl.addEventListener('close', () => {
		document.body.classList.remove('scroll-block');
		if (modalEl.returnValue === 'success') return showToast();
	});

	formEls.forEach(form => {
		const nameInput = form.querySelector('input[name="name"]');
		const phoneInput = form.querySelector('input[name="phone"]');
		const agreeCheckbox = form.querySelector('input[name="agree"]');
		const submitBtn = form.querySelector('.submit_btn');
	});
}
