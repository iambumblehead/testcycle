// Filename: index_mvi_07_componentslider.js  
// Timestamp: 2016.02.01-15:08:35 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  
//
// uses @cycle/isolate

import Rx from 'rx';
import Cycle from '@cycle/core';
import isolate from '@cycle/isolate';
import {div, span, input, h2, makeDOMDriver, isolateDOMSource, isolateDOMSink} from '@cycle/dom';

//function isolate(Component, scope) {
//  return function IsolatedComponent(sources) {
//    const {isolateSource, isolateSink} = sources.DOM;
//    const isolatedDOMSource = isolateSource(sources.DOM, scope);
//    const sinks = Component({DOM: isolatedDOMSource});
//    const isolatedDOMSink = isolateSink(sinks.DOM, scope);
//    return {
//      DOM: isolatedDOMSink
//    };
//  };
//}


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
    //DOM: isolateDOMSource(sources.DOM, 'weight'),
    DOM: sources.DOM,
    props$: weightProps$
  };  
  const heightSources = {
    //DOM: isolateDOMSource(sources.DOM, 'height'),
    DOM: sources.DOM,
    props$: heightProps$
  };
  
  //const weightSlider = LabeledSlider(weightSources);
  //const heightSlider = LabeledSlider(heightSources);

  // isolate() takes a non-isolated component and restricts it to
  // the 'weight' scope, creating WeightSlider. The scope 'weight'
  // is used only in this line of code
  //const WeightSlider = isolate(LabeledSlider, 'weight');
  //const HeightSlider = isolate(LabeledSlider, 'height');
  const WeightSlider = isolate(LabeledSlider /* generate unique value locally */); 
  const HeightSlider = isolate(LabeledSlider);

  
  const weightSlider = WeightSlider(weightSources);
  const heightSlider = WeightSlider(heightSources);
  
  //const weightVTree$ = isolateDOMSink(weightSlider.DOM, 'weight');
  const weightVTree$ = weightSlider.DOM;
  const weightValue$ = weightSlider.value$;

  //const heightVTree$ = isolateDOMSink(heightSlider.DOM, 'height');
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
