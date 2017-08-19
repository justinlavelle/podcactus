'use strict';

const freqLowLimit = 20.0;
const freqHighLimit = 20000.0;

export default getEqBands = function(nBands) {
    'use strict';
    const fratio = Math.pow(freqLowLimit / freqHighLimit, 1.0 / nBands);

    let bands = [],
        b,
        flast,
        fcurr = freqLowLimit;

    for (b = 0; b < nBands; b++) {
        flast = fcurr;
        fcurr /= fratio;
        bands.push(flast + ((fcurr - flast) / 2.0));
    }

    return bands;
};
