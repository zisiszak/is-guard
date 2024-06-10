import { type ExclusionGuard, type Guard } from './shared.js';

export const isString: Guard<string> = (value: unknown): value is string =>
	typeof value === 'string';

export const isNumber: Guard<number> = (value: unknown): value is number =>
	typeof value === 'number';

export const isBoolean: Guard<boolean> = (value: unknown): value is boolean =>
	typeof value === 'boolean';

export const isUndefined: Guard<undefined> = (value: unknown): value is undefined =>
	typeof value === 'undefined';
export const isNotUndefined: ExclusionGuard<undefined> = <Type>(
	value: Type | undefined,
): value is Type => typeof value !== undefined;

export const isNull: Guard<null> = (value: unknown): value is null => value === null;
export const isNotNull: ExclusionGuard<null> = <Type>(value: Type | null): value is Type =>
	value !== null;

export const isNullOrUndefined: Guard<null | undefined> = (
	value: unknown,
): value is null | undefined => typeof value === 'undefined' || value === null;
export const isNotNullOrUndefined: ExclusionGuard<null | undefined> = <Type>(
	value: Type | null | undefined,
): value is Type => value !== null && typeof value !== undefined;

export const isObject: Guard<object | null> = (value: unknown): value is object | null =>
	typeof value === 'object';
export const isNonNullObject: Guard<object> = (value: unknown): value is object =>
	value !== null && typeof value === 'object';

export const isArray: Guard<unknown[]> = Array.isArray;

export const isFunction: Guard<(...args: unknown[]) => unknown> = (
	value: unknown,
): value is (...args: unknown[]) => unknown => typeof value === 'function';
