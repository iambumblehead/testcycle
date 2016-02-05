
Cycle.js, Rx, ES6 Exploration

boiler-plate created from cyc, https://github.com/edge/cyc

 * [drivers][0]: Drivers are functions that listen to Observable sinks (their input), perform imperative side effects, and may return Observable sources (their output). Drivers are almost always associated with side effects.

The better solution to the problem solved by [isolate][1] may be use of data structure.

 * [reactive programming gist from staltz][3], Observable is Promise++. In Rx you can easily convert a Promise to an Observable by doing var stream = Rx.Observable.fromPromise(promise), so let's use that. The only difference is that Observables are not Promises/A+ compliant, but conceptually there is no clash. A Promise is simply an Observable with one single emitted value. Rx streams go beyond promises by allowing many returned values.
 * [guide to reactive programming][4]


[0]: http://cycle.js.org/drivers.html
[1]: https://github.com/cyclejs/isolate
[2]: https://netflix.github.io/falcor/starter/what-is-falcor.html
[3]: https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
[4]: https://xgrommx.github.io/rx-book/content/guidelines/index.html
