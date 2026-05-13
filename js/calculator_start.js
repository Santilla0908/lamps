{
	const startButtonEl = document.querySelector('.calculator_btn');
	const switchEl = document.querySelector('.calculator_switch_checkbox');
	const ordinaryValueEl = document.querySelector('.calculator_value_ordinary');
	const osramValueEl = document.querySelector('.calculator_value_osram');
	const ordinaryVisualEl = document.querySelector('.calculator_visual_ordinary');
	const osramVisualEl = document.querySelector('.calculator_visual_osram');
	const timelinePartEls = [ ...document.querySelectorAll('.calculator_timeline_part') ];
	const totalResultBlockEl = document.querySelector('.calculator_total');
	const totalResultValueEl = document.querySelector('.calculator_total_text_value');
	const unitLabelEls = [ ...document.querySelectorAll('.calculator_units') ];

	const dataByMode = {
		rubles: {
			ordinaryMaxValue: 63250,
			osramMaxValue: 8774,
			totalSavingsValue: 54476,
			unitLabel: '₽',
			osramMaxWidthPercent: 14
		},
		watts: {
			ordinaryMaxValue: 30000,
			osramMaxValue: 3800,
			totalSavingsValue: 26200,
			unitLabel: 'Вт',
			osramMaxWidthPercent: 14
		}
	}

	let currentMode = 'rubles';

	const formatNumberWithSpaces = number => {
		return number.toLocaleString();
	}

	const updateDisplay = () => {
		const { unitLabel, totalSavingsValue } = dataByMode[currentMode];
		unitLabelEls.forEach(unitLabelElement => {
			unitLabelElement.textContent = unitLabel;
		});

		totalResultValueEl.textContent = `${formatNumberWithSpaces(totalSavingsValue)} ${unitLabel}`;
	}

	const resetState = () => {
		ordinaryValueEl.textContent = '0';
		osramValueEl.textContent = '0';
		ordinaryVisualEl.style.width = '0%';
		osramVisualEl.style.width = '0%';

		timelinePartEls.forEach(timeline => {
			timeline.classList.remove('part_active');
		});

		totalResultBlockEl.classList.remove('is-visible');
	}

	const showTotalResultBlock = () => {
		requestAnimationFrame(() => {
			totalResultBlockEl.classList.add('is-visible');
		});
	}

	const startAnimation = () => {
		const animationDuration = 5000;
		const animationStartTime = performance.now();
		ordinaryVisualEl.classList.add('is-animating');
		osramVisualEl.classList.add('is-animating');

		const { ordinaryMaxValue, osramMaxValue, osramMaxWidthPercent } = dataByMode[currentMode];

		const updateAnimationFrame = currentTime => {
			const elapsedTime = currentTime - animationStartTime;
			const linearProgress = Math.min(elapsedTime / animationDuration, 1);

			ordinaryValueEl.textContent = formatNumberWithSpaces(Math.floor(linearProgress * ordinaryMaxValue));
			osramValueEl.textContent = formatNumberWithSpaces(Math.floor(linearProgress * osramMaxValue));
			ordinaryVisualEl.style.width = `${linearProgress * 100}%`;
			osramVisualEl.style.width = `${linearProgress * osramMaxWidthPercent}%`;

			const activeTimelineIndex = Math.floor(linearProgress * timelinePartEls.length);

			timelinePartEls.forEach((timeline, index) => {
				if (index <= activeTimelineIndex) {
					timeline.classList.add('part_active');
				}
			});

			if (linearProgress < 1) {
				requestAnimationFrame(updateAnimationFrame);
			} else {
				ordinaryVisualEl.classList.remove('is-animating');
				osramVisualEl.classList.remove('is-animating');
				showTotalResultBlock();
			}
		}
		requestAnimationFrame(updateAnimationFrame);
	}

	startButtonEl.addEventListener('click', () => {
		resetState();
		startAnimation();
	});

	switchEl.addEventListener('change', e => {
		currentMode = e.target.checked ? 'watts' : 'rubles';
		updateDisplay();
		resetState();
	});

	updateDisplay();
}