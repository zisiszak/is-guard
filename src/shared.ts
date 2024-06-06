export type Guard<Type> = (value: unknown) => value is Type;
export type ExclusionGuard<ExcludeType> = <Type>(value: Type | ExcludeType) => value is Type;
export type IntersectionGuard<IntersectType> = <Type>(value: Type) => value is Type & IntersectType;
