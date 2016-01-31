// Filename: index.js  
// Timestamp: 2016.01.30-22:37:57 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

import fs from 'fs';
import express from 'express';
import jade from 'jade';

// Error.stackTraceLimit = Infinity;

const log = ::console.log;

const production = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

const app = express();
const router = express.Router();

const template = jade.compileFile('./src/html/index.jade');

import { run } from '@cycle/core';
import { makeHTMLDriver } from '@cycle/dom';


if (production) {
  log('[pro]');
  app.use(require('compression')());
} else {
  log('[dev]');
  // use dev compilation and hot reloading
  const config = require('./dev.babel').default,
	compiler = require('webpack')(config),
	dev = require('webpack-dev-middleware'),
	hot = require('webpack-hot-middleware');

  app.use(dev(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  })).use(hot(compiler));
}

// get absolute path of mvi file, necessary for hot rebuild
const mvisrc = require.resolve('./src/js/mvi');
let mvi = require(mvisrc).default;

if (!production) {
  // register mvi file with hot rebuilder
  require('./hot').default({
    [mvisrc]: next => { mvi = next; }
  });
}

// Cycle.run main function, create mock DOM driver
const main = ({ DOM }) => ({ DOM: mvi(DOM) });
const DOM = makeHTMLDriver();

router.get('/checkbox', (req, res, next) => {
  run(main, { DOM }).sources.DOM.forEach(ssr => {
    fs.readFile('./src/html/index.html', 'utf-8', function (err, content) {
      res.end(content);
    });
  }, next);
});

router.get('/http', (req, res, next) => {
  run(main, { DOM }).sources.DOM.forEach(ssr => {
    fs.readFile('./src/html/index.html', 'utf-8', function (err, content) {
      res.end(content);
    });
  }, next);
});

router.get('/', (req, res, next) => {
  run(main, { DOM }).sources.DOM.forEach(ssr => {
    console.log('ssr is', ssr);
    console.log('DOM is', DOM);      
    res.end(template({ ssr }));
  }, next);
});

app.use(router).use(express.static('./public'));

app.listen(port, 'localhost', err => {
  if (err) {
    return console.err(err);
  }
  log(`listening on http://localhost:${ port }`);
});
