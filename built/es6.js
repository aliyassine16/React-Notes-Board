"use strict";

//testing babel transformer
var evens = [2, 4, 6, 8, 10];
var odds = evens.map(function (v) {
  return v + 1;
});
var nums = evens.map(function (v, i) {
  return v + i;
});