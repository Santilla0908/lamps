{
	const modalEl = document.querySelector('.dialog');
	const openModalEls = document.querySelectorAll('.open_modal');
	const closeModalEl = document.querySelector('.modal_close');
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

	modalEl.addEventListener('click', e => {
		const isOverlayClick = e.target === e.currentTarget;
		if (isOverlayClick) modalEl.close();
	});

	function initForm(form) {
		const nameInputEL = form.querySelector('input[name="name"]');
		const phoneInputEl = form.querySelector('input[name="phone"]');
		const agreeCheckboxEl = form.querySelector('input[name="agree"]');
		const submitBtnEl = form.querySelector('.submit_btn');

		const resetForm = () => {
			const inputs = form.querySelectorAll('input');

			inputs.forEach(input => {
				if (input.type === 'checkbox' || input.type === 'radio') {
					input.checked = input.defaultChecked;
				} else {
					input.value = input.defaultValue;
				}
			});

			isSubmitted = false;
			updateUI();
		};

		nameInputEL.addEventListener('input', () => {
			nameInputEL.value = nameInputEL.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
		});

		phoneInputEl.addEventListener('input', () => {
			phoneInputEl.value = phoneInputEl.value.replace(/[^\d+]/g, '');
			if (phoneInputEl.value.includes('+')) {
				phoneInputEl.value = '+' + phoneInputEl.value.replace(/\+/g, '').replace(/^\+/, '');
			}
		});

		const validate = () => {
			const isNameValid = nameInputEL.value.trim().length > 1;
			const isPhoneValid = /^\+?\d{10,15}$/.test(phoneInputEl.value);
			const isAgreeChecked = agreeCheckboxEl.checked;
			return { isNameValid, isPhoneValid, isAgreeChecked };
		}

		let isSubmitted = false;

		const updateUI = () => {
			const { isNameValid, isPhoneValid, isAgreeChecked } = validate();

			nameInputEL.classList.toggle('error', isSubmitted && !isNameValid);
			phoneInputEl.classList.toggle('error', isSubmitted && !isPhoneValid);
			agreeCheckboxEl.classList.toggle('error', isSubmitted && !isAgreeChecked);
		}

		[nameInputEL, phoneInputEl, agreeCheckboxEl].forEach(el => {
			el.addEventListener('input', () => {
				if (isSubmitted) updateUI();
			});
			el.addEventListener('change', () => {
				if (isSubmitted) updateUI();
			});
		});

		updateUI();

		submitBtnEl.addEventListener('click', e => {
			e.preventDefault();
			isSubmitted = true;
			const { isNameValid, isPhoneValid, isAgreeChecked } = validate();

			if (!(isNameValid && isPhoneValid && isAgreeChecked)) {
				updateUI();
				return;
			}
			const dialog = form.closest('.dialog');

			resetForm();

			if (dialog) {
				dialog.close('success');
			} else {
				showToast();
			}
		});

		form.addEventListener('keydown', e => {
			if (e.key === 'Enter') {
				e.preventDefault();
				submitBtnEl.click();
			}
		});
	}

	document.querySelectorAll('.js_form').forEach(initForm);

	modalEl.addEventListener('close', () => {
		document.body.classList.remove('scroll-block');
		if (modalEl.returnValue === 'success') {
			showToast();
			modalEl.returnValue = '';
		}
	});
}
