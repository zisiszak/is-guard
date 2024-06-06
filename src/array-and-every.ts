import type { Guard } from './shared';

/**
 * Returns a typeguard that can be reused.
 *
 * @param guard - typeguard to check each element of the array
 * @returns a typeguard that checks if the value is an array of the given type
 */
export const createArrayAndEveryGuard =
	<T>(guard: Guard<T>): Guard<T[]> =>
	(value: unknown): value is T[] =>
		Array.isArray(value) && value.every(guard);

export const isArrayAndEvery = <T>(value: unknown, guard: Guard<T>): value is T[] =>
	Array.isArray(value) && value.every(guard);
