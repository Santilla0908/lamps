document.addEventListener('DOMContentLoaded', function() {

	const startBtn = document.querySelector('.calculator_btn');
	const ordinaryValue = document.querySelector('.calculator_value_ordinary');
	const osramValue = document.querySelector('.calculator_value_osram');
	const ordinaryVisual = document.querySelector('.calculator_visual_ordinary');
	const osramVisual = document.querySelector('.calculator_visual_osram');
	const timelineParts = document.querySelectorAll('.calculator_timeline_part:not(:first-child)');
	const totalBlock = document.querySelector('.calculator_total');
	const switchCheckbox = document.querySelector('.calculator_switch_checkbox');
	const unitsElements = document.querySelectorAll('.calculator_units');

	const maxOrdinaryRub = 63250;
	const maxOsramRub = 8774;

	const maxOrdinaryWatt = 30000;
	const maxOsramWatt = 3800;
	const duration = 3000;

	let isWattsMode = false;

	function animateValues() {
		let startTime = null;
		totalBlock.style.display = 'none';


		const maxOrdinary = isWattsMode ? maxOrdinaryWatt : maxOrdinaryRub;
		const maxOsram = isWattsMode ? maxOsramWatt : maxOsramRub;

		function step(timestamp) {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);

			const currentOrdinary = Math.floor(progress * maxOrdinary);
			const currentOsram = Math.floor(progress * maxOsram);
			ordinaryValue.textContent = currentOrdinary.toLocaleString();
			osramValue.textContent = currentOsram.toLocaleString();

			ordinaryVisual.style.width = `${progress * 100}%`;
			ordinaryVisual.style.overflow = 'hidden';
			osramVisual.style.width = `${progress * 14}%`;
			osramVisual.style.overflow = 'hidden';

			const activePart = Math.floor(progress * (timelineParts.length - 1));
			timelineParts.forEach((part, index) => {
				if (index <= activePart) {
					part.classList.add('part_active');
				}
			});

			if (progress < 1) {
				requestAnimationFrame(step);
			} else {
				ordinaryVisual.style.overflow = 'visible';
				osramVisual.style.overflow = 'visible';

				totalBlock.style.display = 'block';
				totalBlock.style.transform = 'scale(0)';
				totalBlock.style.transition = 'transform 0.5s ease-out';
				setTimeout(() => {
					totalBlock.style.transform = 'scale(1)';
				}, 50);
			}
		}

		requestAnimationFrame(step);
	}
	function resetCalculator() {
		ordinaryValue.textContent = '0';
		osramValue.textContent = '0';
		ordinaryVisual.style.width = '0';
		osramVisual.style.width = '0';
		timelineParts.forEach(part => part.classList.remove('part_active'));
		totalBlock.style.display = 'none';
	}

	startBtn.addEventListener('click', function() {
		resetCalculator();

		animateValues();
	});

	switchCheckbox.addEventListener('change', function() {
		isWattsMode = this.checked;

		unitsElements.forEach(el => el.textContent = isWattsMode ? 'Вт' : '₽');
		document.querySelector('.calculator_total_text_value').textContent =
			isWattsMode ? '26200 Вт' : '54476 ₽';

		resetCalculator();
	});
});