// Filename: index_cyc.js  
// Timestamp: 2016.01.30-22:01:34 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import { run } from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import mvi from './mvi';

run(({ DOM }) => ({
  DOM: mvi(DOM).skip(1)
}), {
  DOM: makeDOMDriver('#app')
});
