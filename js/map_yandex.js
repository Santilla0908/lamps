const mapEl = document.querySelector('.map');

const initMap = () => {
	const map = new ymaps.Map(mapEl, {
		center: [55.840093, 37.516350],
		zoom: 17,
	});

	let isMapActive = false;

	map.behaviors.disable('scrollZoom');
	mapElement.addEventListener('click', () => {
		isMapActive = true;
		map.behaviors.enable('scrollZoom');
	});
	mapEl.addEventListener('mouseleave', () => {
		isMapActive = false;
		map.behaviors.disable('scrollZoom');
	});

	const placemark = new ymaps.Placemark(
		[55.840093, 37.516350],
		{
			balloonContent:
				`<div class="map_balloon">
					<h3 class="map_balloon_title">Главная лампочка</h3>
					<p class="map_balloon_text">Купи здесь, купи сейчас!</p>
				</div>`
		}
	);

	map.geoObjects.add(placemark);
	placemark.balloon.open();
}

ymaps.ready(initMap);


