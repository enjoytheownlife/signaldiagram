<script>
	// @ts-nocheck

	import AgGridSvelte from 'ag-grid-svelte';
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';
	import { tileTypes } from '$lib/store.global';
	import { onMount } from 'svelte';

	let api, columnApi;

	function onFirstDataRendered(params) {
		params.api.sizeColumnsToFit();
	}

	const gridOptions = {
		defaultColDef: {
			sortable: true,
			filterOptions: ['agNumberColumnFilter']
		},
		columnDefs: [
			{ flex: 1, field: 'make', minWidth: 150 },
			{ flex: 1, field: 'model', minHeight: 150 },
			{ flex: 1, field: 'pixelWidth', headerName: 'Px Width' },
			{ flex: 1, field: 'pixelHeight', headerName: 'Px Height' },
			{ flex: 1, field: 'mmWidth', headerName: 'MM Width' },
			{ flex: 1, field: 'mmHeight', headerName: 'MM Height' }
		]
	};

	onMount(() => {
		columnApi.sizeColumnsToFit();
	});
</script>

<div class="ag-theme-alpine-dark">
	<AgGridSvelte rowData={$tileTypes} {gridOptions} bind:api bind:columnApi />
</div>

<style>
	div {
		width: 100vw;
		height: 100vh;
	}
</style>
