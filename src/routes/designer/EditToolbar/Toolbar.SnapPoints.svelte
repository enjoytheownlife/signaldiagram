<script lang="ts">
	import {
		textInputRef,
		snapPointLabel,
		selectedSnapPointIndexes,
		screens,
		currentScreenIndex
	} from '$lib/store.designer';

	import SnapPointOptions from '../InfoToolbar/InfoBar.SnapPointOptions.svelte';

	import { fade } from 'svelte/transition';

	import ColorPicker from './components/ColorPicker.svelte';

	import type { SnapPointObj } from '$lib/types';

	$: {
		let t = [$selectedSnapPointIndexes];

		updateLocalOffsetValues();
	}

	const updateLocalOffsetValues = () => {
		xOffset = 0;
		yOffset = 0;
		_radiusMultiplier = 1;

		$screens[$currentScreenIndex].snapPoints.array.forEach((sp: SnapPointObj) => {
			if (sp.isSelected) {
				xOffset = sp.xOffset;
				yOffset = -sp.yOffset;
				_radiusMultiplier = sp.scale;
			}
		});
	};

	const currentOffsetValues = () => {
		$screens[$currentScreenIndex].snapPoints.array.forEach((sp: SnapPointObj) => {
			if (sp.isSelected) {
				return {
					xOffset: sp.xOffset,
					yOffset: -sp.yOffset
				};
			}
		});
		return {
			xOffset: 0,
			yOffset: 0
		};
	};

	const currentScaleValue = () => {
		$screens[$currentScreenIndex].snapPoints.array.forEach((sp: SnapPointObj) => {
			if (sp.isSelected) {
				return sp.scale;
			}
		});
		return 1;
	};

	let sd = [];

	let xOffset = currentOffsetValues().xOffset;
	let yOffset = currentOffsetValues().yOffset;
	let _radiusMultiplier = currentScaleValue();

	$: {
		setOffsets(xOffset, -yOffset);
	}

	$: {
		setRadiusMultiplier(_radiusMultiplier);
	}

	const resetXOffset = () => {
		xOffset = 0;
	};
	const resetYOffset = () => {
		yOffset = 0;
	};
	const resetRadiusMultiplier = () => {
		_radiusMultiplier = 1;
	};

	const setRadiusMultiplier = (r: number) => {
		$screens[$currentScreenIndex].snapPoints.setRadiusMultiplier(r);
		$screens = $screens;
	};

	const setOffsets = (x: number, y: number) => {
		$screens[$currentScreenIndex].snapPoints.setXOffsets(x);
		$screens[$currentScreenIndex].snapPoints.setYOffsets(y);

		$screens = $screens;
	};

	$: {
		sd = [];

		$screens[$currentScreenIndex].snapPoints.array?.forEach((p) => {
			if ((p.isSquare && p.isSelected) || (p.isTriangle && p.isSelected)) {
				sd.push(p);
			}
		});
	}

	const handleRemoveLabel = () => {
		$screens[$currentScreenIndex].snapPoints.array.forEach((snapPoint) => {
			if (snapPoint.isSelected) {
				$screens[$currentScreenIndex].snapPoints.removeLabel();
			}
		});
		$screens = $screens;
	};
</script>

<div id="snappoints" class="snappoints" in:fade={{ duration: 150 }} out:fade={{ duration: 0 }}>
	<div class="crisscross">
		<button
			class="criss-cross"
			on:click={() => $screens[$currentScreenIndex].snapPoints.selectEvenOrOdd(1)}
			>Select [0]</button
		>
		<button
			class="criss-cross"
			on:click={() => $screens[$currentScreenIndex].snapPoints.selectEvenOrOdd(2)}
			>select [1]</button
		>
	</div>

	<div class="divider" />

	<div id="general">
		<SnapPointOptions />
	</div>

	<!-- {#if sd.length} -->
	<div class="divider" />

	<div id="label-input">
		<div class="label-input-header">
			Text:{' '}
		</div>

		<input
			class="label-text-input"
			maxlength="3"
			disabled={!sd.length}
			bind:this={$textInputRef}
			type="text"
			bind:value={$snapPointLabel}
		/>
	</div>

	<div class="divider" />

	<ColorPicker
		key={'snapPoint'}
		layer={'background'}
		element={'Background'}
		isOpen={false}
		classObj={$screens[$currentScreenIndex].snapPoints}
	/>

	<div class="divider" />

	<ColorPicker
		key={'snapPoint'}
		layer={'font'}
		element={'Font'}
		isOpen={false}
		classObj={$screens[$currentScreenIndex].snapPoints}
	/>

	<div class="divider" />
	<!-- {/if} -->

	<div class="range-wrapper">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="label" on:click={resetXOffset}>X Offset</div>
		<input
			name="x"
			type="range"
			min={-$screens[$currentScreenIndex].width / 3}
			max={$screens[$currentScreenIndex].width / 3}
			step="1"
			bind:value={xOffset}
			class="range"
		/>
	</div>

	<div class="range-wrapper">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="label" on:click={resetYOffset} title="Reset">Y Offset</div>
		<input
			name="y"
			type="range"
			min={-$screens[$currentScreenIndex].height / 3}
			max={$screens[$currentScreenIndex].height / 3}
			step="1"
			bind:value={yOffset}
			class="range"
		/>
	</div>

	<div class="range-wrapper">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="label" on:click={resetRadiusMultiplier}>Radius</div>
		<input
			name="radius"
			type="range"
			min={0}
			max={2}
			step=".05"
			bind:value={_radiusMultiplier}
			class="range"
		/>
	</div>

	<div class="divider" />

	<div class="shape-button-container">
		<button
			id="shape-button"
			on:click={() => $screens[$currentScreenIndex].snapPoints.setIsSquares(true)}>Square</button
		>

		<button
			id="shape-button"
			on:click={() => $screens[$currentScreenIndex].snapPoints.setIsTriangles(true)}
			>Triangle</button
		>
	</div>

	{#if sd.length}
		<div id="delete-button" transition:fade={{ duration: 300 }}>
			<button on:click={handleRemoveLabel}>Remove Label</button>
		</div>
	{/if}
</div>

<!-- <div class="margin" /> -->
<style>
	.label {
		cursor: pointer;
	}
	.range-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		margin-top: 10px;
	}
	.margin {
		height: 20px;
	}

	.crisscross {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 10px;
	}

	.criss-cross {
		padding: 5px;
		padding-inline: 15px;
	}

	.label-text-input {
		width: 50px;
	}

	.shape-button-container {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
	}

	.label-input-header {
		margin-right: 10px;
	}

	#delete-button {
		display: flex;
		justify-content: center;
		width: 100%;
		align-self: center;
		margin-top: 10px;
	}

	#shape-button {
		width: 100px;
		height: 30px;
		margin-top: 10px;
		align-self: center;
	}

	#label-input {
		margin-top: 10px;
		display: flex;
		width: 100%;
	}

	#snappoints {
		flex: 1;
		width: 100%;
	}
	.snappoints {
	}
</style>
