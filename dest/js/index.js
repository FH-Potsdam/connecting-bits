'use strict';

var a = { five: 'a', johnny: 'b' };
var five = a.five;

var giveMe = function giveMe(what) {
  return what;
};
console.log(giveMe(five));