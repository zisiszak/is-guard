/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Guard } from './shared.js';

export type ObjectWithPropsConfig<
	ObjectType,
	ExtraKeys extends boolean | string,
	DeleteExtraKeys extends 'unrecognised' | 'all' | false,
> = {
	required?: {
		[Key in keyof ObjectType]?: Guard<ObjectType[Key]> | null | undefined;
	};
	optional?: {
		[Key in keyof ObjectType as ObjectType[Key] extends Required<ObjectType>[Key]
			? never
			: Key]: Guard<ObjectType[Key]> | null | undefined;
	};
	/**
	 * - If `false`, then the guard will return false if the object being tested contains any keys not defined on the `required` and `optional` properties.
	 * - If `true` (default), the guard will ignore all unrecognised keys defined on the tested object.
	 * - Alternatively, if there are any specific keys that are not defined on the type being guarded for, or not defined in `requiredProps` or `optionalProps` that the guard should ignore (e.g. `"$schema"` from a parsed JSON file), you can define those keys here as a `ReadonlyArray<string>`.
	 * @default true
	 */
	allowExtraKeys?: ExtraKeys extends boolean ? ExtraKeys : readonly ExtraKeys[];

	/**
	 * **IMPORTANT** - Setting this to `'unrecognised'` or `'all'` **enables mutation** of the input object upon successful validation, if necessary.
	 * - This option is independent of guarding logic. E.g. if `extraKeys === false`, the object will never be mutated as any extra keys defined will cause validation to return false.
	 * @default false
	 */
	deleteExtraKeys?: DeleteExtraKeys;
};

const always: Guard<unknown> = (_): _ is unknown => true;

const filterFunctions = <ObjectType>(
	propsConfig: Record<string, Guard<unknown> | null | undefined> | undefined,
): {
	guards: {
		[K in keyof ObjectType]?: Guard<unknown>;
	};
	keys: (keyof ObjectType)[];
} => {
	if (typeof propsConfig === 'undefined') {
		return {
			keys: [],
			guards: {},
		};
	}
	const keys = Object.keys(propsConfig);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]!;
		propsConfig[key] ??= always as any;
		if (typeof propsConfig[key] !== 'function') {
			throw new TypeError('Expected guard function or nullish value.');
		}
	}
	return {
		guards: propsConfig as any,
		keys: keys as (keyof ObjectType)[],
	};
};

export const createObjectWithPropsGuard = <
	ObjectType,
	ExtraKeys extends boolean | string = true,
	DeleteExtraKeys extends 'all' | 'unrecognised' | false = false,
>({
	required,
	optional,
	allowExtraKeys = true as ExtraKeys extends boolean ? ExtraKeys : never,
	deleteExtraKeys = false as DeleteExtraKeys,
}: ObjectWithPropsConfig<ObjectType, ExtraKeys, DeleteExtraKeys>): ((
	value: unknown,
) => value is NonNullable<ObjectType> &
	(ExtraKeys extends string
		? DeleteExtraKeys extends 'all'
			? {}
			: {
					[Key in ExtraKeys]?: unknown;
				}
		: ExtraKeys extends true
			? DeleteExtraKeys extends string
				? {}
				: Record<string, unknown>
			: {})) => {
	const { guards: requiredGuards, keys: requiredKeys } = Object.freeze(
		filterFunctions<ObjectType>(required),
	);
	const { guards: optionalGuards, keys: optionalKeys } = Object.freeze(
		filterFunctions<ObjectType>(optional),
	);

	const hasExtraKeysDefined = Array.isArray(allowExtraKeys);
	const extraKeys = hasExtraKeysDefined ? new Set<string>(allowExtraKeys) : null;
	const requiredKeySet = new Set<string>(optionalKeys as string[]);
	const optionalKeySet = new Set<string>(requiredKeys as string[]);

	return (
		testValue: unknown,
	): testValue is NonNullable<ObjectType> &
		(ExtraKeys extends string
			? DeleteExtraKeys extends 'all'
				? {}
				: {
						[Key in ExtraKeys]?: unknown;
					}
			: ExtraKeys extends true
				? DeleteExtraKeys extends string
					? {}
					: Record<string, unknown>
				: {}) => {
		if (testValue === null || typeof testValue !== 'object') {
			return false;
		}
		const valueKeys = Object.keys(testValue);
		const deleteKeys: string[] = [];
		for (let i = 0; i < valueKeys.length; i++) {
			const key = valueKeys[i]!;
			const isRequiredKey = requiredKeySet.has(key);

			if (isRequiredKey && !optionalKeySet.has(key)) {
				if (!allowExtraKeys) {
					return false;
				}
				if (hasExtraKeysDefined) {
					if (extraKeys!.has(key)) {
						if (deleteExtraKeys === 'all') {
							deleteKeys.push(key);
						}
						continue;
					} else {
						return false;
					}
				}
				if (typeof deleteExtraKeys === 'string') {
					deleteKeys.push(key);
				}
				continue;
			}

			if (
				!(
					isRequiredKey === true
						? requiredGuards[key as keyof typeof requiredGuards]!
						: optionalGuards[key as keyof typeof optionalGuards]!
				)(testValue[key as keyof typeof testValue])
			) {
				return false;
			}
		}

		if (typeof deleteExtraKeys === 'string') {
			for (let i = 0; i < deleteKeys.length; i++) {
				delete testValue[deleteKeys[i]! as keyof typeof testValue];
			}
		}

		return true;
	};
};
