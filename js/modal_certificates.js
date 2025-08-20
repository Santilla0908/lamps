document.addEventListener('DOMContentLoaded', () => {
	const overlay = document.querySelector('.modal_certificates');
	if (!overlay) return;

	const imgEl   = overlay.querySelector('.modal_img');
	const btnClose= overlay.querySelector('.close_btn');
	const btnZoom = overlay.querySelector('.zoom_btn');
	const btnPrev = overlay.querySelector('.arrow_left');
	const btnNext = overlay.querySelector('.arrow_right');
	const curEl   = overlay.querySelector('.ov_counter .current');
	const totEl   = overlay.querySelector('.ov_counter .total');

	let srcList = [];
	let index = 0;
	let zoom = 1;

	// drag-to-pan переменные
	let isDragging = false;
	let startX, startY, imgX = 0, imgY = 0;

	function getSrcFromEl(el) {
		if (!el) return '';
		if (el.dataset && el.dataset.full) return el.dataset.full;
		if (el.tagName === 'IMG' && el.src) return el.src;
		const nestedImg = el.querySelector && el.querySelector('img');
		if (nestedImg && nestedImg.src) return nestedImg.src;
		const bg = window.getComputedStyle(el).backgroundImage;
		if (bg && bg !== 'none') {
			return bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
		}
		return '';
	}

	function collectUniqueSources() {
		const nodes = document.querySelectorAll(
			'.certificates_item_img, .certificates_item img, .certificates_item'
		);
		const seen = new Set();
		const list = [];
		nodes.forEach(el => {
			const src = getSrcFromEl(el);
			if (src && !seen.has(src)) {
				seen.add(src);
				list.push(src);
			}
		});
		return list;
	}

	function openWithSrc(src) {
		srcList = collectUniqueSources();
		if (!srcList.length) return;
		const found = srcList.indexOf(src);
		index = found >= 0 ? found : 0;
		updateImage();
		showOverlay();
	}

	function updateImage() {
		imgEl.src = srcList[index];
		if (curEl) curEl.textContent = index + 1;
		if (totEl) totEl.textContent = srcList.length;
		resetZoom();
	}

	function prev() {
		index = (index - 1 + srcList.length) % srcList.length;
		updateImage();
	}

	function next() {
		index = (index + 1) % srcList.length;
		updateImage();
	}

	function showOverlay() {
		overlay.style.display = 'flex';
		document.body.style.overflow = 'hidden';
	}

	function hideOverlay() {
		overlay.style.display = 'none';
		document.body.style.overflow = '';
		resetZoom();
	}

	function toggleZoom() {
		if (zoom === 1) {
			zoom = 1.4;
			imgEl.style.transform = `scale(${zoom}) translate(0px, 0px)`;
			imgEl.style.cursor = 'grab';
		} else {
			resetZoom();
		}
	}

	function resetZoom() {
		zoom = 1;
		imgX = imgY = 0;
		imgEl.style.transform = `scale(1) translate(0px, 0px)`;
		imgEl.style.cursor = 'zoom-in';
	}

	// --- drag-to-pan events ---
	imgEl.addEventListener('mousedown', (e) => {
		if (zoom === 1) return;
		isDragging = true;
		startX = e.clientX - imgX;
		startY = e.clientY - imgY;
		imgEl.style.cursor = 'grabbing';
		e.preventDefault();
	});

	document.addEventListener('mousemove', (e) => {
		if (!isDragging) return;
		imgX = e.clientX - startX;
		imgY = e.clientY - startY;
		imgEl.style.transform = `scale(${zoom}) translate(${imgX / zoom}px, ${imgY / zoom}px)`;
	});

	document.addEventListener('mouseup', () => {
		if (isDragging) {
			isDragging = false;
			imgEl.style.cursor = 'grab';
		}
	});

	// --- events ---
	document.addEventListener('click', (e) => {
		const trigger = e.target.closest('.certificates_item_img, .certificates_item img, .certificates_item');
		if (!trigger) return;
		e.preventDefault();
		const src = getSrcFromEl(trigger);
		if (!src) return;
		openWithSrc(src);
	});

	btnClose && btnClose.addEventListener('click', hideOverlay);
	btnPrev  && btnPrev.addEventListener('click', prev);
	btnNext  && btnNext.addEventListener('click', next);
	btnZoom  && btnZoom.addEventListener('click', toggleZoom);
	imgEl    && imgEl.addEventListener('dblclick', toggleZoom);

	overlay.addEventListener('click', (e) => {
		if (e.target === overlay) hideOverlay();
	});

	document.addEventListener('keydown', (e) => {
		if (overlay.style.display !== 'flex') return;
		if (e.key === 'Escape') hideOverlay();
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	});

	overlay.style.display = 'none';
});