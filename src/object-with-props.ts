import { type Guard } from './shared.js';

export type ObjectWithPropsConfig<O> = {
	required?: {
		[K in keyof O]?: Guard<O[K]>;
	};

	optional?: {
		[K in keyof O as O[K] extends Required<O>[K] ? never : K]: Guard<O[K]>;
	};

	/**
	 * When `true`, every key in the object being tested must also be defined on`required` or `optional`.
	 */
	noExtraKeys?: boolean;
};

export type StrictObjectWithPropsConfig<O> = Omit<ObjectWithPropsConfig<O>, 'required'> &
	(Partial<O> extends O
		? {
				required?: {};
			}
		: {
				required: {
					[K in keyof O as O[K] extends Required<O>[K] ? K : never]: Guard<O[K]>;
				};
			});

export const createObjectWithPropsGuard = <O>(config: StrictObjectWithPropsConfig<O>): Guard<O> => {
	const requiredGuards = Object.entries(config.required ?? {}).filter(
		(entry) => typeof entry[1] === 'function',
	);
	const optionalGuards = Object.entries(config.optional ?? {}).filter(
		(entry) => typeof entry[1] === 'function',
	);
	const noExtraKeys = config.noExtraKeys;
	const validKeys =
		noExtraKeys === true
			? new Set<string>([
					...requiredGuards.map((entry) => entry[0]),
					...optionalGuards.map((entry) => entry[0]),
				])
			: undefined;

	const guard: Guard<O> = (input: unknown): input is O => {
		if (
			input === null ||
			typeof input !== 'object' ||
			(noExtraKeys === true && Object.keys(input).some((key) => !validKeys!.has(key))) ||
			requiredGuards.some(
				([key, guard]) => !(guard as Guard<O[keyof O]>)(input[key as keyof typeof input]),
			) ||
			optionalGuards.some(([key, guard]) => {
				const value = input[key as keyof typeof input];
				if (typeof value === 'undefined') {
					return false;
				}
				return !(guard as Guard<O[keyof O]>)(value);
			})
		) {
			return false;
		}

		return true;
	};

	return guard;
};

export const isObjectWithProps = <O>(
	input: unknown,
	config: StrictObjectWithPropsConfig<O>,
): input is O => createObjectWithPropsGuard<O>(config)(input);
