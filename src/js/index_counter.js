// Filename: index_counter.js  
// Timestamp: 2016.01.30-23:24:40 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import Rx from 'rx';
import Cycle from '@cycle/core';
import {div, button, p, makeDOMDriver} from '@cycle/dom';

function main({DOM}) {

  // listens to DOM click events
  const action$ = Rx.Observable.merge(
    DOM.select('.decrement').events('click').map(ev => -1),
    DOM.select('.increment').events('click').map(ev => +1)
  );

  // count$ listens to action$
  const count$ = action$.startWith(0).scan((x,y) => x+y);

  // DOM listens to count$
  // shows decrement and increment buttons w/ count
  return {
    DOM: count$.map(count =>
      div([
        button('.decrement', 'Decrement'),
        button('.increment', 'Increment'),
        p('Counter: ' + count)
      ])
    )
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
});
