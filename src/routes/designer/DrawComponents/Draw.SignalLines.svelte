<script lang="ts">
	import {
		isDrawingSignalLine,
		gZoomWrapperRef,
		isSelectMode,
		linesGroupRef,
		linesGroupEnterRef,
		snapPointsGroupEnterRef,
		snapPointsQuantity,
		snapPointDirection,
		isDrawMode,
		screens,
		currentScreenIndex
	} from '$lib/store.designer';

	let hoveredColor = 'rgba(0, 255, 170, 1)';
	let selectedColor = 'rgba(241, 89, 70, 1)';

	import * as d3 from 'd3';

	import type { SignalLineObj } from '$lib/types';

	$: {
		let t = [
			$isDrawingSignalLine,
			$snapPointsQuantity,
			$snapPointDirection,
			$currentScreenIndex,
			$screens
		];

		let l = $screens[$currentScreenIndex].signalLines.array.length;

		typeof $currentScreenIndex === 'number' && drawSignalLines();
	}

	const drawSignalLines = () => {
		// Signal Line Wrapper
		// Signal Line Wrapper
		// Signal Line Wrapper

		$linesGroupRef = $gZoomWrapperRef
			.selectAll('g.signal-line')
			.data($screens[$currentScreenIndex].signalLines.array, (d: SignalLineObj) => {
				return d.i;
			});

		$linesGroupEnterRef = $linesGroupRef
			.enter()
			.append('g')
			.attr('id', (d: SignalLineObj) => {
				return 'line-group' + d.i;
			})
			.classed('signal-line', true);

		$linesGroupEnterRef.merge($linesGroupRef).transition();

		$linesGroupRef.exit().remove();

		// Line Outline
		// Line Outline
		// Line Outline
		let signalLineOutline = $linesGroupEnterRef
			.append('line')
			.merge($linesGroupRef.select('line.line-outline'))
			.attr('id', (d) => 'line-outline' + d.i)
			.classed('line-outline', true)
			.attr(
				'x1',
				(d, i) => $screens[$currentScreenIndex].signalLines.getSnapPointCoordinates(i, 'origin').x
			)
			.attr(
				'y1',
				(d, i) => $screens[$currentScreenIndex].signalLines.getSnapPointCoordinates(i, 'origin').y
			)
			.attr(
				'x2',
				(d, i) =>
					$screens[$currentScreenIndex].signalLines.getSnapPointCoordinates(i, 'destination').x
			)
			.attr(
				'y2',
				(d, i) =>
					$screens[$currentScreenIndex].signalLines.getSnapPointCoordinates(i, 'destination').y
			)
			.attr('stroke', (d) => {
				if (d.isSelected) {
					return selectedColor;
				} else {
					return 'none';
				}
			})
			.attr('stroke-width', (d) => d.getLineWidth() * 2)
			.attr('pointer-events', 'visible')
			.on('mouseover', (d) => {
				if ($isDrawMode) return;
				d.stopPropagation();
				$isSelectMode && !$isDrawingSignalLine && d3.select(d.target).attr('stroke', hoveredColor);
			})
			.on('mouseout', (e, d) => {
				if ($isDrawMode) return;
				e.stopPropagation();
				$isSelectMode &&
					!$isDrawingSignalLine &&
					d3.select(e.target).attr('stroke', () => {
						if (d.isSelected) {
							return selectedColor;
						} else {
							return 'none';
						}
					});
			})
			.on('click', function (e) {
				if ($isDrawMode) return;
				e.stopPropagation();

				let i = e.target.__data__.i;

				if ($isSelectMode && !$isDrawingSignalLine) {
					$screens[$currentScreenIndex].signalLines.toggleSignalLine(i);
					d3.select(this).attr('stroke', selectedColor);
				}
			});

		// Line
		// Line
		// Line
		$linesGroupEnterRef
			.append('line')
			.merge($linesGroupRef.select('line.line-base'))
			.attr('id', (d) => 'line-base' + d.i)
			.classed('line-base', true)
			.attr(
				'x1',
				(d, i) => $screens[$currentScreenIndex].signalLines.getSnapPointCoordinates(i, 'origin').x
			)
			.attr(
				'y1',
				(d, i) => $screens[$currentScreenIndex].signalLines.getSnapPointCoordinates(i, 'origin').y
			)
			.attr(
				'x2',
				(d, i) =>
					$screens[$currentScreenIndex].signalLines.getSnapPointCoordinates(i, 'destination').x
			)
			.attr(
				'y2',
				(d, i) =>
					$screens[$currentScreenIndex].signalLines.getSnapPointCoordinates(i, 'destination').y
			)
			.attr('stroke', (d) => {
				return d.color.background;
			})
			// .attr("stroke", "blue")
			.attr('stroke-width', (d) => d.lineWidth)
			.attr('pointer-events', 'none');

		let directionArrows = $linesGroupEnterRef
			.append('polygon')
			.merge($linesGroupRef.select('polygon.direction-arrow'))
			.classed('direction-arrow', true)
			.attr('points', (d, i) => {
				return '0,-6 7,10 -7,10';
			})
			.attr('transform', (d, i) => {
				let origin = $screens[$currentScreenIndex].signalLines.getSnapPointCoordinates(i, 'origin');
				let destination = $screens[$currentScreenIndex].signalLines.getSnapPointCoordinates(
					i,
					'destination'
				);
				let midpoint = {
					x: origin.x + (destination.x - origin.x) / 2,
					y: origin.y + (destination.y - origin.y) / 2
				};

				let angle =
					-Math.atan2(destination.x - origin.x, destination.y - origin.y) * (180 / Math.PI) + 180;

				return 'translate(' + midpoint.x + ',' + midpoint.y + ') rotate(' + angle + ')';
			})
			.attr('fill', (d) => {
				return d.color.background;
			})
			.attr('stroke', (d) => {
				return d.color.background;
			})
			.attr('stroke-width', (d) => {
				return d.lineWidth;
			})
			.attr('pointer-events', 'none');

		if (!$screens[$currentScreenIndex].showDirectionArrows) {
			directionArrows.attr('points', (d, i) => {
				return '0,0 0,0 0,0';
			});
		}

		// Init Temporary Signal Line
		// Init Temporary Signal Line
		// Init Temporary Signal Line
		$gZoomWrapperRef
			.append('line')
			.attr('id', 'temp-signal-line')
			.attr('stroke', 'black')
			.attr(
				'stroke-width',
				$screens[$currentScreenIndex].width < $screens[$currentScreenIndex].height
					? $screens[$currentScreenIndex].width / 20
					: $screens[$currentScreenIndex].height / 20
			)
			.raise();

		if ($snapPointsGroupEnterRef) {
			d3.selectAll('g.snap-point-wrapper').raise();
		}
	};
</script>
