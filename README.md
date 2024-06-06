# is-guard

A type-guard library that includes guards for primitive types, as well as functions for creating some more complex guards.

## Usage

```ts
import { is, createGuard } from '@zisiszak/is-guard';

type DesiredType = {
    a: boolean;
    b: null;
    c?: string;
};

const validObject = {
    a: false,
    b: null,
};
const invalidObject = {
    a: true,
    b: null,
    c: 'Hello There!',
    d: "I'm error-prone..."
};


const isDesiredType = createGuard.objectWithProps<DesiredType>({
    // Note: `createGuard.objectWithProps` has its config argument set to type `StrictObjectWithPropsConfig` by default. This means any required props must be defined in the guard config. If looser typing is required, the `ObjectWithPropsConfig` type doesn't require any prop guards to be defined. Not recommended unless you know what you're doing.
    required: {
        a: is.boolean,
        b: is.null,
    },

    optional: {
        c: is.string,
    },

    //  Objects can optionally be guarded against when they include keys not defined in `required` and `optional`.
    noExtraKeys: true;
});

// `is` contains guard functions, and can be extended if desired.
is.string(validObject); /* false */
is.object(validObject); /* true */

// Composing a new typeguard function using `createGuard.objectWithProps` is better suited for most cases.
is.objectWithProps(validObject, {
    // ...same config as the composed guard above
}); /* true */

isDesiredType(invalidObject); /* false */


```
