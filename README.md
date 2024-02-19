# erf / erfc

> [Inverse error function][erfinv] and
> [inverse complementary error function][erfcinv].

Evaluates the inverse error and inverse complementary error functions.

This package is a rewrite of
 [math-erfinv](https://github.com/math-io/erfinv)
 and
 [math-erfcinv](https://github.com/math-io/erfcinv)
 in Typescript.
This package supports both CommonJs and ES Modules.

---

The [inverse error function][erfinv] is defined as

```math
\mathrm{erf}^{-1}(z)=\sum_{k=0}^\infty\frac{c_k}{2k+1}\left (\frac{\sqrt{\pi}}{2}z\right )^{2k+1}
```

where `c_0 = 1` and

```math
c_k=\sum_{m=0}^{k-1}\frac{c_m c_{k-1-m}}{(m+1)(2m+1)} = \left\{1,1,\frac{7}{6},\frac{127}{90},\frac{4369}{2520},\frac{34807}{16200},\ldots\right\}
```


The [inverse complementary error function][erfcinv]
 is defined as

```math
\mathrm{erfc}^{-1}(1-z) = \mathrm{erf}^{-1}(z)
```


## Installation

``` bash
$ npm install @toshiara/special-erfinv
```


## Usage

``` javascript
// for CommonJs
const { erfinv, erfcinv } = require('@toshiara/special-erfinv');

// for ES Modules
import { erfinv, erfcinv } from '@toshiara/special-erfinv';
```

### erf(x)

Evaluates the [inverse error function][erfinv].

``` javascript
erfinv(0.1);
// returns 0.08885599049425769

erfinv(0.4);
// returns 0.37080715859355795
```

erfinv(0.85);
// returns 1.0179024648320276
```

erfinv(-1);
// returns -Infinity
```

erfinv(1);
// returns Infinity
```

If provided `NaN`, the `function` returns `NaN`.

``` javascript
erfinv(NaN);
// returns NaN
```


#### erfinvc(x)

Evaluates the [inverse complementary error function][erfcinv].

``` javascript
erfcinv(0.2);
// returns 0.9061938024368231

erfcinv(0.4);
// returns 0.5951160814499948

erfcinv(0.85);
// returns 0.13372692166481973

erfcinv(0);
// returns Infinity

erfcinv(2);
// returns -Infinity
```

If provided `NaN`, the `function` returns `NaN`.

``` javascript
erfcinv(NaN);
// returns NaN
```


## License
[MIT license](http://opensource.org/licenses/MIT).


## Copyright
Copyright &copy; 2016. The [Compute.io](https://github.com/compute-io) Authors.


[erfinv]: https://en.wikipedia.org/wiki/Error_function#Inverse_functions
[erfcinv]: https://en.wikipedia.org/wiki/Error_function#Inverse_functions

