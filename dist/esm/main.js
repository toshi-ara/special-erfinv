/**
 * erfinv( x )
 *
 * Method:
 *	1. For `|x| <= 0.5`, evaluate inverse erf using the rational approximation:
 *
 *		`erfinv = x(x+10)(Y+R(x))`
 *
 *	where `Y` is a constant and `R(x)` is optimized for a low absolute error compared to `|Y|`. Max error `~2e-18`.
 *
 *	2. For `0.5 > 1-|x| >= 0`, evaluate inverse erf using the rational approximation:
 *
 *		`erfinv = sqrt(-2*log(1-x)) / (Y + R(1-x))`
 *
 *	where `Y `is a constant, and R(q) is optimised for a low absolute error compared to `Y`. Max error `~7e-17`.
 *
 *	3. For `1-|x| < 0.25`, we have a series of rational approximations all of the general form:
 *
 *		`p = sqrt(-log(1-x))`
 *
 *	Then the result is given by:
 *
 *		`erfinv = p(Y+R(p-B))`
 *
 *	where `Y` is a constant, `B` is the lowest value of `p` for which the approximation is valid, and `R(x-B)` is optimized for a low absolute error compared to `Y`.
 *
 *	Note that almost all code will really go through the first or maybe second approximation.  After that we are dealing with very small input values.
 *
 *	If `p < 3`, max error `~1e-20`.
 *	If `p < 6`, max error `~8e-21`.
 *	If `p < 18`, max error `~1e-19`.
 *	If `p < 44`, max error `~6e-20`.
 *	If `p >= 44`, max error `~1e-20`.
 */
// MODULES //
import { polyval } from "@toshiara/helper-functions";
// CONSTANTS //
// Coefficients for erfinv on [0, 0.5]:
const Y1 = 8.91314744949340820313e-2;
const P1 = [
    -5.08781949658280665617e-4,
    -8.36874819741736770379e-3,
    3.34806625409744615033e-2,
    -1.26926147662974029034e-2,
    -3.65637971411762664006e-2,
    2.19878681111168899165e-2,
    8.22687874676915743155e-3,
    -5.38772965071242932965e-3,
    0.0,
    0.0
];
const Q1 = [
    1.0,
    -9.70005043303290640362e-1,
    -1.56574558234175846809,
    1.56221558398423026363,
    6.62328840472002992063e-1,
    -7.1228902341542847553e-1,
    -5.27396382340099713954e-2,
    7.95283687341571680018e-2,
    -2.33393759374190016776e-3,
    8.86216390456424707504e-4
];
// Coefficients for erfinv for 0.5 > 1-x >= 0:
const Y2 = 2.249481201171875;
const P2 = [
    -2.02433508355938759655e-1,
    1.05264680699391713268e-1,
    8.37050328343119927838,
    1.76447298408374015486e1,
    -1.88510648058714251895e1,
    -4.46382324441786960818e1,
    1.7445385985570866523e1,
    2.11294655448340526258e1,
    -3.67192254707729348546
];
const Q2 = [
    1.0,
    6.24264124854247537712,
    3.9713437953343869095,
    -2.86608180499800029974e1,
    -2.01432634680485188801e1,
    4.85609213108739935468e1,
    1.08268667355460159008e1,
    -2.26436933413139721736e1,
    1.72114765761200282724
];
// Coefficients for erfinv for sqrt( -log(1-x) ):
const Y3 = 8.07220458984375e-1;
const P3 = [
    -1.31102781679951906451e-1,
    -1.63794047193317060787e-1,
    1.17030156341995252019e-1,
    3.87079738972604337464e-1,
    3.37785538912035898924e-1,
    1.42869534408157156766e-1,
    2.90157910005329060432e-2,
    2.14558995388805277169e-3,
    -6.79465575181126350155e-7,
    2.85225331782217055858e-8,
    -6.81149956853776992068e-10
];
const Q3 = [
    1.0,
    3.46625407242567245975,
    5.38168345707006855425,
    4.77846592945843778382,
    2.59301921623620271374,
    8.48854343457902036425e-1,
    1.52264338295331783612e-1,
    1.105924229346489121e-2,
    0.0,
    0.0,
    0.0
];
const Y4 = 9.3995571136474609375e-1;
const P4 = [
    -3.50353787183177984712e-2,
    -2.22426529213447927281e-3,
    1.85573306514231072324e-2,
    9.50804701325919603619e-3,
    1.87123492819559223345e-3,
    1.57544617424960554631e-4,
    4.60469890584317994083e-6,
    -2.30404776911882601748e-10,
    2.66339227425782031962e-12
];
const Q4 = [
    1.0,
    1.3653349817554063097,
    7.62059164553623404043e-1,
    2.20091105764131249824e-1,
    3.41589143670947727934e-2,
    2.63861676657015992959e-3,
    7.64675292302794483503e-5,
    0.0,
    0.0
];
const Y5 = 9.8362827301025390625e-1;
const P5 = [
    -1.67431005076633737133e-2,
    -1.12951438745580278863e-3,
    1.05628862152492910091e-3,
    2.09386317487588078668e-4,
    1.49624783758342370182e-5,
    4.49696789927706453732e-7,
    4.62596163522878599135e-9,
    -2.81128735628831791805e-14,
    9.9055709973310326855e-17
];
const Q5 = [
    1.0,
    5.91429344886417493481e-1,
    1.38151865749083321638e-1,
    1.60746087093676504695e-2,
    9.64011807005165528527e-4,
    2.75335474764726041141e-5,
    2.82243172016108031869e-7,
    0.0,
    0.0
];
// ERFINV //
/**
 * FUNCTION: erfinv(x)
 *	Evaluates the inverse error function for an input value.
 *
 * @private
 * @param {Number} x - input value
 * @returns {Number} evaluated inverse error function
*/
export function erfinv(x) {
    let sign = false;
    let val;
    let q;
    let g;
    let r;
    // [1] Special cases...
    // NaN:
    if (isNaN(x)) {
        return NaN;
    }
    // x not on the interval: [-1,1]
    if (x < -1 || x > 1) {
        throw new RangeError('erfinv()::invalid input argument. Value must be on the interval [-1,1]. Value: `' + x + '`.');
    }
    if (x === 1) {
        return Number.POSITIVE_INFINITY;
    }
    if (x === -1) {
        return Number.NEGATIVE_INFINITY;
    }
    if (x === 0) {
        return 0;
    }
    // [2] Get the sign and make use of `erf` reflection formula:
    //  `erf(-z) = -erf(z)`...
    if (x < 0) {
        x = -x;
        sign = true;
    }
    q = 1 - x;
    // [3] |x| <= 0.5
    if (x <= 0.5) {
        g = x * (x + 10);
        r = evalrational(x, P1, Q1);
        val = g * Y1 + g * r;
        return (sign) ? -val : val;
    }
    // [4] 1-|x| >= 0.25
    if (q >= 0.25) {
        g = Math.sqrt(-2 * Math.log(q));
        q -= 0.25;
        r = evalrational(q, P2, Q2);
        val = g / (Y2 + r);
        return (sign) ? -val : val;
    }
    q = Math.sqrt(-Math.log(q));
    // [5] q < 3
    if (q < 3) {
        r = evalrational(q - 1.125, P3, Q3);
        val = (Y3 + r) * q;
        return (sign) ? -val : val;
    }
    // [6] q < 6
    if (q < 6) {
        r = evalrational(q - 3.0, P4, Q4);
        val = (Y4 + r) * q;
        return (sign) ? -val : val;
    }
    // Note that the smallest number in JavaScript is 5e-324. Math.sqrt( -Math.log( 5e-324 ) ) ~27.2844
    // q < 18 
    r = evalrational(q - 6.0, P5, Q5);
    val = (Y5 + r) * q;
    return (sign) ? -val : val;
    // Note that, in the boost library, they are able to go to much smaller values,
    // as 128 bit long doubles support ~1e-5000;
    // something which JavaScript does not natively support.
}
/**
 * erfcinv( x )
 *   Evaluates the inverse complementary error function, using the fact that `erfc^{-1}(1-z) = erf^{-1}(z)`.
 *
 * Method:
 *   1. For `|x| <= 0.5`, evaluate inverse erf using the rational approximation:
 *
 *        erfinv = x(x+10)(Y+R(x))
 *
 *      where `Y` is a constant and `R(x)` is optimized for a low absolute error compared to `|Y|`. Max error `2.001849e-18`. Maximum deviation found (error term at infinite precision) `8.030e-21`.
 *
 *   2. For `0.5 > 1-|x| >= 0`, evaluate inverse erf using the rational approximation:
 *
 *        erfinv = sqrt(-2*log(1-x)) / (Y + R(1-x))
 *
 *      where `Y `is a constant, and R(q) is optimized for a low absolute error compared to `Y`. Max error `7.403372e-17`. Maximum deviation found (error term at infinite precision) `4.811e-20`.
 *
 *   3. For `1-|x| < 0.25`, we have a series of rational approximations all of the general form:
 *
 *        p = sqrt(-log(1-x))
 *
 *      Then the result is given by:
 *
 *        erfinv = p(Y+R(p-B))
 *
 *      where `Y` is a constant, `B` is the lowest value of `p` for which the approximation is valid, and `R(x-B)` is optimized for a low absolute error compared to `Y`.
 *
 *   Notes:
 *     - Almost all code will really go through the first or maybe second approximation.  After that we are dealing with very small input values.
 *
 *       If `p < 3`, max error `1.089051e-20`.
 *       If `p < 6`, max error `8.389174e-21`.
 *       If `p < 18`, max error `1.481312e-19`.
 *       If `p < 44`, max error `5.697761e-20`.
 *       If `p >= 44`, max error `1.279746e-20`.
 *
 *     - The Boost library can accommodate 80 and 128 bit long doubles. JavaScript only supports a 64 bit double (IEEE754). Accordingly, the smallest `p` (in JavaScript at the time of this writing) is `sqrt(-log(~5e-324)) = 27.284429111150214`.
 */
// ERFCINV //
/**
 * FUNCTION: erfcinv(x)
 *	Evaluates the inverse complementary error function.
 *
 * @param {Number} x - input value
 * @returns {Number} evaluated inverse complementary error function
 */
export function erfcinv(x) {
    let sign;
    let val = 0;
    let q;
    let g;
    let r;
    // Special case: NaN
    if (isNaN(x)) {
        return NaN;
    }
    // Special case: 0
    if (x === 0) {
        return Number.POSITIVE_INFINITY;
    }
    // Special case: 2
    if (x === 2) {
        return Number.NEGATIVE_INFINITY;
    }
    // Special case: 1
    if (x === 1) {
        return 0;
    }
    if (x > 2 || x < 0) {
        throw new RangeError('invalid input argument. Input argument must be on the interval `[0,2]`. Value: `' + x + '`.');
    }
    // Argument reduction (reduce to interval [0,1]). If `x` is outside [0,1], we can take advantage of the complementary error function reflection formula: `erfc(-z) = 2 - erfc(z)`, by negating the result once finished.
    if (x > 1) {
        sign = true;
        q = 2 - x;
    }
    else {
        sign = false;
        q = x;
    }
    x = 1 - q;
    // x = 1-q <= 0.5
    if (x <= 0.5) {
        g = x * (x + 10);
        r = evalrational(x, P1, Q1);
        val = g * Y1 + g * r;
        return (sign) ? -val : val;
    }
    // q >= 0.25
    if (q >= 0.25) {
        g = Math.sqrt(-2.0 * Math.log(q));
        q -= 0.25;
        r = evalrational(q, P2, Q2);
        val = g / (Y2 + r);
        return (sign) ? -val : val;
    }
    q = Math.sqrt(-Math.log(q));
    // q < 3
    if (q < 3) {
        r = evalrational(q - 1.125, P3, Q3);
        val = (Y3 + r) * q;
        return (sign) ? -val : val;
    }
    // q < 6
    if (q < 6) {
        r = evalrational(q - 3.0, P4, Q4);
        val = (Y4 + r) * q;
        return (sign) ? -val : val;
    }
    // Note that the smallest number in JavaScript is 5e-324. Math.sqrt( -Math.log( 5e-324 ) ) ~27.2844
    // q < 18
    r = evalrational(q - 6.0, P5, Q5);
    val = (Y5 + r) * q;
    return (sign) ? -val : val;
}
// helper function
function evalrational(x, P, Q) {
    if (x === 0) {
        return P[0] / Q[0];
    }
    return polyval(x, P) / polyval(x, Q);
}
//# sourceMappingURL=main.js.map