import { get } from 'svelte/store';

import type { LoadSnapPointObj, SnapPointObj, SnapPointsType, ColorObjKey } from '$lib/types';

import {
	isCtrl,
	setSelection,
	setSelectedSnapPointIndexes,
	screens,
	currentScreenIndex,
	updateScreens
} from '$lib/store.designer';

import { SnapPoint } from '$lib/classes';

export class SnapPoints implements SnapPointsType {
	array = [];
	selectedSnapPointIndexes = [];
	screenIndex = undefined;
	radiusMultiplier = 1;
	radius = 10;

	constructor(screenIndex: number) {
		this.screenIndex = screenIndex;
	}

	setRadius(value: number) {
		//todo
	}

	setRadiusMultiplier(value: number) {
		// this.radiusMultiplier = value;
		this.array.forEach((sp) => {
			if (sp.isSelected) {
				sp.setScale(value);
			}
		});
	}

	selectAll() {
		this.array.forEach((sp: SnapPointObj) => {
			sp.setIsSelected(true);
			this.selectedSnapPointIndexes = [];
			this.selectedSnapPointIndexes.push(sp.pointIndexFullArray);
		});
		updateScreens();
	}

	setArrayFromLoad(snapPointsArray: LoadSnapPointObj[]) {
		// this.array = [];
		// snapPointsArray.forEach((snapPoint, i) => {
		//   const newSnapPoint = new SnapPoint(
		//     snapPoint.row,
		//     snapPoint.column,
		//     snapPoint.pointIndexWithinPanel,
		//     snapPoint.panelIndex,
		//     snapPoint.pointIndexFullArray
		//   );
		//   this.array.push(newSnapPoint);
		//   this.array[i].setIsTriangle(snapPoint.isTriangle);
		//   this.array[i].setIsSquare(snapPoint.isSquare);
		//   this.array[i].setLabel(snapPoint.label);
		//   this.array[i].setColorObj(snapPoint.color);
		// });
		//
	}

	load(saveObj) {
		saveObj.array.forEach((snapPoint, i) => {
			this.addSnapPoint(
				snapPoint.row,
				snapPoint.column,
				snapPoint.pointIndexWithinPanel,
				snapPoint.panelIndex,
				snapPoint.pointIndexFullArray
			);
			this.array[i].color.background = snapPoint.color.background;
			this.array[i].color.border = snapPoint.color.border;
			this.array[i].color.font = snapPoint.color.font;
			this.array[i].isSquare = snapPoint.isSquare;
			this.array[i].isTriangle = snapPoint.isTriangle;
			this.array[i].label = snapPoint.label;
			this.array[i].xOffset = snapPoint.xOffset;
			this.array[i].yOffset = snapPoint.yOffset;
		});
	}

	deSelect = () => {
		this.array.forEach((o) => o.setIsSelected(false));

		updateScreens();
	};

	addSnapPoint(i: number, j: number, k: number, count: number, snapPointIndex: number) {
		const newSnapPoint = new SnapPoint(i, j, k, count, snapPointIndex, this.screenIndex);
		this.array.push(newSnapPoint);
	}

	resetArray() {
		this.array = [];
	}

	getXCoordinate(snapPoint: SnapPointObj) {
		return snapPoint.getX();
	}

	getYCoordinate(snapPoint: SnapPointObj) {
		return snapPoint.getY();
	}

	selectSnapPoints = (arrayOfIndexes: number[]) => {
		const snapPointsClass = get(screens)[get(currentScreenIndex)].snapPoints;
		const signalLinesClass = get(screens)[get(currentScreenIndex)].signalLines;
		snapPointsClass.deSelect();
		signalLinesClass.deSelect();

		if (!get(isCtrl)) {
			this.selectedSnapPointIndexes = [];
			setSelectedSnapPointIndexes([]);
			this.array.forEach((panel) => {
				panel.setIsSelected(false);
			});
		}

		arrayOfIndexes.forEach((i) => {
			this.selectedSnapPointIndexes = arrayOfIndexes;
			this.array[i].setIsSelected(true);
		});

		setSelectedSnapPointIndexes(this.selectedSnapPointIndexes);
	};

	toggleSnapPoints = (arrayOfIndexes: number[]) => {
		const snapPointsClass = get(screens)[get(currentScreenIndex)].snapPoints;
		const signalLinesClass = get(screens)[get(currentScreenIndex)].signalLines;
		snapPointsClass.deSelect();
		signalLinesClass.deSelect();

		if (!get(isCtrl)) {
			this.selectedSnapPointIndexes = [];

			this.array.forEach((panel) => {
				this.selectedSnapPointIndexes = [];
				setSelectedSnapPointIndexes([]);
				panel.setIsSelected(false);
			});
		}

		arrayOfIndexes.forEach((i) => {
			this.selectedSnapPointIndexes = arrayOfIndexes;
			this.array[i].setIsSelected(true);
		});

		setSelectedSnapPointIndexes(this.selectedSnapPointIndexes);
	};

	selectSnapPoint = (e) => {
		const panelsClass = get(screens)[get(currentScreenIndex)].panels;
		const signalLinesClass = get(screens)[get(currentScreenIndex)].signalLines;
		panelsClass.deSelect();
		signalLinesClass.deSelect();

		const i = e.target.__data__.pointIndexFullArray;

		const current = this.array[i].isSelected;

		if (!get(isCtrl)) {
			this.selectedSnapPointIndexes = [];

			this.array.forEach((p) => p.setIsSelected(false));
		}

		this.array[i].setIsSelected(!current);

		this.array[i].isSelected && this.selectedSnapPointIndexes.push(i);

		setSelectedSnapPointIndexes(this.selectedSnapPointIndexes);

		setSelection('snappoints');

		updateScreens();
	};

	selectEvenOrOdd = (evenOrOdd) => {
		this.selectedSnapPointIndexes = [];
		this.array.forEach((p: SnapPointObj) => {
			p.setIsSelected(false);
			if (p.pointIndexWithinPanel == evenOrOdd) {
				p.setIsSelected(true);
				this.selectedSnapPointIndexes.push(p.pointIndexFullArray);
			}
			setSelectedSnapPointIndexes(this.selectedSnapPointIndexes);
			updateScreens();
		});
	};

	removeLabel = () => {
		this.array.forEach((sp) => {
			if (sp.isSelected) {
				sp.removeLabel();
			}
		});
		this.setIsSquares(false);
		this.setIsTriangles(false);
	};

	setIsSquares = (boolean: boolean) => {
		this.array.forEach((sp) => {
			if (sp.isSelected) {
				sp.setIsTriangle(false);
				sp.setIsSquare(boolean);
			}
		});
	};

	setIsTriangles = (boolean: boolean) => {
		this.array.forEach((sp) => {
			if (sp.isSelected) {
				sp.setIsSquare(false);
				sp.setIsTriangle(boolean);
			}
		});
	};

	setColors(key: ColorObjKey, color: string) {
		this.array.forEach((panel) => {
			if (panel.isSelected) {
				panel.setColor(key, color);
			}
		});

		updateScreens();
	}

	setXOffsets(value: number) {
		this.array.forEach((panel) => {
			if (panel.isSelected) {
				panel.setXOffset(value);
			}
		});
	}

	setYOffsets(value: number) {
		this.array.forEach((panel) => {
			if (panel.isSelected) {
				panel.setYOffset(value);
			}
		});
	}
}
