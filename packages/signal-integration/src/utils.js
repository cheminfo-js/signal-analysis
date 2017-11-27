import mean from 'ml-array-mean';

export function basePointCalculator(data, threshold = 1e3) {
    let baselinePoint = data[0];
    let optionalBaseline = mean(data);
    if (Math.abs(optionalBaseline - baselinePoint) < threshold) {
        return baselinePoint;
    } else {
        return optionalBaseline;
    }
}