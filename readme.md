# map-abbrs

Creates a function that accepts specified strings (or abbreviations thereof) and returns corresponding specified output.

Can be used to map command-line arguments to functions, for example.

## Installation

Requires [Node.js](https://nodejs.org/) 7.0.0 or above.

```bash
npm i map-abbrs
```

## API

The module exports a single function.

### Parameters

1. `map` (Map or Object): A dictionary of strings and values.
2. Optional: Object argument:
    * `ci` (boolean): Whether or not strings should be compared case-insensitively. Defaults to `false`.
    * `elseCall` (function): If provided, will be called with two arguments in the event that an input does not match any keys in the `map`. The first argument is a function that, when called, will defer to `elseThrow` and/or `elseReturn` if provided. (If `elseCall` cannot return a value, it should call this first argument and return its return value.) The second argument is the input that failed to match any single `map` key.
    * `elseThrow` (Error or string): An error to throw if an input does not match any single `map` key. A string will be converted to a `RangeError`. Only used if `elseCall` is not provided or defers.
    * `elseReturn` (any): A value to be returned if an input does not match any single `map` key. Only used if `elseThrow` is not provided and if `elseCall` is not provided or defers.

### Return Value

Returns a function that accepts a single `input` argument. If this `input` matches a `map` key or is an abbreviation thereof, then the corresponding `map` value will be returned. Otherwise, fallback behavior will be determined by `elseCall`, `elseThrow`, and/or `elseReturn`.

## Example

```javascript
const mapAbbrs = require('map-abbrs')

const mapAbbr = mapAbbrs({
  example: 1,
  test: 2,
  testing: 3,
}, {
  elseCall: (fallback, input) => input === 'four' ? 4 : fallback(),
  elseThrow: 'Invalid or ambiguous value'
})

mapAbbr('example') // 1
mapAbbr('ex') // 1
mapAbbr('test') // 2
mapAbbr('testi') // 3
mapAbbr('t') // Uncaught RangeError: 'Invalid or ambiguous value'
mapAbbr('four') // 4
mapAbbr('other') // Uncaught RangeError: 'Invalid or ambiguous value'
```

## Related

Inspired by [abbrev](https://github.com/isaacs/abbrev-js).
