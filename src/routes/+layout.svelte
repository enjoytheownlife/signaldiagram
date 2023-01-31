<script lang="ts">
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import {} from '$app/navigation';

	import './global.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { requestedTileTypes, approvedTileTypes, tileTypes } from '$lib/store.global';

	export let data: LayoutData;

	$tileTypes = data.tileTypes;

	$: $tileTypes?.length && updateTileLists($tileTypes);

	function checkBrowser() {
		if (!navigator.userAgent.includes('Chrome')) {
			alert('This website only works in Chrome.');
		}
	}

	const sortAndStoreTiles = (tiles) => {
		tiles.sort((a, b) => {
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

	const updateTileLists = (tiles) => {
		let _requestedTileTypes = tiles.filter((tile) => {
			return tile.isApproved === false;
		});

		let _approvedTileTypes = tiles.filter((tile) => {
			return tile.isApproved === true;
		});

		$requestedTileTypes = sortAndStoreTiles(_requestedTileTypes);
		$approvedTileTypes = sortAndStoreTiles(_approvedTileTypes);

		$requestedTileTypes = $requestedTileTypes;
		$approvedTileTypes = $approvedTileTypes;
	};

	onMount(() => {
		checkBrowser();
	});
</script>

<slot />

<SvelteToast />
