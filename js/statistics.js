{
	const statsSectionEl = document.querySelector('.statistics');
	const numberEls = [ ...statsSectionEl.querySelectorAll('.statistics_item_number') ];

	let animationStarted = false;

	const calculateEasedProgress = (linearProgress) => {
		return linearProgress < 0.5
			? 2 * linearProgress * linearProgress
			: 1 - Math.pow(-2 * linearProgress + 2, 2) / 2;
	}

	const startCountersAnimation = () => {
		const duration = 700;
		const startTime = performance.now();

		const updateCountersOnFrame = currentTime => {
			const elapsedTime = currentTime - startTime;
			const rawProgress = Math.min(elapsedTime / duration, 1);
			const smoothedProgress = calculateEasedProgress(rawProgress);

			numberEls.forEach(counterElement => {
				const targetValue = Number(counterElement.dataset.to);
				counterElement.innerText = Math.floor(targetValue * smoothedProgress);
			});
			if (rawProgress < 1) {
				requestAnimationFrame(updateCountersOnFrame);
			}
		}
		requestAnimationFrame(updateCountersOnFrame);
	}

	const observer = new IntersectionObserver(entries => {
		const entry = entries[0];

		if (entry.isIntersecting && !animationStarted) {
			animationStarted = true;
			startCountersAnimation();
			observer.disconnect();
		}
	}, { threshold: 0.5 });

	observer.observe(statsSectionEl);
}