// Filename: index_demo_checkbox.js  
// Timestamp: 2016.01.30-22:00:05 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import Rx from 'rx';
import Cycle from '@cycle/core';
import {div, input, p, makeDOMDriver} from '@cycle/dom';

// Sinks are instructions from main() to drivers to perform
// side effects, and sources are readable side effects.
// HTTP requests are sinks, and HTTP responses are sources.
function main(sources) {
  const sinks = {
    // DOM: Rx.Observable.just(false).map(
    DOM: sources.DOM.select('input').events('change')
      .map(ev => ev.target.checked)
      .startWith(false).map(
        toggled =>
          div([
            input({type: 'checkbox'}), 'Toggle me',
            p(toggled ? 'ON' : 'off')
          ])
      )
  };
  
  return sinks;
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
});
