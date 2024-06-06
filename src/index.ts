import { createArrayAndEveryGuard, isArrayAndEvery } from './array-and-every';
import { createObjectWithPropsGuard, isObjectWithProps } from './object-with-props';
import { createInArrayGuard, createInSetGuard, isInArray, isInSet } from './primitive-subsets';
import {
	isArray,
	isBoolean,
	isFunction,
	isNonNullObject,
	isNotNull,
	isNotNullOrUndefined,
	isNotUndefined,
	isNull,
	isNullOrUndefined,
	isNumber,
	isObject,
	isString,
	isUndefined,
} from './primitives.js';

export type * from './shared.js';

export const createGuard = {
	objectWithProps: createObjectWithPropsGuard,
	arrayAndEvery: createArrayAndEveryGuard,
	inArray: createInArrayGuard,
	inSet: createInSetGuard,
};

export const is = {
	string: isString,

	number: isNumber,

	boolean: isBoolean,

	undefined: isUndefined,
	notUndefined: isNotUndefined,

	null: isNull,
	notNull: isNotNull,

	nullOrUndefined: isNullOrUndefined,
	notNullOrUndefined: isNotNullOrUndefined,

	object: isObject,
	nonNullObject: isNonNullObject,
	objectWithProps: isObjectWithProps,

	array: isArray,
	arrayAndEvery: isArrayAndEvery,

	function: isFunction,

	inArray: isInArray,
	inSet: isInSet,
};
