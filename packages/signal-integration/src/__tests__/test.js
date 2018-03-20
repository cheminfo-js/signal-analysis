import integration from '..';

// https://en.wikipedia.org/wiki/Cauchy_distribution
function lorentzian(x, x0 = 0, gamma = 1) {
  return gamma ** 2 / (Math.PI * gamma * (gamma ** 2 + (x - x0) ** 2));
}

function getSimulatedSpectrum(options = {}) {
  const { size = 30 } = options;
  const fourth = size / 4;
  let time = new Array(size);
  let intensity = new Array(size);
  for (let i = 0; i < size; ++i) {
    time[i] = i;
    intensity[i] =
      lorentzian(i, fourth) +
      2 * lorentzian(i, 2 * fourth) +
      lorentzian(i, 3 * fourth);
  }
  return { time, intensity };
}

describe('integration', () => {
  it('simple peaks', () => {
    const spectrum = getSimulatedSpectrum();
    const result = integration(spectrum.time, spectrum.intensity);
    expect(result.peaks).toHaveLength(3);
  });
});
