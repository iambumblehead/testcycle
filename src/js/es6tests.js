// Filename: es6tests.js  
// Timestamp: 2016.02.01-12:31:12 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>


// pattern matching function arguments
//
function test1 ({arg}) {
  console.log('arg is ', arg);
}
function test2 ({me}) {
  console.log('me is ', me);
}

test1({ me : 'too' }); // arg is undefined
test2({ me : 'too' }); // me is too
