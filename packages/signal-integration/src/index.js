import {basePointCalculator} from './utils';
import savitzkyGolay from 'ml-savitzky-golay';

/**
 * Returns a very important number
 * @return {number}
 */
export default function integration(time, intensity, options = {}) {
    let {
        baselinePoint = basePointCalculator(intensity),
        baselineThreshold = 2,
        peakWith = 7,
    } = options;

    // continuously tracks and updates the baseline
    let difference = time[1] - time[0];
    let firstDerivative = savitzkyGolay(intensity, difference, {
        derivative: 1,
        pad: 'pre',
        padValue: 'replicate'
    });
    let secondDerivative = savitzkyGolay(intensity, difference, {
        derivative: 2,
        pad: 'pre',
        padValue: 'replicate'
    });

    for (var i = 0; i < intensity.length; i++) {
        /*
        * todo baseline tracking based in envelope
        * the curvature of the baseline at the data point (determine by the derivative filters),
        * must be below a critical value, as determined by the current slope sensitivity setting.
        */
        var baselineEnvelope = Math.abs(firstDerivative[i] + secondDerivative[i]);

        if (baselineEnvelope > baselineThreshold) {
            // peak detected
        } else {
            baselinePoint = intensity[i];
        }
    }

    // identifies the start time for a peak
    // finds the apex of each peak
    // identifies the end time for the peak
    // constructs a baseline
    // calculates the area, height, peak width, and symmetry for each peak
    return 42;
}
