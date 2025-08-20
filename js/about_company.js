document.addEventListener('DOMContentLoaded', function() {
	const lamp4 = document.querySelector('.about_company_bg_lamp4');
	const lamp5 = document.querySelector('.about_company_bg_lamp5');

	const lamp4Start = { top: 1500, left: -100 };
	const lamp5Start = { top: 1500, right: -100 };

	// Лампочка 5 заканчивает на statistics
	const lamp5End = { top: -100, right: 250 };

	// Лампочка 4 заканчивает на certificates
	const lamp4End = { top: -200, left: 300 };

	const aboutSection = document.getElementById('about_company');
	const statisticsSection = document.getElementById('statistics');
	const certificatesSection = document.getElementById('certificates');
	const btn = aboutSection.querySelector('.btn');

	let aboutTop, statisticsTop, certificatesTop;
	let aboutHeight, statisticsHeight, certificatesHeight;
	let btnOffset;

	function updatePositions() {
		aboutTop = aboutSection.offsetTop;
		statisticsTop = statisticsSection.offsetTop;
		certificatesTop = certificatesSection.offsetTop;

		aboutHeight = aboutSection.offsetHeight;
		statisticsHeight = statisticsSection.offsetHeight;
		certificatesHeight = certificatesSection.offsetHeight;

		btnOffset = btn.offsetTop;
	}

	updatePositions();

	function handleScroll() {
		const scrollY = window.scrollY;
		const windowHeight = window.innerHeight;

		// Начало анимации - когда кнопка вверху экрана
		const startAnimation = aboutTop + btnOffset - windowHeight + 50;

		// Конец анимации для lamp5 - середина statistics
		const endLamp5 = statisticsTop + statisticsHeight * 1.5;

		// Конец анимации для lamp4 - середина certificates
		const endLamp4 = certificatesTop + certificatesHeight * 2;

		// Если еще не начали анимацию
		if (scrollY < startAnimation) {
			lamp4.style.top = lamp4Start.top + 'px';
			lamp4.style.left = lamp4Start.left + 'px';
			lamp5.style.top = lamp5Start.top + 'px';
			lamp5.style.right = lamp5Start.right + 'px';
			return;
		}


		const progress5 = Math.min(1, (scrollY - startAnimation) / (endLamp5 - startAnimation));
		const progress4 = Math.min(1, (scrollY - startAnimation) / (endLamp4 - startAnimation));


		const easedProgress5 = easeInOutCubic(progress5);
		const easedProgress4 = easeInOutCubic(progress4);


		lamp4.style.top  = lamp4Start.top + (lamp4End.top - lamp4Start.top) * easedProgress4 + 'px';
		lamp4.style.left = lamp4Start.left + (lamp4End.left - lamp4Start.left) * easedProgress4 + 'px';


		lamp5.style.top   = lamp5Start.top + (lamp5End.top - lamp5Start.top) * easedProgress5 + 'px';
		lamp5.style.right = lamp5Start.right + (lamp5End.right - lamp5Start.right) * easedProgress5 + 'px';
	}

	function easeInOutCubic(t) {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	window.addEventListener('scroll', handleScroll);
	window.addEventListener('resize', function() {
		updatePositions();
		handleScroll();
	});

	function initLampPositions() {
		lamp4.style.position = 'absolute';
		lamp4.style.top = lamp4Start.top + 'px';
		lamp4.style.left = lamp4Start.left + 'px';
		lamp4.style.transition = 'top 0.1s ease-out, left 0.1s ease-out';

		lamp5.style.position = 'absolute';
		lamp5.style.top = lamp5Start.top + 'px';
		lamp5.style.right = lamp5Start.right + 'px';
		lamp5.style.transition = 'top 0.1s ease-out, right 0.1s ease-out';
	}

	initLampPositions();
	handleScroll();
});