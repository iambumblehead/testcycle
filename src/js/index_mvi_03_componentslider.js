// Filename: index_mvi_03_componentslider.js  
// Timestamp: 2016.02.01-14:19:10 (last modified)
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

function main(sources) {
  const props$ = Observable.of({
    label: 'Radius', unit: '', min: 20, initial: 50, max: 80
  });
  const childSources = {DOM: sources.DOM, props$};
  const labeledSlider = LabeledSlider(childSources);
  const childVTree$ = labeledSlider.DOM;
  const childValue$ = labeledSlider.value$;

  const vtree$ = childVTree$.withLatestFrom(childValue$,
    (childVTree, value) =>
      div([
        childVTree,
        div({style: {
          backgroundColor: '#58D3D8',
          width: String(value) + 'px',
          height: String(value) + 'px',
          borderRadius: String(value * 0.5) + 'px'
        }})
      ])
    );
  return {
    DOM: vtree$
  };

}

Cycle.run(main, {
  props$: () => Observable.of({
    label: 'Weight', unit: 'kg', min: 40, initial: 70, max: 140
  }),
  DOM: makeDOMDriver('#app')
});
