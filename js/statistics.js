document.addEventListener('DOMContentLoaded', function() {
	const counters = document.querySelectorAll('[data-to]');

	const animationDuration = 700; //
	const animationStartTime = Date.now();

	const updateCounter = (element, target, startTime) => {
		const now = Date.now();
		const elapsed = now - startTime;
		const progress = Math.min(elapsed / animationDuration, 1);

		const easedProgress = progress < 0.5
			? 2 * progress * progress
			: 1 - Math.pow(-2 * progress + 2, 2) / 2;

		const currentValue = Math.floor(easedProgress * target);
		element.textContent = currentValue;

		if (progress < 1) {
			requestAnimationFrame(() => updateCounter(element, target, startTime));
		} else {
			element.textContent = target;
		}
	};

	const startCountersAnimation = () => {
		const startTime = Date.now();

		counters.forEach(counter => {
			const target = parseInt(counter.getAttribute('data-to'));
			counter.textContent = '0';
			updateCounter(counter, target, startTime);
		});
	};

	const observerOptions = {
		threshold: 0.5,
		rootMargin: '0px 0px -100px 0px'
	};

	const observerCallback = (entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				startCountersAnimation();
				observer.disconnect();
			}
		});
	};

	const observer = new IntersectionObserver(observerCallback, observerOptions);

	const statisticsSection = document.querySelector('.statistics_items');
	if (statisticsSection) {
		observer.observe(statisticsSection);
	}
});