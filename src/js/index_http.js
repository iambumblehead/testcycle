// Filename: index_http.js  
// Timestamp: 2016.01.30-23:01:25 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import Cycle from '@cycle/core';
import {div, button, h1, h4, a, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

// all sources are exposed through main here

function main(sources) {
  const USERS_URL = 'http://jsonplaceholder.typicode.com/users/';

  // clicking get random sends signal returning stream
  // mapping a return value to the http driver
  const getRandomUser$ = sources.DOM.select('.get-random').events('click')
    .map(() => {
      const randomNum = Math.round(Math.random()*9)+1;
      return {
        url: USERS_URL + String(randomNum),
        method: 'GET'
      };
    });

  // subscribes to sources.http stream to get http signal
  // returns body of response, starts with 'null'
  const user$ = sources.HTTP
    .filter(res$ => res$.request.url.indexOf(USERS_URL) === 0)
    .mergeAll()
    .map(res => res.body)
    .startWith(null);

  // subscribes to user stream. returns vtree of user data
  const vtree$ = user$.map(user =>
    div('.users', [
      button('.get-random', 'Get random user'),
      user === null ? null : div('.user-details', [
        h1('.user-name', user.name),
        h4('.user-email', user.email),
        a('.user-website', {href: user.website}, user.website)
      ])
    ])
  );

  // http://cycle.js.org/drivers.html
  const sinks = {
    DOM: vtree$,
    HTTP: getRandomUser$
  };
  return sinks;
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
});
