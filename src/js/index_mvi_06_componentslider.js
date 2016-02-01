// Filename: index_mvi_06_componentslider.js  
// Timestamp: 2016.02.01-14:56:45 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>
//
// uses isolateDOM* as convenience function to apply uniqueness value to vnodes

import Rx from 'rx';
import Cycle from '@cycle/core';
import {div, span, input, h2, makeDOMDriver, isolateDOMSource, isolateDOMSink} from '@cycle/dom';

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

  // all .slider and .label elements accessible through any usage of labeled slider
  // dom components here updated through parent with added classname on vtree$ 
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

  const weightSources = {
    //DOM: sources.DOM.select('.weight'),
    DOM: isolateDOMSource(sources.DOM, 'weight'),
    props$: weightProps$
  };  
  const heightSources = {
    //DOM: sources.DOM.select('.height'),
    DOM: isolateDOMSource(sources.DOM, 'height'),
    props$: heightProps$
  };
  
  const weightSlider = LabeledSlider(weightSources);
  const heightSlider = LabeledSlider(heightSources);

  //const weightVTree$ = weightSlider.DOM.map(vtree => {
  //  vtree.properties.className += ' weight';
  //  return vtree;
  //});
  const weightVTree$ = isolateDOMSink(weightSlider.DOM, 'weight');
  const weightValue$ = weightSlider.value$;

  //const heightVTree$ = heightSlider.DOM.map(vtree => {
  //  vtree.properties.className += ' height';
  //  return vtree;
  //});
  const heightVTree$ = isolateDOMSink(heightSlider.DOM, 'height');
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
