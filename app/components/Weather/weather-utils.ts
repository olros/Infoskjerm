import { addMinutes, differenceInMinutes, isBefore, isSameMinute, parseISO } from 'date-fns';

import type { WeatherResponse } from '~/routes/api.yr.weather';

const MAX_PRECIPITATION_INTENSITY = 9;

/**
 * Retrieve a SVG path description from an array of precipitation values
 */
export function precipitationPathDescriptionFromNowcastPoints({
  points,
  targetDuration,
  width,
  height,
}: {
  points: WeatherResponse['timeseries'];
  targetDuration: number;
  width: number;
  height: number;
}): string {
  const startTime = parseISO(points[0].time);
  const targetEndTime = addMinutes(startTime, targetDuration);

  // Don't include points that are more than `targetDuration` minutes after the start time.
  const pointsToInclude = points.filter((point) => {
    const pointTime = parseISO(point.time);

    return isBefore(pointTime, targetEndTime) || isSameMinute(pointTime, targetEndTime);
  });

  // Calculate the duration of the points we are including.
  const pointsToIncludeEndTime = parseISO(pointsToInclude[pointsToInclude.length - 1].time);
  const pointsToIncludeDuration = differenceInMinutes(pointsToIncludeEndTime, startTime);

  const coordinates = pointsToInclude.map((point) => {
    const minute = differenceInMinutes(parseISO(point.time), startTime);

    const x = (minute / targetDuration) * width;
    const y = coordinateFromSquaredNowPrecipitationIntensity(point.data.instant.details.precipitation_rate, height);

    return [x, y];
  });

  const plot = splinePoints(coordinates);

  // The width should be equal to the target duration, but if the duration of points to include is less
  // we need to adjust it correspondingly.
  const pathWidth = (pointsToIncludeDuration / targetDuration) * width;

  return `${splineSvgPath(plot)} L ${pathWidth} ${height} L 0 ${height} Z`;
}

/**
 * Retrieve Y coordinate for now precipitation 'value' (for drawing a graph)
 * The coordinates are transposed using Math.sqrt() to make it possible to
 * see small precipitation values such as 0.3 in a graph with a max value of 10.
 */
export function coordinateFromSquaredNowPrecipitationIntensity(value: number, maxHeight: number): number {
  const maxPrecipitationIntensitySquared = Math.sqrt(MAX_PRECIPITATION_INTENSITY);
  const valueSquared = Math.sqrt(value);

  if (valueSquared >= maxPrecipitationIntensitySquared) {
    return 0;
  }

  return Math.round(maxHeight - (valueSquared / maxPrecipitationIntensitySquared) * maxHeight);
}

/**
 * Convert 'points' to catmull rom bezier spline
 * @param points The points
 * @returns An array of points
 */
const splinePoints = (_points: Array<Array<number>>) => {
  const n = _points.length;

  // Abort if there are not sufficient points to draw a curve
  if (n < 3) return _points;

  let p0 = _points[0];
  let p1 = _points[0];
  let p2 = _points[1];
  let p3 = _points[2];
  const pts = [_points[0]];

  for (let i = 1; i < n; i++) {
    pts.push([
      (-p0[0] + 6 * p1[0] + p2[0]) / 6,
      (-p0[1] + 6 * p1[1] + p2[1]) / 6,
      (p1[0] + 6 * p2[0] - p3[0]) / 6,
      (p1[1] + 6 * p2[1] - p3[1]) / 6,
      p2[0],
      p2[1],
    ]);

    p0 = p1;
    p1 = p2;
    p2 = p3;
    p3 = _points[i + 2] || p3;
  }

  return pts;
};

/**
 * Convert 'points' to svg path
 * @param points The points
 * @returns A SVG-path
 */
const splineSvgPath = (points: Array<Array<number>>) => {
  let p = '';

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const n = point.length;

    if (!i) {
      p += 'M' + point[n - 2] + ' ' + point[n - 1];
    } else if (n > 4) {
      p += 'C' + point[0] + ', ' + point[1];
      p += ', ' + point[2] + ', ' + point[3];
      p += ', ' + point[4] + ', ' + point[5];
    } else {
      p += 'S' + point[0] + ', ' + point[1];
      p += ', ' + point[2] + ', ' + point[3];
    }
  }

  return p;
};
