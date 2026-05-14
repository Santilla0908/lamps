{
	const aboutSectionEl = document.querySelector('.about_company');
	const statisticsSectionEl = document.querySelector('.statistics');
	const certificatesSectionEl = document.querySelector('.certificates');

	const buttonEl = aboutSectionEl.querySelector('.btn');

	const lampAnimations = [

		{
			element: document.querySelector('.about_company_bg_lamp4'),
			startPosition: {
				top: 1500,
				left: -100
			},
			endPosition: {
				top: -200,
				left: 300
			},
			getAnimationEnd: () => {
				return (certificatesSectionEl.offsetTop + certificatesSectionEl.offsetHeight * 2);
			}
		},

		{
			element: document.querySelector('.about_company_bg_lamp5'),
			startPosition: {
				top: 1500,
				right: -100
			},
			endPosition: {
				top: -100,
				right: 250
			},
			getAnimationEnd: () => {
				return (statisticsSectionEl.offsetTop + statisticsSectionEl.offsetHeight * 1.5);
			},
		}
	];

	let animationFrameId = null;

	const easeInOutCubic = linearProgress => {
		return linearProgress < 0.5
			? 4 * linearProgress * linearProgress * linearProgress
			: 1 - Math.pow(-2 * linearProgress + 2, 3) / 2;
	}

	const setLampPosition = (lamp, progress) => {
		const easedProgress = easeInOutCubic(progress);

		Object.keys(lamp.startPosition).forEach(property => {
			const startValue = lamp.startPosition[property];
			const endValue = lamp.endPosition[property];

			const currentValue = startValue + (endValue - startValue) * easedProgress;
			lamp.element.style[property] = `${currentValue}px`;
		});
	}

	const updateLampPositions = () => {
		const scrollY = window.scrollY;
		const windowHeight = window.innerHeight;

		const animationStart = aboutSectionEl.offsetTop + buttonEl.offsetTop - windowHeight + 50;

		lampAnimations.forEach(lamp => {
			if (scrollY <= animationStart) {
				setLampPosition(lamp, 0);
				return;
			}

			const animationEnd = lamp.getAnimationEnd();

			const rawProgress = (scrollY - animationStart) / (animationEnd - animationStart);
			const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);
			setLampPosition(lamp, clampedProgress);
		});

		animationFrameId = null;
	}

	const requestLampUpdate = () => {
		if (animationFrameId !== null) return;
		animationFrameId = requestAnimationFrame(updateLampPositions);
	}

	const initializeLampStyles = () => {
		lampAnimations.forEach(lamp => {
			lamp.element.style.position = 'absolute';

			Object.entries(lamp.startPosition).forEach(
				([property, value]) => {
					lamp.element.style[property] = `${value}px`;
				}
			);
		});
	}

	const resizeObserver = new ResizeObserver(() => {
		requestLampUpdate();
	});

	initializeLampStyles();

	resizeObserver.observe(aboutSectionEl);
	resizeObserver.observe(statisticsSectionEl);
	resizeObserver.observe(certificatesSectionEl);
	window.addEventListener('scroll', requestLampUpdate);

	requestLampUpdate();
}