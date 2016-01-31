// Filename: index.js  
// Timestamp: 2016.01.30-19:22:17 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import {makeDOMDriver, div, input, p} from '@cycle/dom';

// The imported Cycle object on the first line contains
// one important function: run(main, drivers), where main is
// the entry point for our whole application, and drivers is
// a record of driver functions labeled by some name.


// We have filled the main() function with some code:
// returns an object which has an RxJS Observable defined
// under the name DOM. This indicates main() is sending the
// Observable as messages to the DOM driver. The Observable
// emits Virtual DOM <h1> elements displaying ${i} seconds
// elapsed changing over time every second, where ${i} is
// replaced by 0, 1, 2, etc.
function main() {
  return {
    DOM: Rx.Observable.interval(1000)
      .map(i => CycleDOM.h1('' + i + ' seconds elapsed'))
  };
}


// Function main() now takes drivers as input. Just like the
// output main() produces, the input drivers follow the same
// structure: an object containing DOM as a property.
// drivers.DOM is a queryable collection of Observables.
// Use drivers.DOM.select(selector).events(eventType) to get
// an Observable of eventType DOM events happening on the
// element(s) specified by selector. This main() function
// takes the Observable of clicks happening on input
// elements, and maps those toggling events to Virtual DOM
// elements displaying a togglable checkbox.
function main(drivers) {
  return {
    DOM: drivers.DOM.select('input').events('click')
      .map(ev => ev.target.checked)
      .startWith(false)
      .map(toggled =>
        div([
          input({type: 'checkbox'}), 'Toggle me',
          p(toggled ? 'ON' : 'off')
        ])
      )
  };
}


const drivers = {
  // makeDOMDriver(container) from Cycle DOM returns a
  // driver function to interact with the DOM. This function
  // is registered under the key DOM in the drivers object
  // above.
  DOM: CycleDOM.makeDOMDriver('#app')
};

Cycle.run(main, drivers);


