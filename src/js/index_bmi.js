// Filename: index_bmi.js  
// Timestamp: 2016.01.30-23:31:27 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

const {div, input, h2, makeDOMDriver} = CycleDOM;

function main({DOM}) {
  const changeWeight$ = DOM.select('#weight')
    .events('input')
    .map(ev => ev.target.value);
  const changeHeight$ = DOM.select('#height')
    .events('input')
    .map(ev => ev.target.value);
  const state$ = Rx.Observable.combineLatest(
    changeWeight$.startWith(70),
    changeHeight$.startWith(170),
    (weight, height) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters));
      return {weight, height, bmi};
    }
  );

  return {
    DOM: state$.map(({weight, height, bmi}) =>
      div([
        div([
          'Weight ' + weight + 'kg',
          input('#weight', {type: 'range', min: 40, max: 140, value: weight})
        ]),
        div([
          'Height ' + height + 'cm',
          input('#height', {type: 'range', min: 140, max: 210, value: height})
        ]),
        h2('BMI is ' + bmi)
      ])
    )
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
});
