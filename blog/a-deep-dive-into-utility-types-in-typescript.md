---
title: A Deep Dive into Utility Types in TypeScript
date: 2022-05-22
cover: https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/A%20Deep%20Dive%20into%20Utility%20Types%20in%20TypeScript%20Cover%20Image_gideonidoko.com_43aca7d21a.jpg?alt=media&token=3d682571-7ebd-4329-ae25-5e26c6c11543
description: Utility types are helper generic types that can be used to create new types. Basically, utility types take other types as parameters and transform them into new types. TypeScript has some built-in utility types which we are going to discuss in this article.
tags: [typescript, utility]
---

Typescript is a typed superset of JavaScript that offers optional static typing — a powerful feature that ensures a variable doesn't change its type once declared. Utility types are helper generic types that can be used to create new types. Basically, utility types take other types as parameters and transform them into new types. 

TypeScript has some built-in utility types which we are going to discuss in this article. Clearly defined examples are provided in this article.  [Typescript's Playground](https://www.typescriptlang.org/play/) is one good place to run the example code.

## Prerequisites
- Basic understanding of TypeScript.
- A smile on your face ;)

## Generics

All utility types discussed in this article use generics so let's briefly talk about it. 

Other languages like Java, C#, Rust, and so on, use generics as the building block for creating reusable components that can work with diverse data types. This concept of generics is also the same for TypeScript. These reusable components could be functions, classes, or interfaces.

To show how generics work, let's define a simple function that takes in an array of numbers as an argument and returns a copy of that array. 

```typescript
function copyArr(arr: number[]): number[] {
    return [...arr];
}
const numArr = [1, 2, 3]; // array of numbers
const strArr = ['1', '2', '3']; // array of strings

const copiedNumArr = copyArr(numArr); // [1, 2, 3]
const copiedStrArr = copyArr(strArr); // Argument of type 'string[]' is not
// assignable to parameter of type 'number[]'.
```

The function defined above, though reusable, can only take in an array of strings as an argument and flags an error when passed an array of strings. What if we want to use the function to copy an array of other TypeScript types? this is where _generics_ come into play.

Let's rewrite the function to use generics:

```typescript
function copyArr<T>(arr: T[]): T[] { // T means Type (it could be anything)
    return [...arr];
}

const numArr = [1, 2, 3]; // array of numbers
const strArr = ['1', '2', '3']; // array of strings

const copiedStrArr = copyArr<string>(strArr); // ['1', '2', '3']
const copiedNumArr = copyArr<number>(numArr); // [1, 2, 3]
```

Now, whatever type () we pass as the generic type parameter will be the valid type of the argument and return value.

## Built-in Utility Types

Let's explore the available built-in types in TypeScript

### 1. Readonly{'<'}T{'>'}

The `Readonly<T>` utility type takes in an object type `T` as an argument and creates a new type with all of its properties set to `readonly` — the properties cannot be reassigned. Consider the below example:

```typescript
type Person = {
    name: string;
    age: number;
}

const person1: Readonly<Person> = {
    name: 'John Doe',
    age: 25
};

person1.name = 'Jack Doe'; // ❌ Cannot assign to 'name' because it is a read-only property.
```

Here `person1` has a type that has all properties of type `Person` but with all the properties set to `readonly`. That's why TypeScript flags an error when we tried to change the name property of `person1` to something else.

This is what the `person1` has a type that looks like:

```typescript
type Person = {
    readonly name: string; // the readonly keyword makes a property to not be alterable
    readonly age: number;
}
```

### 2. Required{'<'}T{'>'}

The `Required<T>` utility type takes in an object type `T` as an argument and creates a new type with all of its properties set to required — meaning that all the properties must be defined with appropriate corresponding values.

```typescript
type Person = {
    name?: string;
    age?: number;
}

const person1: Required<Person{'>'} = { // ❌ Property 'age' is missing in type '{ name: string; }' 
    // but required in type 'Required<Person>'.
    name: 'John Doe'
};
```

Here `person1` has a type that has all properties of type `Person` but with all the properties set to _required_ as opposed to the optional properties that the `Person` type has. A typescript error is flagged because the `age` property wasn't defined in the object `person1`.

### 3. Partial{'<'}T{'>'}

The `Partial<T>` utility type is a direct opposite of the `Required<T>` utility type, in that, it takes in an object type `T` as an argument and creates a new type with all of its properties set to optional — meaning any or all of the properties can be defined.

```typescript
type Person = {
    name: string;
    age: number;
}

const person1: Partial<Person> = {
    name: 'John Doe'
};
```

Here, the `person1` object has a reconstructed `Person` type (thanks to partial) that looks like so:

```typescript
type Person = {
    name?: string;
    age?: number;
}
```

### 4. Pick{'<'}T, K{'>'}

The `Pick<T, K>` utility type takes in 2 parameters, an object type `T` as the first argument and keys `K` as the second argument. Keys `K` must be a property or a union of the properties of `T`. Any object with the new type from `Pick<T, K>` must only have as its properties, the values defined in `K` which are all properties of `T`.

Consider the below example: 

```typescript
type Person = {
    name: string;
    age: number;
};

const person1: Pick<Person, 'name' | 'age'> = { // ✔
    name: 'Jack Doe',
    age: 30,
};

const person2: Pick<Person, 'age'> = { // ✔
    age: 25
};

const person3: Pick<Person, 'age'> = { // ❌
    name: 'John Doe', // ~ Object literal may only specify known properties, and 'name' does not exist in type 'Pick<Person, "age">'.
    age: 27
};
```

TypeScript flagged an error in Object `person3` above because, by the definition of the utility type, it should only have a single property — `age`.

### 5.  Omit{'<'}T, K{'>'}

The `Omit<T, K>` utility type is just like `Pick<T, K>`, it takes in 2 parameters, an object type `T` as the first argument and keys `K` as the second argument but `K` only specifies a property or a set of properties that must be omitted in the new type. That means any object with the new type from `Omit<T, K>` must have all the properties of type `T` excluding the ones defined in  keys `K`,

NB: If all properties of type `T` are omitted i.e. defined in keys `K`, any object that takes the new type from `Omit<T, K>` will be able to have any or all properties of type `T`.

Consider the below example:

```typescript
type Person = {
    name: string;
    age: number;
    height: number;
};

const person1: Omit<Person, 'age'> = { // ✔
    name: 'John Doe',
    height: 233,
};

const person2: Omit<Person, 'name' | 'age'> = { 
    age: 30, // ❌ Object literal may only specify known properties, and 'age'
    // does not exist in type 'Omit<Person, "age" | "name">'.
    height: 200,
};

const person3: Omit<Person, 'name' | 'age' | 'height'> = { // ✔
    name: 'Jack Doe',
};
```

TypeScript flagged an error in object `person2` because by the definition of key K, the properties, `name`, and `age`,  have been omitted and should not exist as properties of `person3`. 

**NB**: No errors are flagged in object `person3` because all the properties of object type `T` are omitted hence, `person3` can have any property. It's best practice not to omit all properties of `T`

### 6. Record{'<'}K, T{'>'}

The `Record<K, T>` utility type takes in 2 parameters, a union of keys `K` as the first argument and an object type `T` as the second argument. The union of keys `K` defines the only properties the new type will have while type `T` defines the type that each of the properties should have.

Consider the below example:

```typescript
type Person = {
    name: string;
    age: number;
};

const group1: Record<'person1' | 'person2', Person> = { 
    person1: {
        name: 'John Doe',
        age: 25
    },
    person2: { // ✔
        name: 'Jack Doe',
        age: 27,
    },
};

const group2: Record<'person1', Person> = { 
    person1: {
        name: 'John Doe',
        age: 25
    },
    person2: { // ❌ Object literal may only specify known properties, but
        // 'person2' does not exist in type 'Record<"person1", Person>'
        name: 'Jack Doe',
        age: 27,
    },
};
```

Object `group1` has the union of keys `K` defined as its only properties making it valid. TypeScript flagged an error in the object `group2` because it should only have one property (`person1`) by the definition of keys `K`.

### 7. NonNullable{'<'}T{'>'}

The `NonNullable<T>` utility type takes in a single argument, type `T`, and creates a new type that excludes all `null` and `undefined` from `T`.

```typescript
type StringOrNull = string | null;

type Person = {
    name: StringOrNull; // can be string or null value
    age: number;
}

type AnotherPerson = {
    name: NonNullable<StringOrNull>, // can only be string value
    age: number
}

const person1: Person = { 
    name: null,
    age: 24 // ✔
};

const person2: AnotherPerson = { 
    name: null, // ❌ Type 'null' is not assignable to type 'string'.
    age: 24
};
```

An error is flagged in object `person2` because the `name` property has been forced by `NonNullable<T>` to have only string values.

### 8. Extract{'<'}T, U{'>'}

The `Extract<T, K>` utility type takes in 2 parameters, a union type `T` as the first argument and a  union type `U` as the second argument, and creates a new union type with union members that exist in both `T` and  `U`.

So, this utility type logically gets the intersection of both union types😄

Consider the below example:

```typescript
type GenderVarieties = 'male' | 'female' | 'man' | 'woman' | 'boy' | 'girl';
type Sex = 'male' | 'female' | 'nil';

type Person = {
    name: string;
    age: number;
    sex: GenderVarieties; //asignable to male, female, man, woman, boy or girl
}

type AnotherPerson = {
    name: string;
    age: number;
    sex: Extract<GenderVarieties, Sex>; // assignable to male or female only
}

const person1: Person = { 
    name: 'John Doe',
    age: 25,
    sex: 'man', // ✔
}

const person2: AnotherPerson = {
    name: 'Jack Doe',
    age: 30,
    sex: 'man', // ❌ Type '"man"' is not assignable to type '"male" | "female"'.
}
```

An error is flagged in object `person2` because by definition of the `AnotherPerson` type, its `sex` property should only have _male_ or _female_ values (types) which exist in both the `GenderVarieties` and `Sex` union types.

### 9. Exclude{'<'}T, EU{'>'}

The `Exclude<T, EU>` utility type takes in 2 parameters, a union type `T` as the first argument and a  union type `EU` as the second argument, and creates a new union type with union members that exist in `T` and not in `EU`.

Let's use the previous example to show this.

```typescript
type GenderVarieties = 'male' | 'female' | 'man' | 'woman' | 'boy' | 'girl';
type Sex = 'male' | 'female' | 'non';

type Person = {
    name: string;
    age: number;
    sex: GenderVarieties;  //asignable to male, female, man, woman, boy or girl
}

type AnotherPerson = {
    name: string;
    age: number;
    sex: Exclude<GenderVarieties, Sex>; // assignable to man, woman, boy, or girl
}

const person1: Person = { // ✔
    name: 'John Doe',
    age: 25,
    sex: 'man',
}

const person2: AnotherPerson = { // ❌
    name: 'Jack Doe',
    age: 30,
    sex: 'male', // Type '"male"' is not assignable to type '"man" | "woman" | "boy" | "girl"'.
}
```

An error is flagged in object `person2` because by definition of the `AnotherPerson` type, its `sex` property should only have _man_, _woman_, _boy_, or _girl_ values (types) which exist in union type `GenderVarieties` and not in union type `Sex`.

### 10. ReturnType{'<'}T{'>'}

The `ReturnType<T>` utility type takes in a _function_ type `T` as an argument and returns the type of the return value of the function.

Consider the below:

```typescript
const getPerson = (name: string, age: number) => ({ name, age });

type Person = ReturnType<typeof getPerson>;
/*
type of Person = {
    name: string;
    age: number;
   }
*/

const person1: Person = getPerson('Jack Doe', 25); // ✔

const person2: Person = { // ✔
    name: 'Jack Doe',
    age: 30,
};
```

The type `Person` is derived from the object return type of the `getPerson` function.

### 11. Parameters{'<'}T{'>'}

The `Parameters<T>` utility type takes in a function type `T` as an argument and creates a tuple type that consists of all the types of the parameters in the function.  A tuple helps to store a collection of values of various types.

```typescript
const getPerson = (name: string, age: number) => ({ name, age });

type Person = ReturnType<typeof getPerson>;

type PersonParam = Parameters<typeof getPerson>;
// type of PersonParam = [name: string, age: number]

const person1Param: PersonParam = ['Jack Doe', 30];
// type of person1Param = [name: string, age: number] (valid tuple type)

const person2Param = ['John Doe', 25];
// type of person2Param = (string | number)[] (an array type and not a tuple type)

const person1: Person = getPerson(...person1Param); // ✔

const person2: Person = getPerson(...person2Param); // ❌ ~ A spread argument 
// must either have a tuple type or be passed to a rest parameter.
```

Here, the tuple type `PersonParam` is derived from `Parameters<typeof getPerson>`.  An error is flagged in the `person2` object because `person2Param` (an array type instead of tuple type) was spread as its argument.

### 12. ConstructorParameters{'<'}T{'>'}

The `ConstructorParameters<T>` utility type takes in a _constructor_ function type `T` as an argument and creates a tuple type that consists of all the types of the parameters in the function. There are a couple of constructor function types in TypeScript such as ErrorConstructor `(typeof Error)`,  ProxyConstructor `(typeof Proxy)` etc.

Consider the example:

```typescript
type errorConstructorParams = ConstructorParameters<ErrorConstructor>;
// type errorConstructorParams = [message?: string]

type numberConstructorParams = ConstructorParameters<NumberConstructor>;
// type numberConstructorParams = [value?: any]

type proxyConstructorParams = ConstructorParameters<ProxyConstructor>;
// type proxyConstructorParams = [target: object, handler: ProxyHandler<object>]

type promiseConstructorParams = ConstructorParameters<typeof Promise>;
// type promiseConstructorParams = [executor: (resolve: (value: unknown) => void, reject: (reason?: any) => void) => void]

type regexpConstructorParams = ConstructorParameters<typeof RegExp>;
// type regexpConstructorParams = [pattern: string | RegExp, flags?: string]
```

All the types defined above are tuple types derived from their respective constructor function types.

NB: There are a lot of other constructor function types that are not in the above example.

### 13. InstanceType{'<'}T{'>'}

The `InstanceType<T>` utility type takes in a _constructor function_ type `T` as an argument and returns the type of its instance.

```typescript
class Person {
    name: string;
    age: number;
}

type PersonType = InstanceType<typeof Person>
// type PersonType = Person

const person1 = new Person();
// type of person1 is Person
```

`person1` is a valid instance because its type is `Person` which is the same as `PersonType`.

### 14. ThisParameterType{'<'}T{'>'}

The `ThisParameterType<T>` utility type takes in a function type `T` as an argument and returns the type of its [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) parameter.

Consider the below example:

```typescript
type Person = { 
    name: string; 
    age: number;
}

function getPerson(this: Person) {
    return this;
}
    
function getStringifiedPerson(person: ThisParameterType<typeof getPerson>): string {
    // type of person is Person
    return JSON.stringify(getPerson.apply(person), null, 4);
}

const person1 = {
    name: 'John Doe',
    age: 25,
};

const person2 = {
    name: 'Jack Doe'
};

const stringifiedPerson1 = getStringifiedPerson(person1); // ✔
const stringifiedPerson2 = getStringifiedPerson(person2); // ❌ Argument of type 
// '{ name: string; }' is not assignable to parameter of type '{ name: 
// string; age: number; }'.
```

The `person` parameter in the `getStringifiedPerson` function has a `Person` type. An error is flagged in `stringifiedPerson2` because the type of person2 is not a valid `Person` type which is required.

### 15. OmitThisParameter{'<'}T{'>'}

The `OmitThisParameter<T>` utility type takes in a function type `T` as an argument and creates a new function type without the [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) parameter from it.

Consider the example below:

```typescript
type Person = { 
    name: string; 
    age: number;
}

function getStringifiedPerson(this: Person): string {
    console.log('this => ', this);
    // type of person is Person
    return JSON.stringify(this, null, 4);
}

const person1 = {
    name: 'John Doe',
    age: 25,
};

const person2 = {
    name: 'Jack Doe',
    age: 30,
};

const stringifyPerson1: typeof getStringifiedPerson = getStringifiedPerson.bind(person1);

const stringifyPerson2: OmitThisParameter<typeof getStringifiedPerson> = getStringifiedPerson.bind(person2);

console.log(stringifyPerson1()); // ❌ The 'this' context of type 'void' is 
// not assignable to method's 'this' of type 'Person'.

console.log(stringifyPerson2()); // ✔
/**
{ 
    "name": "Jack Doe", 
    "age": 30 
} 
/*
```

`stringifyPerson1` has the _this_ parameter in its type definition hence the error flagged.

## Wrap Up

In this article, we looked at what utility types are, and an overview of generics, we then covered the 15 most-used built-in utility types with concrete examples.  Check out the links below to explore the others. 

Kindly note that you can also create your custom utility types to suit your application. You can also check out [ts-toolbelt](https://millsp.github.io/ts-toolbelt/index.html) —  a tool that provides more than 200 typescript utilities.

I hope you found this article helpful. If you did, kindly share to help other folks too.

Thanks for reading :)

## Resources

- [TypeScript utility types documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [ts-toolbelt - custom utilities](https://millsp.github.io/ts-toolbelt/index.html)


