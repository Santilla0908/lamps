document.addEventListener('DOMContentLoaded', function() {
	const items = document.querySelectorAll('.delivery_payment_item');

	items.forEach(item => {
		const desc = item.querySelector('.delivery_payment_item_desc');

		item.addEventListener('click', function(e) {
			document.querySelectorAll('.delivery_payment_item_desc').forEach(d => {
				if (d !== desc) d.classList.remove('active');
			});
			desc.classList.toggle('active');
		});

		item.addEventListener('mouseleave', function() {
			desc.classList.remove('active');
		});
	});
});