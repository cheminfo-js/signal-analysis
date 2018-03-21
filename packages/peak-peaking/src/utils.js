export function thresholdCalculator(percentaje, derivative) {
  var maxValue = -1;
  for (var i = 0; i < derivative.length; i++) {
    if (Math.abs(derivative[i]) > maxValue) {
      maxValue = Math.abs(derivative[i]);
    }
  }
  if (maxValue === -1) return 0;
  return maxValue * percentaje;
}
