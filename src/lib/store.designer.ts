/* eslint-disable no-self-assign */
import { get, writable } from 'svelte/store';

import type {
	PanelObj,
	SnapPointObj,
	SignalLineObj,
	XYCoordinates,
	ScreenObj,
	DirectionObj,
	SnapPointOffsets
} from '$lib/types';

import type * as d3 from 'd3';

import type { Writable } from 'svelte/store';

export const snapPointOffsets: Writable<SnapPointOffsets> = writable({
	xOffset: 0,
	yOffset: 0,
	radiusMultiplier: 1
});

export const isMac: Writable<boolean> = writable(false);

export const isChrome: Writable<boolean> = writable(false);

export const screens: Writable<ScreenObj[]> = writable([]);
export const updateScreens = () => {
	screens.update(($value) => ($value = $value));
};

export const currentScreenIndex: Writable<number | null> = writable(null);

export const topLevelSvgRef = writable(null);
export const gZoomWrapperRef = writable(null);

export const selectedSnapPointIndexes: Writable<number[]> = writable([]);
export const setSelectedSnapPointIndexes = (indexes: number[]) => {
	selectedSnapPointIndexes.update(() => indexes);
};

export const groups = writable(null);
export const groupsEnter: Writable<d3.Selection<SVGGElement, PanelObj, HTMLElement, any>> =
	writable();

export const snapPointsGroupRef = writable(null);

export const snapPointsGroupEnterRef: Writable<
	d3.Selection<SVGGElement, SnapPointObj, HTMLElement, any>
> = writable();
export const snapPointPathRef = writable(null);

export const linesGroupRef = writable(null);
export const linesGroupEnterRef: Writable<
	d3.Selection<SVGGElement, SignalLineObj, HTMLElement, any>
> = writable();

export const temporarySignalLine = writable(null);

interface TransformObj {
	k: number;
	x: number;
	y: number;
}

export const transform: Writable<TransformObj> = writable({
	k: 1,
	x: 0,
	y: 0
});

export const isDrawingSignalLine: Writable<boolean> = writable(false);
export const setIsDrawingSignalLine = (s: boolean) => {
	isDrawingSignalLine.update(() => s);
};

export const isDrawingSelectLine: Writable<boolean> = writable(false);
export const setIsDrawingSelectLine = (s: boolean) => {
	isDrawingSignalLine.update(() => s);
};

export const isExportDialogOpen: Writable<boolean> = writable(false);
export const isAddScreenDialogOpen: Writable<boolean> = writable(false);

type SnapPointDirection = 'vertical' | 'horizontal';
export const snapPointsQuantity: Writable<number> = writable(2);
export const snapPointDirection: Writable<SnapPointDirection> = writable('vertical');
export const directionArrowQuantity: Writable<number> = writable(2);

export const isDrawMode: Writable<boolean> = writable(false);
export const isSelectMode: Writable<boolean> = writable(true);
export const isMoveMode: Writable<boolean> = writable(false);

type Mode = 'select' | 'draw';

export const mode: Writable<Mode> = writable('select');
export const setMode = (m: Mode) => {
	mode.update(() => m);
	if (m == 'draw') {
		isSelectMode.update(() => false);
		isDrawMode.update(() => true);
	}
	if (m == 'select') {
		isDrawMode.update(() => false);
		isSelectMode.update(() => true);
	}
};

export const snapPointLabel: Writable<string> = writable('');

export const lineWidthState: Writable<number> = writable(1);

export const colorState = writable({
	snapPoint: {
		background: '#ffffff',
		border: '#000000',
		font: '#000000'
	},
	panel: {
		background: '#ffffff',
		border: '#000000',
		font: '#000000'
	},
	signalLine: {
		background: '#000000',
		border: '#ffffff',
		font: '#000000'
	}
});
export const setSignalLineColor = (color: string) => {
	let newColorObj = get(colorState);
	newColorObj.signalLine.background = color;
	colorState.update(() => newColorObj);
};

export const mousePosition: Writable<XYCoordinates> = writable({
	x: 0,
	y: 0
});

type Selection = 'panels' | 'snappoints' | 'signallines';

export const selection: Writable<Selection> = writable('panels');
export const setSelection = (type: Selection) => {
	selection.update(() => type);
};

export const setIsShifted = (boolean: boolean) => {
	isShifted.update(() => boolean);
};

export const isShifted: Writable<boolean> = writable(false);

export const isCtrl = writable(false);
export const setIsCtrl = (boolean: boolean) => {
	isCtrl.update(() => boolean);
};

export const isMouseDown: Writable<boolean> = writable(false);
export const setIsMouseDown = (boolean: boolean) => {
	isMouseDown.update(() => boolean);
};

// This is the size of the browser window minus the toolbar
// it does not zoom or pan
export const canvasWrapperWidth: Writable<number | null> = writable(null);
export const canvasWrapperHeight: Writable<number | null> = writable(null);

export const textInputRef = writable(null);

type DistanceUnit = 'mm' | 'ft' | 'cm';

export const distanceUnit: Writable<DistanceUnit> = writable('mm');

export const colorButtons: Writable<string[]> = writable([
	'#E401CD',
	// "#FF85B5",
	'#FA1407',
	'#FF7A46',
	'#FF9A23',
	// "#FFB800",
	'#FFDB20',
	'#FFF859',
	'#64FF4A',
	'#00E883',
	'#00B13D',
	'#4FFFE7',
	'#00e0ff',
	'#0193FA',
	'#005CFA',
	'#000DDD',
	'#6F00E5',
	'#8850FF',
	'#000000',
	'#404040',
	'#5c5c5c',
	'#787878',
	'#939393',
	'#afafaf',
	'#cbcbcb',
	'#ffffff'
]);

// This following are the patterns for drawing the predefined signal line buttons
// I have no idea what I've done here an it's buggy

export const signalDirectionButtons: Writable<DirectionObj[]> = writable([
	{
		points: [
			{ x: 0, y: 1, i: [0, 0] },
			{ x: 0, y: -1, i: [0, 1] },
			{ x: 1, y: 0, i: [0, 0] },
			{ x: 0, y: 1, i: [1, 0] },
			{ x: 1, y: 0, i: [1, 1] }
		],
		initialDirection: 'vertical',
		transform: 'rotate(270) scale(.8)',
		pointOne: 'bottomleft',
		pointTwo: 'topleft',
		pointThree: 'topright',
		snapPointIndex: 0
	},
	{
		points: [
			{ x: 0, y: 1, i: [0, 0] },
			{ x: 0, y: -1, i: [0, 1] },
			{ x: -1, y: 0, i: [0, 0] },
			{ x: 0, y: 1, i: [1, 0] },
			{ x: -1, y: 0, i: [1, 1] }
		],
		initialDirection: 'vertical',
		transform: 'rotate(270) scale(.8, -.8)',
		pointOne: 'bottomright',
		pointTwo: 'topright',
		pointThree: 'topleft',
		snapPointIndex: 0
	},
	{
		points: [
			{ x: 0, y: 0, i: [1, 0] },
			{ x: 0, y: 1, i: [1, 0] },
			{ x: 1, y: 0, i: [1, 1] },
			{ x: 0, y: -1, i: [0, 1] },
			{ x: 1, y: 0, i: [0, 0] }
		],
		initialDirection: 'vertical',
		transform: 'rotate(90) scale(.8, -.8)',
		pointOne: 'topleft',
		pointTwo: 'bottomleft',
		pointThree: 'bottomright',
		snapPointIndex: 0
	},
	{
		points: [
			{ x: 1, y: 0, i: [1, 0] },
			{ x: 0, y: 1, i: [1, 0] },
			{ x: -1, y: 0, i: [1, 1] },
			{ x: 0, y: -1, i: [0, 1] },
			{ x: -1, y: 0, i: [0, 0] }
		],
		initialDirection: 'vertical',
		transform: 'rotate(90) scale(.8)',
		pointOne: 'topright',
		pointTwo: 'bottomright',
		pointThree: 'bottomleft',
		snapPointIndex: 0
	},
	{
		points: [
			{ x: 0, y: 0, i: [1, 1], doesFlip: false }, //  initial point
			{ x: 1, y: 0, i: [1, 0], doesFlip: true }, //  first move
			{ x: 0, y: 1, i: [1, 0], doesFlip: true }, //  second move
			{ x: -1, y: 0, i: [1, 0], doesFlip: true }, // third move
			{ x: 0, y: 1, i: [1, 0], doesFlip: true } //  fourth move
		],
		initialDirection: 'horizontal',
		transform: 'rotate(0) scale(.8)',
		pointOne: 'topleft',
		pointTwo: 'topright',
		pointThree: 'bottomright',
		snapPointIndex: 1
	},
	{
		points: [
			{ x: 1, y: 0, i: [1, 1], doesFlip: false },
			{ x: -1, y: 0, i: [1, 0], doesFlip: false },
			{ x: 0, y: 1, i: [1, 0], doesFlip: false },
			{ x: 1, y: 0, i: [1, 0], doesFlip: false },
			{ x: 0, y: 1, i: [1, 0], doesFlip: false }
		],
		initialDirection: 'horizontal',
		transform: 'rotate(180) scale(.8, -.8)',
		pointOne: 'topright',
		pointTwo: 'topleft',
		pointThree: 'bottomleft',
		snapPointIndex: 1
	},
	{
		points: [
			{ x: 0, y: 1, i: [0, 0], doesFlip: false },
			{ x: 1, y: 0, i: [0, 1], doesFlip: false },
			{ x: 0, y: -1, i: [0, 1], doesFlip: false },
			{ x: -1, y: 0, i: [0, 1], doesFlip: false },
			{ x: 0, y: -1, i: [0, 1], doesFlip: false }
		],
		initialDirection: 'horizontal',
		transform: 'rotate(0) scale(.8, -.8)',
		pointOne: 'bottomleft',
		pointTwo: 'bottomright',
		pointThree: 'topright',
		snapPointIndex: 0
	},
	{
		points: [
			{ x: 1, y: 1, i: [0, 0], doesFlip: false },
			{ x: -1, y: 0, i: [0, 1], doesFlip: false },
			{ x: 0, y: -1, i: [0, 1], doesFlip: false },
			{ x: 1, y: 0, i: [0, 1], doesFlip: false },
			{ x: 0, y: -1, i: [0, 1], doesFlip: false }
		],
		initialDirection: 'horizontal',
		transform: 'rotate(180) scale(.8)',
		pointOne: 'bottomright',
		pointTwo: 'bottomleft',
		pointThree: 'topleft',
		snapPointIndex: 0
	}
]);
