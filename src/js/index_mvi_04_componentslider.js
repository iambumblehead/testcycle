// Filename: index_mvi_03_componentslider.js  
// Timestamp: 2016.02.01-14:24:44 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import Rx from 'rx';
import Cycle from '@cycle/core';
import {div, span, input, h2, makeDOMDriver} from '@cycle/dom';

const {Observable} = Rx;

// labeledslider is constructed as though it is a main program
function LabeledSlider(sources) {
  const initialValue$ = sources.props$
    .map(props => props.initial)
    .first();

  const newValue$ = sources.DOM
    .select('.slider')
    .events('input')
    .map(ev => ev.target.value);

  const value$ = initialValue$.concat(newValue$);

  const vtree$ = Observable.combineLatest(sources.props$, value$,
    (props, value) =>
      div('.labeled-slider', [
        span('.label',
          props.label + ' ' + value + props.unit
        ),
        input('.slider', {
          type: 'range', min: props.min, max: props.max, value: value
        })
      ])
  );

  // value$ observable as sink
  // value$ must be observable to parent for using numeric values
  // 
  const sinks = {
    DOM: vtree$,
    value$: value$
  };
  
  return sinks;
}

// naive approach calls labeledSlider twice, once with props for weight and
// again with props for height
function main(sources) {
  const weightProps$ = Observable.of({
    label: 'Weight', unit: 'kg', min: 40, initial: 70, max: 150
  });
  const heightProps$ = Observable.of({
    label: 'Height', unit: 'cm', min: 140, initial: 170, max: 210
  });

  const weightSources = {DOM: sources.DOM, props$: weightProps$};
  const heightSources = {DOM: sources.DOM, props$: heightProps$};

  const weightSlider = LabeledSlider(weightSources);
  const heightSlider = LabeledSlider(heightSources);

  const weightVTree$ = weightSlider.DOM;
  const weightValue$ = weightSlider.value$;

  const heightVTree$ = heightSlider.DOM;
  const heightValue$ = heightSlider.value$;

  const bmi$ = Observable.combineLatest(weightValue$, heightValue$,
    (weight, height) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters));
      return bmi;
    }
  );

  return {
    DOM: bmi$.combineLatest(weightVTree$, heightVTree$,
      (bmi, weightVTree, heightVTree) =>
        div([
          weightVTree,
          heightVTree,
          h2('BMI is ' + bmi)
        ])
      )
  };
}

Cycle.run(main, {
  props$: () => Observable.of({
    label: 'Weight', unit: 'kg', min: 40, initial: 70, max: 140
  }),
  DOM: makeDOMDriver('#app')
});
