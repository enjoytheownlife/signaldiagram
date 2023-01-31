import { get } from 'svelte/store';

import {
	colorState,
	isCtrl,
	setSelection,
	setSignalLineColor,
	currentScreenIndex,
	screens,
	updateScreens
} from '$lib/store.designer';

import type {
	LoadSignalLineObj,
	SignalLineObj,
	SignalLinesType,
	SnapPointCoordinates,
	SnapPointCoordinatesKey,
	XYCoordinates,
	ColorObjKey,
	PanelObj,
	SnapPointObj
} from '$lib/types';

export class SignalLines implements SignalLinesType {
	array = [];

	origin = {
		snapPointIndex: null,
		panelIndex: null,

		pointIndexWithinPanel: null
	};

	destination = {
		snapPointIndex: null,
		panelIndex: null,
		pointIndexWithinPanel: null
	};

	mouse = {
		x: null,
		y: null
	};

	screenIndex: number;

	constructor(screenIndex: number) {
		this.screenIndex = screenIndex;
	}

	selectAll() {
		this.array.forEach((sl: SignalLineObj) => {
			sl.setIsSelected(true);
		});
		updateScreens();
	}

	setArrayFromLoad(signaLineArray: LoadSignalLineObj[]) {
		// this.array = [];
		// signaLineArray.forEach((signalLine, i) => {
		//   const newLine = new SignalLine(
		//     signalLine.origin,
		//     signalLine.destination.snapPointIndex
		//   );
		//   this.array.push(newLine);
		//   const thisLine = this.array[i];
		//   thisLine.updateColor(signalLine.color.background);
		// });
	}

	load(signaLineArray) {
		this.array = [];
		signaLineArray.forEach((signalLine, i) => {
			const newLine = new SignalLine(
				signalLine.origin,
				signalLine.destination.snapPointIndex,
				this.screenIndex
			);

			this.array.push(newLine);
			const thisLine = this.array[i];
			thisLine.updateColor(signalLine.color.background);
		});
	}

	getSnapPointCoordinates(signalLineIndex: number, key: SnapPointCoordinatesKey) {
		const signalLine = this.array[signalLineIndex];
		const snapPointsClass = get(screens)[this.screenIndex].snapPoints;

		const snapPointIndex = signalLine[key].snapPointIndex;

		const snapPoint = snapPointsClass.array[snapPointIndex];

		const snapPointX = snapPoint.getX();
		const snapPointY = snapPoint.getY();

		const x = snapPointX;
		const y = snapPointY;

		return {
			x,
			y
		};
	}

	getPanelIndex(row: number, column: number) {
		const p = get(screens)[get(currentScreenIndex)].panels.array;

		for (let i = 0; i < p.length; i++) {
			if (p[i].row === row && p[i].column === column) {
				return i;
			}
		}
	}

	nullDestinationSnapPointIndex() {
		this.destination.snapPointIndex = null;
	}

	setOriginSnapPointIndex(obj: SnapPointObj) {
		const panelIndex = this.getPanelIndex(obj.row, obj.column);

		const snapPointIndex = obj.pointIndexFullArray;

		this.origin.snapPointIndex = snapPointIndex;
		this.origin.panelIndex = panelIndex;
	}

	nullOriginAndDestinationValues() {
		this.origin.snapPointIndex = null;
		this.origin.panelIndex = null;
		this.destination.snapPointIndex = null;
		this.destination.panelIndex = null;
	}

	setDestinationSnapPointIndex(snapPoint: SnapPointObj) {
		this.destination.snapPointIndex = snapPoint.pointIndexFullArray;
	}

	setMousePosition(e: XYCoordinates) {
		this.mouse.x = e.x;
		this.mouse.y = e.y;
	}

	addSignalLine() {
		const origin = structuredClone(this.origin);
		if (this.destination.snapPointIndex < 0) {
			return;
		}

		if (this.origin.snapPointIndex != this.destination.snapPointIndex) {
			const sl = new SignalLine(origin, this.destination.snapPointIndex, this.screenIndex);

			this.array.push(sl);

			updateScreens();
		}

		this.nullOriginAndDestinationValues();
	}

	removeSignalLine(line: SignalLineObj) {
		this.array = this.array.filter((signalLine) => {
			return signalLine.i !== line.i;
		});

		updateScreens();
	}

	selectSignalLine(i: number) {
		const snapPointsClass = get(screens)[get(currentScreenIndex)].snapPoints;
		const panelsClass = get(screens)[get(currentScreenIndex)].panels;

		snapPointsClass.deSelect();
		panelsClass.deSelect();

		const current = this.array[i].isSelected;

		if (!get(isCtrl)) {
			this.array.forEach((sl) => sl.setIsSelected(false));
			this.array[i].setIsSelected(true);
		}
		this.array[i].setIsSelected(true);

		setSelection('signallines');
	}

	toggleSignalLine(i: number) {
		const snapPointsClass = get(screens)[get(currentScreenIndex)].snapPoints;
		const panelsClass = get(screens)[get(currentScreenIndex)].panels;

		snapPointsClass.deSelect();
		panelsClass.deSelect();

		const currentIndexInArray = this.array.findIndex((line) => line.i === i);

		const current = this.array[currentIndexInArray].isSelected;

		if (!get(isCtrl)) {
			this.array.forEach((sl) => sl.setIsSelected(false));
			this.array[currentIndexInArray].setIsSelected(!current);
		}
		this.array[currentIndexInArray].setIsSelected(!current);

		setSelection('signallines');
	}

	selectSignalLines(arrayOfIndexes: number[]) {
		const snapPointsClass = get(screens)[get(currentScreenIndex)].snapPoints;
		const signalLinesClass = get(screens)[get(currentScreenIndex)].signalLines;
		snapPointsClass.deSelect();
		signalLinesClass.deSelect();

		if (!get(isCtrl)) {
			this.array.forEach((line) => {
				line.setIsSelected(false);
			});
		}

		arrayOfIndexes.forEach((i) => {
			this.array[i].setIsSelected(true);
		});
	}

	deSelect() {
		this.array.forEach((signalLine) => {
			signalLine.setIsSelected(false);
		});
	}

	setColors(key: ColorObjKey, color: string) {
		let isSignalLinesSelected = false;
		this.array.forEach((snapPoint) => {
			if (snapPoint.isSelected) {
				snapPoint.setColor(key, color);
				isSignalLinesSelected = true;
			}
		});
		if (!isSignalLinesSelected) {
			setSignalLineColor(color);
		}
		updateScreens();
	}
}

class SignalLine implements SignalLineObj {
	origin = {
		snapPointIndex: 0,
		panelIndex: 0,
		pointIndexWithinPanel: 0
	};
	destination = {
		snapPointIndex: 0,
		panelIndex: 0,
		pointIndexWithinPanel: 0
	};
	color = {
		background: '#000000',
		border: '#000000',
		font: '#ffffff'
	};
	i: number;
	lineWidth = 8;
	isSelected = false;
	screenIndex: number;

	constructor(
		origin: SnapPointCoordinates,
		destinationSnapPointIndex: number,
		screenIndex: number
	) {
		this.screenIndex = screenIndex;
		let screen = get(screens)[screenIndex];
		this.origin.snapPointIndex = origin.snapPointIndex;
		this.origin.panelIndex = origin.panelIndex;
		this.destination.snapPointIndex = destinationSnapPointIndex;
		this.i = get(screens)[screenIndex].signalLines.array.length;
		this.color.background = get(colorState).signalLine.background;
		this.lineWidth = screen.width < screen.height ? screen.width / 20 : screen.height / 20;
		this.setDestinationPanelIndex();
		this.setIndexesWithInPanel();
	}

	getLineWidth() {
		let screen = get(screens)[this.screenIndex];

		return screen.width < screen.height ? screen.width / 20 : screen.height / 20;
	}

	setIndexesWithInPanel() {
		let oSp: SnapPointObj =
			get(screens)[this.screenIndex].snapPoints.array[this.origin.snapPointIndex];
		let o = oSp.pointIndexWithinPanel;
		let dSp: SnapPointObj =
			get(screens)[this.screenIndex].snapPoints.array[this.destination.snapPointIndex];
		let d = dSp.pointIndexWithinPanel;
		this.origin.pointIndexWithinPanel = o;
		this.destination.pointIndexWithinPanel = d;
	}

	setDestinationPanelIndex() {
		let sp = get(screens)[this.screenIndex].snapPoints.array[this.destination.snapPointIndex];
		this.destination.panelIndex = sp.panelIndex;
	}

	setIsSelected(boolean: boolean) {
		this.isSelected = boolean;
	}

	setEndCoordinates(e) {
		const panel = e.path[1].__data__;
		const indexOfPoint = e.path[0].__data__;
		this.destination.snapPointIndex = indexOfPoint;
		this.destination.panelIndex = panel.i;
	}

	updateColor(color: string) {
		this.color.background = color;
	}

	updateLineWidth(width: number) {
		this.lineWidth = width;
	}

	setColor(key: ColorObjKey, color: string) {
		this.color[key] = color;
	}

	getLengthInMM() {
		const originSnapPoint: SnapPointObj =
			get(screens)[this.screenIndex].snapPoints.array[this.origin.snapPointIndex];

		const destinationSnapPoint: SnapPointObj =
			get(screens)[this.screenIndex].snapPoints.array[this.destination.snapPointIndex];

		const screen = get(screens)[this.screenIndex];

		const destinationX = (destinationSnapPoint.getX() / screen.width) * screen.widthMM;
		const destinationY = (destinationSnapPoint.getY() / screen.height) * screen.heightMM;

		const originX = (originSnapPoint.getX() / screen.width) * screen.widthMM;
		const originY = (originSnapPoint.getY() / screen.height) * screen.heightMM;

		const a = Math.abs(destinationX - originX);
		const b = Math.abs(destinationY - originY);
		const c = Math.floor(Math.sqrt(a * a + b * b) / 50) * 50;

		return c;
	}
}
