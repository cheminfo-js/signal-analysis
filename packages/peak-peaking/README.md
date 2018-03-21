# peak-picking

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

Locates the peaks in a signal and track the baseline.

## Installation

`$ npm install --save peak-picking`

## Usage

```js
import peakPicking from 'peak-picking';

const spectrum = {
  // array of numbers
  time: [
    /* ... */
  ],
  // array of numbers
  intensity: [
    /* ... */
  ]
};
const {
  peaks, // array of { start, end, apex, firstInflectionPoint, secondInflectionPoint }
  baseline // array of {time: number, intensity: number}
} = peakPicking(spectrum.time, spectrum.intensity);

peaks.map(
  ({ start, end, apex, firstInflectionPoint, secondInflectionPoint }) => {
    // each property has this elements
    const { time, intensity, index } = start;
  }
);
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/peak-picking.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/peak-picking
[download-image]: https://img.shields.io/npm/dm/peak-picking.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/peak-picking
