"use strict";

exports.__esModule = true;
exports.typeEquals = exports.type = exports.isSameType = exports.isNotSameType = void 0;
var _ramda = require("ramda");
// type :: Monad a => a -> String
var type = (0, _ramda.either)((0, _ramda.path)(['@@type']), (0, _ramda.path)(['constructor', '@@type']));

// typeEquals :: Monad a => String -> a -> Boolean
exports.type = type;
var typeEquals = (0, _ramda.curry)(function (typeIdent, monad) {
  return type(monad) === typeIdent;
});

// isSameType :: (Monad a, Monad b) => a -> b -> Boolean
exports.typeEquals = typeEquals;
var isSameType = (0, _ramda.curryN)(2, (0, _ramda.useWith)(_ramda.equals, [type, type]));

// isNotSameType :: (Monad a, Monad b) => a -> b -> Boolean
exports.isSameType = isSameType;
var isNotSameType = (0, _ramda.complement)(isSameType);
exports.isNotSameType = isNotSameType;