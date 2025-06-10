const filterSelect = document.getElementById('hits_filter');
const incandescentBlock = document.querySelector('.hits_incandescent');
const halogenBlock = document.querySelector('.hits_halogen');

function toggleLampBlocks() {
	if (filterSelect.value === 'incandescent') {
		incandescentBlock.style.display = 'grid';
		halogenBlock.style.display = 'none';
	} else {
		incandescentBlock.style.display = 'none';
		halogenBlock.style.display = 'grid';
	}
}

toggleLampBlocks();

filterSelect.addEventListener('change', toggleLampBlocks);