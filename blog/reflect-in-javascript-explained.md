---
title: "Reflect in JavaScript Explained!"
date: 2021-05-12
cover: https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/Reflect%20in%20JavaScript%20Explained_gideonidoko.com_a8e13b3e77.png?alt=media&token=e20118dc-2023-43c9-8b5e-f237a23fa0de
description: Reflect is a built-in global object that was introduced in ES6 and dedicated to allow for effective reflection - the ability of a program to manipulate properties and methods of objects at runtime.
tags: [javascript, reflect]
---

Reflect is a built-in global object that was introduced in ES6 and dedicated to allow for effective **reflection** - the ability of a program to manipulate properties and methods of objects at runtime. The `Reflect` object provides methods that have the ability to inspect, interact with, and manipulate object properties.

Unlike other global objects, Reflect is not a constructor nor a function, which means, it cannot be used with `new` and cannot be invoked. All properties and methods of the `Reflect` object are static like those of  `Math` and `JSON` objects.



## Why is Reflect Important?

- Reflect allows you to develop programs that are able to handle dynamic code.
- Prior to ES6 (_ECMAScript 2015_), only a few methods were available to help with reflection, Reflect wraps all the methods used to work with objects into a single object.
- The Reflect object makes it easy to interfere with the functionality of an existing object as some of its methods can mutate target objects. 
- Reflect is a go-to place for various meta-operations on objects like getting and setting the prototype of objects.



## Reflect Methods

I'll group the Reflect methods into **two (2)** categories: Mutating Reflect Methods and Non-Mutating Reflect Methods.

> **NB💡**: The `target` object (to be manipulated), is always passed to Reflect Methods as the first argument. Arrays and objects can be the `target` object since they are both `typeof` object. A `TypeError` exception is thrown if `target` object is a non-object except in the case of `apply` or `construct` methods where the `target` is a function. This will be explained later.
>
> For an object, `propertyKey` is the property of that object while for an array, `propertyKey` is the index of that array.

### Mutating Reflect Methods

These consist of methods that modify the `target` object, its value, or behavior. They include:

1. #### defineProperty()

   > Reflect.define(_target, propertyKey, attribute_)

   The `Reflect.defineProperty()` method defines a new property (with `propertyKey` as key and `attribute` as its descriptor) on the `target` object. It returns `true` if the `propertyKey` is successfully defined or `false` if otherwise.

   ```javascript
   const obj = {
       one: 1,
       two: 2
   }; // target object
   const arr = ['one', 'two']; // target object
   
   Reflect.defineProperty(obj, 'three', { value: 3 }) ? 
   console.log('property defined!') : 
   console.log('could not define the propery'); // property defined!
   Reflect.defineProperty(arr, 2, { value: 'three' });
   
   console.log(obj.three); // 3
   console.log(arr[2]); // three
   ```

   

2. #### deleteProperty()

   > Reflect.deleteProperty(_target, propertyKey_)

   The `Reflect.deleteProperty()` method deletes  `propertyKey` from the `target` object. It works like the [delete](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete) operator, but as a function. It returns `true` if `propertyKey` is successfully deleted or `false` if otherwise.

   ```javascript
   const obj = {
       one: 1,
       two: 2
   }; // target object
   const arr = ['one', 'two']; // target object
   
   Reflect.deleteProperty(obj, 'two') ?
   console.log("property deleted!") :
   console.log("could not delete property"); // property deleted!
   Reflect.deleteProperty(arr, 1);
   
   console.log(obj.two); // undefined
   console.log(arr[1]); // undefined
   console.log(obj); // { one: 1 }
   console.log(arr); // [ one, empty ]
   ```

   The length of an array remains the same after deletion because the `Reflect.deleteProperty` method, just like the `delete` operator, removes the value from the index and does not remove the index itself.

   

3. #### apply()

   > Reflect.apply(_target, thisArgument, argumentsList_)

   The `Reflect.apply()` method calls the `target` function with arguments specified by `argumentsList`, an array-like object.

   ```javascript
   const obj = {
       one: 1,
       two: 2
   }; // thisArguments
   const arr = ['one', 'two']; // argumentsList
   
   function func(a, b) {
       console.log(this); // { one: 1, two: 2 }
       console.log(a, b); // one two
       return a + ": " + this.one; // `this` references `obj`
   }
   
   console.log(Reflect.apply(func, obj, arr)); // one: 1
   console.log(Reflect.apply(Math.ceil, undefined, [1.75])); // 2
   ```

   The `Reflect.apply()` method is not really a mutating method as its `target` is a function. It works like the `Function.prototype.apply()`.

   > ⚠ If the `target` is not callable or `argumentsList` is `null` or `undefined`, `Reflect.apply()` would throw a `TypeError` although, `Function.prototype.apply()` would still call the function without any arguments.

   

4. #### construct()

   > Reflect.construct(_target, argumentsList[, newTarget]_)

   The `Reflect.construct()` method is used to construct an object from the `target` constructor function. It behaves like the `new` operator, but as a function. It is the same as called `new target(`_`...argumentsList`_`)`. The `argumentsList` (array-like object) specifies arguments and the `newTarget` (optional constructor function) specifies the constructor whose prototype should be used.

   ```javascript
   function Func(a, b) { this.name = a; } // a = "func"
   function JavaScript(a, b) { this.name = b; } // b = "javascript"
   
   const args = ["func", "javascript"];
   const obj1 = new Func(...args);
   const obj2 = Reflect.construct(Func, args, JavaScript);
   
   console.log(obj1.name); // "func"
   console.log(obj2.name); // "func"
   console.log(obj1 instanceof Func) // false
   console.log(obj2 instanceof Func) // false
   console.log(obj1 instanceof JavaScript) // true
   console.log(obj2 instanceof JavaScript) // true
   ```

   > ⚠ If  `target` or `newTarget` are not constructors, `Reflect.construct()` would throw a `TypeError`.

   

5. #### set()

   > Reflect.set(_target, propertyKey, value[, receiver]_)

   The `Reflect.set()` method sets the `propertyKey` of the `target` object with `value`. If a property with the name `propertyKey` already exists, its value will be updated otherwise a new property will be created with the name `propertyKey` and value `value`.

   If the `propertyKey` already exists, and it has a **setter** function, `receiver` (optional object) will be the `this` value inside the setter function.

   A boolean `true` is returned by the `Reflect.set()` method if the `propertyKey` was successfully set otherwise `false` is returned.

   ```javascript
   const obj = {
     one: 1,
     two: 2
   }; // target object
   const arr = ['one', 'two']; // target object
   
   // add a `_one` accessor property to `obj`
   Object.defineProperty(obj, '_one', {
     get: function () { return this.one },
     set: function (value) { this.one = ++value }
   })
   
   Reflect.set(obj, 'three', 3) ?
   console.log("property successfully set") :
   console.log("could not set property"); // "property successfully set"
   Reflect.set(arr, 1, '2'); // set arr index of 1 to '2'
   
   const receiver = {};
   Reflect.set(obj, '_one', 1, receiver);
   
   console.log(obj.three); // 3
   console.log(arr[1]); // 2
   console.log(obj); // { one: 1, two: 2, three: 3 }
   console.log(arr); // [ 'one', '2' ]
   console.log(receiver); // { one: 2 }
   ```

   

6. #### setPrototypeOf()

   > Reflect.setPrototypeOf(_target, prototype_)

   The `Reflect.setPrototypeOf()` method sets the prototype of the `target` object to `prototype` (object or null).  It returns `true` if the `prototype` was successfully set otherwise `false` is returned.

   ```javascript
   const obj1 = {}; // target object
   const obj2 = { two: 2 }; //target object
   const obj3 = { three: 3 } //target object
   
   Object.seal(obj3); //seal `obj3` to make it non-extensible
   
   console.log(Reflect.setPrototypeOf(obj1, { one: 1 })); // true
   console.log(Reflect.setPrototypeOf(obj2, null)); // true
   console.log(Reflect.setPrototypeOf(obj3, { three: 33})); // false
   console.log(obj1.one); // 1
   ```

   > ⚠ If the `prototype` is neither an object nor `null`, `Reflect.setPrototypeOf()` would throw a `TypeError`. If `target` object is non-extensible a boolean `false` would be returned.

   

7. #### preventExtensions()

   > Reflect.preventExtensions(_target_)

   The `Reflect.preventExtensions()` method is used to prevent new properties from being added to the `target` object i.e. the `target` object will be made non-extensible.

   ```javascript
   const obj = {
     one: 1,
     two: 2
   }; // target object
   const arr = ['one', 'two']; // target object
   
   Reflect.isExtensible(obj) ?
   console.log("successfully made object non-extensible") :
   console.log("could not make object non-extensible"); // "successfully made object non-extensible"
   Reflect.preventExtensions(arr);
   
   arr[2] = "three"; // this will not happen
   console.log(arr); // logs [ 'one', 'two' ] and not [ 'one', 'two', 'three' ]
   ```

   The `Reflect.preventExtensions()` method returns `true` if the `target` object is successfully made non-extensible otherwise it returns `false`. Once the `target` object is made non-extensible, no new properties can be added to it.

   

### Non-Mutating Reflect Methods

These methods do not modify the `target` object, its value, or behavior. They include:

1. #### get()

   > Reflect.get(_target, propertyKey[, receiver]_)

   The `Reflect.get()` method is used to get a property on an object. It returns the value of the `propertyKey` property in the `target`.  Normally, `this` references the `target` object but the `receiver` (optional) argument is used as `this`, if provided and if the property with the same name as `propertyKey` is a **getter** function in the `target`. 

   ```javascript
   const obj = {
       one: 1,
       two: 2
   }; // target object
   
   const arr = ['one', 'two']; // target object
   
   //define a getter property
   Object.defineProperty(obj, 'three', {
       get() {
           return this.one + this.two;
       }
   })
   
   console.log(Reflect.get(obj, 'one')); // 1
   console.log(Reflect.get(obj, 'three')); // 3
   console.log(Reflect.get(arr, 0)); // one
   console.log(Reflect.get(obj, 'three', {
       one: 11,
       two: 22
   })); // 33
   ```

   

2. #### getOwnPropertyDescriptor()

   > Reflect.getOwnPropertyDescriptor(_target, propertyKey_)

   The `Reflect.getOwnPropertyDescriptor()` method returns a [property descriptor](https://medium.com/jspoint/a-quick-introduction-to-the-property-descriptor-of-the-javascript-objects-5093c37d079) object that describes the `propertyKey` of the `target` object , if found or `undefined` if not. 

   ```javascript
   const obj = {
       one: 1,
       two: 2
   }; // target object
   
   const arr = ['one', 'two']; // target object
   
   console.log(Reflect.getOwnPropertyDescriptor(obj, 'one')); 
   // yields { value: 1, writable: true, enumerable: true, configurable: true }
   console.log(Reflect.getOwnPropertyDescriptor(arr, 1)); 
   // yields { value: 'two', writable: true, enumerable: true, configurable: true }
   ```

   The property descriptor object contains:

   - value: the value of `propertyKey`.
   - writable: is `true` if the `propertyKey` value may be changed otherwise `false`.
   - enumerable: is true if the `propertyKey` surfaces during enumeration of the properties of the `target` object otherwise `false`.
   - configurable: is `true` if the type of `propertyKey` can be changed or if the `propertyKey` itself can be deleted from the `target` object.

    


3. #### getPrototypeOf()

   > Reflect.getPrototypeOf(_target_)

   The `Reflect.getPrototype` method returns the [prototype](https://dillionmegida.com/p/understanding-the-prototype-chain-in-javascript/) of the `target` object.

   ```javascript
   class JavaScript {}
   const obj = {}; // target object
   const arr = ['one', 'two']; // target object
   const str = new String(); // target object
   const js = new JavaScript();
   
   console.log(Reflect.getPrototypeOf(obj)); // Object { }
   console.log(Reflect.getPrototypeOf(arr)); // Array []
   console.log(Reflect.getPrototypeOf(str)); // String { "" }
   console.log(Reflect.getPrototypeOf(js)); // JavaScript {}
   ```

   

4. #### has()

   > Reflect.has(_target, propertyKey_)

   The `Reflect.has()` method can be used to check if a `propertyKey` exists in the `target` object. It works like the `in` operator but as a function. It return `true` if `propertyKey` exists in the `target` object, otherwise, `false`.

   ```javascript
   const obj = {
       one: 1,
       two: 2
   }; // target object
   const arr = ['one', 'two']; // target object
   
   console.log(Reflect.has(obj, 'one')); // true
   console.log(Reflect.has(obj, 'three')); // false
   console.log(Reflect.has(arr, 1)); // true
   console.log(Reflect.has(arr, 2)); // false
   ```

   

5. #### isExtensible()

   > Reflect.isExtensible(_target_)

   The `Reflect.isExtensible()` method is used to check if new properties can be added to the `target` object.

   ```javascript
   const obj = {
       one: 1,
       two: 2
   }; // target object
   const arr = ['one', 'two']; // target object
   
   console.log(Reflect.isExtensible(obj)); // true
   console.log(Reflect.isExtensible(arr)); // true
   
   // prevent extensibility
   Object.seal(obj);
   Object.preventExtensions(arr);
   
   console.log(Reflect.isExtensible(obj)); // false
   console.log(Reflect.isExtensible(arr)); // false
   ```
   
   

6. #### ownsKey()

   > Reflect.ownsKey(_target_)

   The `Reflect.ownsKey()` method returns an array of the keys of all own properties of the `target` object. It includes both enumerable and non-enumerable properties.

   ```javascript
   const obj = {
       one: 1,
       two: 2
   }; // target object
   const arr = ['one', 'two']; // target object
   
   console.log(Reflect.ownKeys(obj)); // [ 'one', 'two' ]
   console.log(Reflect.ownKeys(arr)); // [ '0', '1', 'length' ]
   ```

   



## Differences between `Reflect` and `Object` Methods

Some of `Reflect` object static methods are the same as methods available on `Object` but there are some differences between these methods. The differences are outline below:



| Method Name                | Reflect.[Method Name]                                        | Object.[Method Name]                                         |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| defineProperty()           | Returns `true` if property was defined otherwise `false`.    | Returns the`target` object if property was defined otherwise `TypeError`. |
| getOwnPropertyDescriptor() | If `target` is not a primitive object, `TypeError` is returned. | If `target` is not a primitive object, it is coerced to one. |
| getPrototypeOf()           | Throws a `TypeError` for non-objects.                        | Throws a `TypeError` for non-objects in **ES5**, but coerces non-objects in **ES2015**. |
| setPrototypeOf()           | Returns `true` if `prototype` was successfully set, and `false` if it wasn't (including if `prototype` is non-extensible). Throws a `TypeError` if `target` is not an object, or if `prototype`  is neither an Object nor null. | Returns the `target` object if `prototype` was set successfully. Throws a `TypeError` if `prototype` is neither Object nor null, or  is non-extensible. |
| preventExtenstions()       | Returns `true` if the `target` object has been made non-extensible, and `false` if it has not. Throws a `TypeError` if the `target` object is not an object (a primitive). | Returns the `target` object if it has been made non-extensible. Throws a `TypeError` in **ES5** if `target` is not an object (a primitive). In **ES2015**, treats the `target` as a non-extensible, ordinary object and returns the object itself. |
| isExtensible()             | Throws a `TypeError` if `target` is not an object (a primitive). | Throws a `TypeError` in **ES5** if `target` is not an object (a primitive). In **ES2015**, it will be coerced into a non-extensible, ordinary object and will return `false`. |



## Conclusion

The need for a single API for reflection gave rise to the creation of the `Reflect` object. It has been seen that `Reflect` methods perform the same functionality as some `Object` static methods, some `Function` prototype methods, and some `operators`, however with the `Reflect` object those functionalities can be performed by just calling its methods. The JavaScript language is still growing so more methods would definitely be added to the `Reflect` object.

Thanks for reading :)
