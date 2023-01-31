<script lang="ts">
	import { colorButtons, colorState } from '$lib/store.designer';
	import { fly, slide } from 'svelte/transition';

	import type { ColorObjKey } from '$lib/types';

	type Key = 'panel' | 'signalLine' | 'snapPoint';
	type Layer = ColorObjKey;
	type Element = 'Background' | 'Border' | 'Font' | 'Signal Lines' | 'SnapPoint';

	export let key: Key;
	export let layer: Layer;
	export let element: Element;
	export let isOpen: boolean;
	export let classObj: any;

	$: flex = isOpen ? 1 : 0.15;

	$: background = $colorState[key][layer];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="subtitle" on:click={() => (isOpen = !isOpen)}>
	{element}
	<div class="color-id-box" style:flex style:background />
</div>

{#if isOpen}
	<div transition:slide={{ duration: 150 }}>
		<!-- <div transition:fly={{ y: -10, duration: 110 }}> -->
		<div id="color-button-container">
			{#each $colorButtons as color}
				<button
					class="color-button"
					style="background-color: {color}"
					on:click={() => {
						classObj.setColors(layer, color);
					}}
				/>
			{/each}
		</div>
		<!-- <div>
			<input type="color" id="custom-color-button" bind:value={$colorState[key][layer]} />
		</div> -->
	</div>
{/if}

<style>
	.color-id-box {
		flex: 0.1;
		width: 10px;
		height: 10px;
		background-color: red;
		margin-left: 5px;
		transition: flex 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		border-radius: 1.5px;
	}

	.subtitle {
		margin-top: 10px;
		display: flex;
		/* background-color: green; */
		align-items: center;
	}

	#color-button-container {
		margin-top: 10px;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		width: 100%;
		gap: 9px;
	}

	.color-button {
		width: 100%;
		padding-top: 90%;
		border-width: 1px;
		border-style: solid;
	}

	.color-button:hover {
		border-width: 0px;
	}
</style>
