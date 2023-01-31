export const load = async ({ fetch }) => {
	const sortAndStoreTiles = (tiles) => {
		tiles?.sort((a, b) => {
			if (a.make < b.make) {
				return -1;
			}
			if (a.make > b.make) {
				return 1;
			}
			if (a.model < b.model) {
				return -1;
			}
			if (a.model > b.model) {
				return 1;
			}
			return 0;
		});

		return tiles;
	};

	const fetchTileTypes = async () => {
		const tiles = await fetch('./api/tiles');
		const data = await tiles?.json();

		return sortAndStoreTiles(data);
	};

	return {
		tileTypes: await fetchTileTypes()
	};
};
