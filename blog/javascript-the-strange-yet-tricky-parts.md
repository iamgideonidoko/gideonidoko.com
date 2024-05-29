---
title: "JavaScript: The Strange Yet Tricky Parts"
date: 2021-03-13
cover: https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/JavaScript_The-strange-yet-tricky-parts_gideonidoko.com_2fc2c4bd83.jpg?alt=media&token=8626a0e6-bc21-40b6-af21-7ccdc9952733
description: JavaScript is one of the most widely used technologies in the engineering world as it is very efficient, and great for building fast, high-performing applications. Despite the awesomeness of JavaScript, the language has some tricky parts, one of which you might have come across.
tags: [javascript, trick]
---

JavaScript is one of the most widely used technologies in the engineering world as it is very efficient, and great for building fast, high-performing applications. Despite the awesomeness of JavaScript, the language has some tricky parts, one of which you might have come across. 

Understanding these strange parts will help you understand JavaScript better, offer up some insights,  increase your debugging speed and much more.

In this article, I’ll discuss some of the strange parts of JavaScript.

## Prerequisites
Before going through this article, having a little knowledge of the following will help:

- JavaScript
- ES6

Alright, let's dive straight into the parts:

## 1. Math.min() is greater than Math.max()
If no argument is passed to both the `min()` and `max()` functions, `min()` returns positive infinity while `max()` returns negative infinity. Positive infinity is greater than negative infinity meaning `min()` is greater than `max()` which is unusual and isn’t the case if number values are passed to  the two static functions.
```javascript
Math.min(1, 2, 3); // returns 1
Math.max(1, 2, 3); // returns 3
Math.min(); //returns Infinity
Math.max(); //returns –Infinity
console.log(Math.min() > Math.max()) // outputs true

```

## 2. Addition of two arrays returns a string
If we add two arrays together, a string value is gotten. This is so because JavaScript's interpreter first converts both arrays to strings and then concatenates them.

```javascript
[1, 2, 3, 4, 5] + [5, 6, 7, 8, 9]  // yields ‘1, 2, 3, 45, 6, 7, 8, 9’

```

## 3. HTML Comments can be written in JavaScript
HTML Comments `(<!-- -->)` are ignored by JavaScript’s interpreter. The opening and closing HTML comments if used separately, are also ignored.
```javascript
console.log(‘html comments’)
<!-- I am a comment and will be ignored -->

// the above outputs ‘html comments’ with no error
```

In the past, HTML comments were used inside `<script>` tags so that browsers with no JavaScript support ignored it. How?

```html
<html>
    <body>
    <script>
    <!-- 
	console.log(‘tests’);
    //-->
     </script>
     </body>
</html>
```
In the above snippet, browsers with no JavaScript support will read the console statement as a comment, while in browsers with JavaScript support, the closing HTML comment`(-->)` will be commented out making the console statement interpretable.

As most browsers now support JavaScript, using the HTML comments in JavaScript code is now irrelevant not advised. This is one of the reasons a lot of JavaScript syntax highlighters do not display HTML comments as valid comments even though they actually are.


## 4. Arguments is not defined in arrow functions
The `arguments` object, holds values of arguments passed to a function.
```javascript
function func() {
	console.log(arguments)
}
func(1, 2, 3); // {0: 1, 1: 2, 2:3}
```
A ReferenceError will occur if the arguments object is used in an arrow function.
```javascript
let func = () => arguments;
func(1, 2, 3); // Reference Error: arguments is not defined
```
[Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) are a shorter version of regular functions, and as such they do not provide bindings to the `arguments` object. Sad? don't be, there’s an alternative for achieving similar result through the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters). See the below snippet:
```javascript
let func = (...args) => args;
func(1, 2, 3); // [1, 2, 3]
```

## 5. Null to Zero Comparison
The result gotten from comparing null to zero is contradictory. Consider the below expressions:
```javascript
null == 0; // false
null > 0; // false
null < 0; // false
null >= 0; // true
null <= 0; // true
```
In the above, null is neither equal to nor `>` nor `< 0`  but it is `>=0` and also `<=` 0 which is an odd behavior. 
Wait!... does this make sense? Well, the behavior is so, because of how the expressions are evaluated.

The equality operator follows the [Absolute Equality Comparison Algorithm](http://interglacial.com/javascript_spec/a-11.html#a-11.9.3). It compares the values on both sides, if the values can’t be compared precisely, it converts both to numbers and compare. This conversion does not happen on a side that is null or undefined so it returns false hence, the result in the first expression. In the second and third expression, the `<` and `>` operators follow the [Absolute Relational Comparison Algorithm](http://interglacial.com/javascript_spec/a-11.html#a-11.8.5) and unlike the equality operator, convert the null value to number. So they yield zero.
```javascript
null > 0
+null > +0
0 > 0 // false (same for the < operator)
```
In the last two expressions, the `<=` and `>=` operators follow these [steps](http://interglacial.com/javascript_spec/a-11.html#a-11.8.4) and it is evaluated as so:
> if `null < 0` is false, then `null >= 0` is true if `null > 0` is false, then `null <= 0` is true. 

i.e.
```javascript
null >= 0;
!(null < 0);
!(+null < +0);
!(0 < 0);
!false;
true;
```

To learn more about **null to zero comparison**, check [this]( https://blog.campvanilla.com/javascript-the-curious-case-of-null-0-7b131644e274) out. 



## 6. Arrow functions return undefined instead of an empty curly-brace object
If you try to return a `{}` directly in an arrow function you'll get `undefined`.
```javascript
let func = () => {};
func(); // undefined.
```
This is mainly because, `{}` is part of the syntax of arrow functions so JavaScript’s interpreter reads it as one, making the function behave like any other function that returns undefined by default.

By wrapping the return value in a bracket, it is possible to return the `{}` object.
```javascript
let func = () => ({});
func(); // {}
```


## 7. The precedence of finally block over try block
The finally block takes precedence over the try block and so also the value of their return statements. 
```javascript
let func = function() {
	try {
		 return 'evil';
	} finally {
		 return 'good';
	}
}
func(); // good
```
The above func() function returns **‘good’** and not **‘evil’**.

## 8. Relational comparison of three numbers
Comparing three numbers together might produce what seems like a misleading result. Take a look at the code snippet below:
```javascript
console.log(1 < 2 < 3); // true
console.log(3 > 2 > 1); // false
```
The result??.. Yes, they are different and both correct. Why??? The JavaScript engine first interprets the first two values which produce a **boolean** and afterwards, converts the boolean value to a number and compares it with the third value. 
```javascript
1 < 2 < 3; // selects first two values
(1 < 2) < 3; //1 < 2 -> true 
true < 3; // true is converted to 1
1 < 3; // true

//while
3 > 2 > 1;
(3 > 2) > 1;
true > 1;
1 > 1; // false
```

## 9. Addition of object and array
Let’s consider the below snippet:
```javascript
[] + {} // yields “[object Object]”
{} + [] // yields 0
```
Now, this is another contradicting situation and it’s also as a result of how the JavaScript engine interprets the expressions. The interpreter first converts the two values to strings and concatenates them like in the below snippet. 
```javascript
[] + {}
[].toString() + {}.toString(); //converting the empty array yields an empty string
‘’ + ‘[object Object]’ // yields ‘[object Object’], which is the result of the first expression
```
But why isn’t the result of the second expression also `“[object Object]”`? This is because the engine reads the first value (`{}`) as a block of code and not an empty object and does no conversion on it so this leaves us with `+[]` which is a unary operator. Instead of converting `+[]` to a string, the engine converts it to a number and the conversion returns 0.


## 10. Unexpected return due to Automatic Semicolon Insertion (ASI)
An unexpected value will be returned, if the value is not on the same line with the `return` keyword.
```javascript
let func = (function() {
    return 
    {
        a: 1
    }
})(); // yields undefined
```
[Automatic Semicolon Insertion](https://en.wikibooks.org/wiki/JavaScript/Automatic_semicolon_insertion) is a concept where the JavaScript engine automatically inserts semicolon after some lines e.g. the line with the `return` keyword. This **ASI** made the function to terminate and return `undefined`. To remedy this, the returned expression must be in the same line with the `return keyword`. 
```javascript
let func = (function() {
    return  {
           a: 1
    }
})(); // yields { a: 1 }

```

## Wrap Up
I guess you've been wowed by most, if not all of these weird parts of the JavaScript language. JavaScript is vast, and so, there are more tricky parts which the article doesn't contain. I hope the clues from this article will help you find more and be a better developer.

Thanks for reading :)
