import type { Guard } from './shared';

export const createInArrayGuard =
	<T>(array: readonly T[]): Guard<T> =>
	(input: unknown): input is T =>
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
		array.includes(input as any);
export const isInArray = <T>(input: unknown, array: T[]): input is T =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
	array.includes(input as any);

export const createInSetGuard = <T>(arrayOrSet: readonly T[] | Readonly<Set<T>>): Guard<T> => {
	const set = Array.isArray(arrayOrSet)
		? new Set<T>(arrayOrSet)
		: (arrayOrSet as Readonly<Set<T>>);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
	const guard: Guard<T> = (value: unknown): value is T => set.has(value as any);
	return guard;
};
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
export const isInSet = <T>(input: unknown, set: Set<T>): input is T => set.has(input as any);
