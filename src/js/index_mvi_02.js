// Filename: index_mvi_01.js  
// Timestamp: 2016.02.01-13:22:53 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

 import Cycle from '@cycle/core';
 import {div, input, h2, makeDOMDriver} from '@cycle/dom';

//function renderWeightSlider(weight) {
//  return div([
//    'Weight ' + weight + 'kg',
//    input('#weight', {type: 'range', min: 40, max: 140, value: weight})
//  ]);
//}

//function renderHeightSlider(height) {
//  return div([
//    'Height ' + height + 'cm',
//    input('#height', {type: 'range', min: 140, max: 210, value: height})
//  ]);
//}
function renderSlider(label, value, unit, id, min, max) {
  return div([
    '' + label + ' ' + value + unit,
    input('#' + id, {type: 'range', min, max, value})
  ]);
}

function renderWeightSlider(weight) {
  return renderSlider('Weight', weight, 'kg', 'weight', 40, 140);
}

function renderHeightSlider(height) {
  return renderSlider('Height', height, 'cm', 'height', 140, 210);
}

function getSliderEvent(DOM, id) {
  return DOM.select('#' + id).events('input').map(ev => ev.target.value);
}

//function calculateBMI(weight, height) {
//  const heightMeters = height * 0.01;
//  return Math.round(weight / (heightMeters * heightMeters));
//}

//function intent(DOM) {
//  return {
//    changeWeight$: DOM.select('#weight').events('input')
//      .map(ev => ev.target.value),
//    changeHeight$: DOM.select('#height').events('input')
//      .map(ev => ev.target.value)
//  };
//}
function intent(DOM) {
  return {
    changeWeight$: getSliderEvent(DOM, 'weight'),
    changeHeight$: getSliderEvent(DOM, 'height')
  };
}


function model(actions) {
  //return Cycle.Rx.Observable.combineLatest(
  return Rx.Observable.combineLatest(
    actions.changeWeight$.startWith(70),
    actions.changeHeight$.startWith(170),
    (weight, height) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters));
      return {weight, height, bmi};
    }
    // ({weight, height, bmi: calculateBMI(weight, height)})
  );
}

// observe the statestream
function view(state$) {
  return state$.map(({weight, height, bmi}) => div([
    renderWeightSlider(weight),
    renderHeightSlider(height),
    h2('BMI is s' + bmi)
  ]));
}

// dom is pattern
//function main({DOM}) {
//  const actions = intent(DOM);
//  const state$ = model(actions);
//  return {
//    DOM: view(state$)
//  };
//}

function main({DOM}) {
  return {
    DOM: view(model(intent(DOM)))
  };
}

// * intent() function
//   Purpose: interpret DOM events as user’s intended actions
//   Input: DOM Driver source
//   Output: Action Observables
//
// * model() function
//   Purpose: manage state
//   Input: Action Observables
//   Output: state$ Observable
//
// * view() function
//   Purpose: visually represent state from the Model
//   Input: state$ Observable
//   Output: Observable of VTree as the DOM Driver sink

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
});
