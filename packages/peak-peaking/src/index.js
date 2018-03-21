import savitzkyGolay from 'ml-savitzky-golay';

import { thresholdCalculator } from './utils';

export default function peakPicking(time, intensity, options = {}) {
  let {
    baselineThreshold = 0.1,
    peakWindow,
    invert = false,
    filterOptions = {}
  } = options;

  const { windowSize = 5, polynomial = 2 } = filterOptions;

  if (invert) {
    intensity = intensity.map((val) => -val);
  }

  // calculates the derivatives
  const timeDiff = Math.abs(time[1] - time[0]);
  let firstDerivative = savitzkyGolay(intensity, timeDiff, {
    derivative: 1,
    pad: 'pre',
    padValue: 'replicate',
    windowSize,
    polynomial
  });
  let secondDerivative = savitzkyGolay(intensity, timeDiff, {
    derivative: 2,
    pad: 'pre',
    padValue: 'replicate',
    windowSize,
    polynomial
  });

  // calculates the number of point for the window
  peakWindow = peakWindow !== undefined ? Math.ceil(peakWindow / timeDiff) : 5;

  // calculates the minimum value for the baseline
  const threshold = thresholdCalculator(baselineThreshold, firstDerivative);

  // continuously tracks and updates the baseline
  let baseline = [];
  let peaks = [];

  const peakWith = (peakWindow >> 1) + 1;
  for (var i = 0; i < intensity.length - peakWindow - 1; i += peakWith) {
    if (firstDerivative[i] > threshold) {
      // identifies the start time for a peak
      const start = {
        index: i,
        time: time[i],
        intensity: intensity[i]
      };

      let peak = peakDetection(
        time,
        intensity,
        i,
        firstDerivative,
        secondDerivative,
        threshold
      );
      if (peak) {
        peak.start = start;
        peaks.push(peak);
        i = peak.end.index - peakWith;
        baseline.push({
          time: start.time,
          intensity: start.intensity
        });
        baseline.push({
          time: peak.end.time,
          intensity: peak.end.intensity
        });
      }
    } else {
      // continues as baseline
      baseline.push({
        time: time[i],
        intensity: intensity[i]
      });
    }
  }

  // constructs a baseline
  // calculates the area, height, peak width, and symmetry for each peak
  return { peaks, baseline };
}

function peakDetection(
  time,
  intensity,
  start,
  firstDerivative,
  secondDerivative,
  threshold
) {
  const len = time.length;

  // begining of the peak
  var currentIndex = start + 1;
  while (secondDerivative[currentIndex] > 0) {
    if (currentIndex++ > len) return false;
  }
  const firstInflectionPoint = {
    index: currentIndex,
    time: time[currentIndex],
    intensity: intensity[currentIndex]
  };

  // finds the apex of the peak
  while (firstDerivative[currentIndex] > 0) {
    if (currentIndex++ > len) return false;
  }
  const apex = {
    index: currentIndex,
    time: time[currentIndex],
    intensity: intensity[currentIndex]
  };

  while (secondDerivative[currentIndex] < 0) {
    if (currentIndex++ > len) return false;
  }
  const secondInflectionPoint = {
    index: currentIndex,
    time: time[currentIndex],
    intensity: intensity[currentIndex]
  };

  // identifies the end time for the peak
  while (firstDerivative[currentIndex] < -threshold) {
    if (currentIndex++ > len) return false;
  }
  const end = {
    index: currentIndex,
    time: time[currentIndex] || time[currentIndex - 1],
    intensity: intensity[currentIndex] || intensity[currentIndex - 1]
  };

  return { end, apex, firstInflectionPoint, secondInflectionPoint };
}
