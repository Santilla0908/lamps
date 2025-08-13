document.addEventListener('DOMContentLoaded', function() {
	const certificates = document.querySelectorAll('.certificates_item_img');
	const modal = document.querySelector('.dialog_certificates');
	const modalImg = modal.querySelector('.modal_img');

	function blockScroll() {
		document.body.classList.add('scroll-block');
	}

	function unblockScroll() {
		document.body.classList.remove('scroll-block');
	}

	certificates.forEach(cert => {
		cert.addEventListener('click', function() {
			const imgUrl = window.getComputedStyle(this).backgroundImage
				.replace(/^url\(["']?/, '')
				.replace(/["']?\)$/, '');

			modalImg.src = imgUrl;
			modal.showModal();
			blockScroll();
		});
	});

	// Закрытие при клике по фону
	modal.addEventListener('click', function(e) {
		if (e.target === modal) {
			modal.close();
			unblockScroll();
		}
	});

	// Закрытие при Esc
	modal.addEventListener('cancel', unblockScroll);
});