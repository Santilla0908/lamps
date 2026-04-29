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

	const calculateEaseInOutProgress = (linearProgress) => {
		return linearProgress < 0.5
			? 2 * linearProgress * linearProgress
			: 1 - Math.pow(-2 * linearProgress + 2, 2) / 2;
	}

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

		totalResultBlockEl.style.display = 'none';
	}

	const showTotalResultBlock = () => {
		totalResultBlockEl.style.display = 'block';
		requestAnimationFrame(() => {
			totalResultBlockEl.style.transform = 'scale(1)';
		});
	}

	const startAnimation = () => {
		const animationDuration = 3000;
		const animationStartTime = performance.now();

		const { ordinaryMaxValue, osramMaxValue, osramMaxWidthPercent } = dataByMode[currentMode];

		const updateAnimationFrame = currentTime => {
			const elapsedTime = currentTime - animationStartTime;
			const linearProgress = Math.min(elapsedTime / animationDuration, 1);
			const easedProgress = calculateEaseInOutProgress(linearProgress);

			ordinaryValueEl.textContent = formatNumberWithSpaces(Math.floor(easedProgress * ordinaryMaxValue));
			osramValueEl.textContent = formatNumberWithSpaces(Math.floor(easedProgress * osramMaxValue));
			ordinaryVisualEl.style.width = `${easedProgress * 100}%`;
			osramVisualEl.style.width = `${easedProgress * osramMaxWidthPercent}%`

			const activeTimelineIndex = Math.floor(easedProgress * timelinePartEls.length);

			timelinePartEls.forEach((timeline, index) => {
				if (index <= activeTimelineIndex) {
					timeline.classList.add('part_active');
				}
			});

			if (linearProgress < 1) {
				requestAnimationFrame(updateAnimationFrame);
			} else {
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