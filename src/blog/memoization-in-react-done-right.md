---
title: Memoization in React Done Right
date: 2022-03-20
cover: https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/Memoization%20in%20React%20Done%20Right_gideonidoko.com_aeae9bb7a8.jpg?alt=media&token=c02558c7-e647-4815-8b39-56c561ae8c62
description: Performance is a vital quality every software product ought to possess. It is a measure of how efficiently your software meets the response time requirements when a user interacts with it. There are a couple of ways in which React applications can be optimized for performance.
tags: [react, javascript, memoization]
---

Performance is a vital quality every software product ought to possess. It is a measure of how efficiently your software meets the response time requirements when a user interacts with it. There are a couple of ways in which React applications can be optimized for performance. In this article, we'll learn how to increase the performance of React applications using a technique called **memoization** and how to do it the right way.

## Prerequisites

Before going through this article, having a little background knowledge of React will help.

## What is Memoization?

> _In computing, memoization or memoisation is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again._ ~ Wikipedia

Memoization is used to store the result of prior executed computations so that they can be reused later. This is the **traditional** memoization. 

## Traditional Memoization

To understand how traditional memoization works, firstly, let's take a look at a simple function that increments a number by one.

```javascript
const increment = (num) => num + 1;

console.log(increment(1)) // 2
console.log(increment(1)) // 2
console.log(increment(2)) // 3
```

The increment function above gets recomputed upon every call even if we are incrementing the same number.

Let's look at a simple function that takes a function as an argument and memoizes (caches) the result of the computation of the function.

```javascript
const memoize = (func) => {
    const cache = {}; // cache for computed results
    // return memoized function
    return (...args) => { // args is an array of all the argument that will be passed to the memoized function
        let n = args[0];  // get the first argument
        if (n in cache) {
            console.log('Fetching from cache');
            return cache[n]; // returns the cached result & terminates
        }
        console.log('Computing result');
        let result = func(n);
        cache[n] = result; // cache the result using the first argument as key
        return result;
    }
}
```

The `memoize` function has a cache object where it stores the first argument and result of the passed-in function computations as key-value pairs.

Now, let's wrap out the `increment` function with the `memoize` function to get a new memoized function.

```javascript
const memoizedIncrement = memoize(increment);

console.log(memoizedIncrement(1)) // Computing result 2
console.log(memoizedIncrement(1)) // Fetching from cache  2
console.log(memoizedIncrement(2)) // Computing result  3
console.log(memoizedIncrement(2)) // Fetching from cache 3
console.log(memoizedIncrement(1)) // Fetching from cache 2
```

Our new memoized function, `memoizedIncrement`, is only recomputed if a new argument that is not in the cache as a key is passed. This, in turn, makes our code more efficient. Memoization isn't actually needed for a simple function as the one above but it's a lot helpful for functions with expensive computations where computation time is more critical than space.

> **NB**: In memoization, we trade memory (to store our cache) for efficiency (to speed up our application).

## Memoization in React

React provides the following for memoization:

1. `React.memo`
2. `useMemo`
3. `useCallback`

### 1. React.memo

React.memo is a [higher order component](https://reactjs.org/docs/higher-order-components.html) that is used to memoize React components. Memoization of React components is a bit different from traditional memoization. In traditional memoization, recomputation is only done if the passed argument is not in the cache, while in React component memoization, recomputation (rerender in this case) is done if the props changes. NB. props are like argument but for React components.

Let's rewrite our `memoize` to look like how memoization of React components works.

```javascript
const memoize = (func) => {
    let cache = {}; 
    // return memoized function
    return (...args) => {
        let n = args[0];  // get the first argument
        if (n in cache) {
            console.log('Fetching from cache');
            return cache[n]; // returns the cached version & terminate
        }
        console.log('Computing result');
        let result = func(n);
        cache = { [n]: result }; // overwrite cache
        return result;
    }
}

const memoizedIncrement = memoize(increment);

console.log(memoizedIncrement(1)) // Computing result 2
console.log(memoizedIncrement(2)) // Computing result 3
console.log(memoizedIncrement(1)) // Computing result 2
console.log(memoizedIncrement(1)) // Fetching from cache 2
console.log(memoizedIncrement(2)) // Computing result 3
```

Here we can see that the result is only fetched from the cache if the argument stays the same otherwise the function is recomputed. Also, if the props passed to a component that is memoized with `React.memo()` remain the same, a rerender of that component is not triggered.

Let's look at a small React application that displays a number, two buttons to increment and decrement it and lastly a greeting text.

```jsx
import { useState } from 'react';
import { render } from 'react-dom';

const Greeter = ({ name }: { name: string }) => {
  console.log('Greeter is rendered');
  return <div>Hello { name }</div>
};

const App = () => {
  const [num, setNum] = useState(0);
  const name = 'John Doe';
  return (
    <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
      <h1>Memoization App</h1>
      <h1>{ num }</h1>
      <button style={btn} onClick={() => setNum(num + 1)}>Increment</button>
      <button style={btn} onClick={() => setNum(num - 1)}>Decrement</button>
      <Greeter name={name} />
    </div>
  );
}

const btn = {
  border: 'none',
  margin: '0.5rem',
  backgroundColor: 'rgb(6, 90, 90)',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  color: 'white',
  fontFamily: 'inherit'
}

render(<App />, document.getElementById('root'));
```

Here is what our app looks like:

![Memoization app](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/memoapp_gideonidoko.com_a290fbcdd7.PNG?alt=media&token=7dc57ca4-f373-4d2d-9a0b-a9209999f160)

The `Greeter` component is passed a `name` prop that is from our app's state and rendered. Ideally, the Greeter component is supposed to render just once i.e. when the `App` is rendered but that's not the case here. If we click on our increment button five times, the number is incremented from 0 to 5 also, the Greeter component is rerendered 5 times. The image below shows the log from the Greeter component which is printed 5 times.

![memoappconsole](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/memoappconsole_gideonidoko.com_2dd57a2f35.PNG?alt=media&token=ab5b00ec-84ed-4a79-9aa6-de3f677388ee)

Basically, the `Greeter` component will be initially rendered and rerendered every time the state of the `App` component changes irrespective of if the props passed to Greeter stays the same or not. This is where `React.memo` comes in. Let's wrap the Greeter component with the memo HOC (higher order component).

```jsx
import { memo } from 'react';

const Greeter = memo(({ name }) => {
  console.log('Greeter is rendered');
  return <div>Hello { name }</div>
});
```

Now, as long as the `name` prop of the `Greeter` component remains the same, the component will only render once (initial render). Hurray, we now have for ourselves, an optimized app👏. But wait, there is a caveat, shallow comparison.

`React.memo` does a shallow comparison and so, it only compares prop values with primitive data types like numbers, string, booleans etc and not prop values with referential integrity like objects, array, functions and so on. This is because values with referential integrity have different references every time they are used.  No two non-primitive values are exactly the same unless they have the same reference.

```javascript
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
const obj1 = { one: 1 };
const obj2 = { one: 1 };
const func1 = () => 1;
const func2 = () => 1;
const arr3 = arr1;
 
console.log(arr1 === arr2); // false
console.log(obj1 === obj2); // false
console.log(func1 === func2); // false
console.log(arr1 === arr3); // true
```

So, every time we pass in a non-primitive value as props, no memoization will be done on that component even if it is wrapped with `React.memo`.

Let's rewrite our `Greeter` component to take in a non-primitive object value as name props.

```jsx
const Greeter = memo(({ name }) => {
  console.log('Greeter is rendered');
  return <div>Hello { name.first + ' ' + name.last }</div>
});

const App = () => {
  const [num, setNum] = useState(0);
  const name = { first: 'John', last: 'Doe' };
  return (
    <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
      <h1>Memoization App</h1>
      <h1>{ num }</h1>
      <button style={btn} onClick={() => setNum(num + 1)}>Increment</button>
      <button style={btn} onClick={() => setNum(num - 1)}>Decrement</button>
      <Greeter name={name} />
    </div>
  );
}
```

The `Greeter` will be called every time the state of the `App` component changes. How do we fix this problem?😢 How can we memoize our component even when we want to pass a prop with an object value? Wear a smile, `React.memo` takes in a second argument which is a callback that enables us to take control over the comparison. This callback is passed the previous and next props as the first and second argument respectively and it should return a boolean. We can take advantage of this and use the values of the properties of the object props to tell if the component should be rerendered or not.

```javascript
const Greeter = memo(({ name }) => {
  console.log('Greeter is rendered');
  return <div>Hello { name.first + ' ' + name.last }</div>
}, (prevProps, nextProps) => {
  return prevProps.name.first === nextProps.name.first && prevProps.name.last === nextProps.name.last; // true
});
```

Here, the `Greeter` component will be rerendered if the above callback evaluates to false which will only happen if the `first` & `last` properties of the `name` object change.

### 2. useMemo

`useMemo` is a [ React hook](https://reactjs.org/docs/hooks-intro.html) that memoizes the result of a computation and always returns the memoized result. useMemo takes in as an argument a function that returns the computation result and an array of dependencies Another computation is done only when any of the dependencies change. 

In our `App` component, we could memoize the result of the `name` object. In that case, we wouldn't need the second argument of the `React.memo` HOC. Here's how:

```javascript
import { useState, useMemo } from 'react';

const Greeter = memo(({ name }) => {
  console.log('Greeter is rendered');
  return <div>Hello { name.first + ' ' + name.last }</div>
});

const App = () => {
  const [num, setNum] = useState(0);
  const name = { first: 'John', last: 'Doe' };
  const memoizedName = useMemo(() => ({ first: name.first, last: name.last }), [name.first, name.last]); // will recompute only if name.first or name.last changes
  return (
    <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
      <h1>Memoization App</h1>
      <h1>{ num }</h1>
      <button style={btn} onClick={() => setNum(num + 1)}>Increment</button>
      <button style={btn} onClick={() => setNum(num - 1)}>Decrement</button>
      <Greeter name={memoizedName} />
    </div>
  );
}
```

Here, the Greeter component would only be rendered initially and rerendered if the `first` & `last` properties of the `name` object change just like when we used the second argument of `React.memo`.

### 3. useCallback

 `useCallback` like `useMemo` is also a [ React hook](https://reactjs.org/docs/hooks-intro.html) but unlike useMemo, it memoizes a callback and always returns the memoized callback. It takes as an argument a function (callback) and an array of dependencies. A new version of the callback is only returned when any of the dependencies change.

Let's rewrite our app to alert a greeting text when the user clicks on the greeting text of the Greeter component.

```jsx
const Greeter = memo(({ name, onClick }) => {
  console.log('Greeter is rendered');
  return <div onClick={onClick}>Hello { name.first + ' ' + name.last }</div>
});

const App = () => {
  const [num, setNum] = useState(0);
  const name = { first: 'John', last: 'Doe' };
  const memoizedName = useMemo(() => ({ first: name.first, last: name.last }), [name.first, name.last]); // will recompute only if name.first or name.last changes
  const handleClick = () => alert(`Hello ${name.first} ${name.last}`);
  return (
    <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
      <h1>Memoization App</h1>
      <h1>{ num }</h1>
      <button style={btn} onClick={() => setNum(num + 1)}>Increment</button>
      <button style={btn} onClick={() => setNum(num - 1)}>Decrement</button>
      <Greeter name={memoizedName} onClick={handleClick} />
    </div>
  );
}
```

The memoization is broken after adding the click event to our Greeter component making it rerender every time the state of `App` changes. This is because we are passing `handleClick` which is a function (a non-primitive value) as the value of our `onClick` props. Remember that `React.memo` only does a shallow comparison hence, the rerender. Here, we can use the `useCallback` hook to memoize the `handleClick` function as below:

```jsx
import { useState, useMemo, useCallback } from 'react';

const App = () => {
  const [num, setNum] = useState(0);
  const name = { first: 'John', last: 'Doe' };
  const memoizedName = useMemo(() => ({ first: name.first, last: name.last }), [name.first, name.last]); // will recompute only if name.first or name.last changes
  const handleClick = useCallback(() => alert(`Hello ${name.first} ${name.last}`), [name.first, name.last]);
  return (
    <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
      <h1>Memoization App</h1>
      <h1>{ num }</h1>
      <button style={btn} onClick={() => setNum(num + 1)}>Increment</button>
      <button style={btn} onClick={() => setNum(num - 1)}>Decrement</button>
      <Greeter name={memoizedName} onClick={handleClick} />
    </div>
  );
}
```

We've successfully restored memoization to our Greeter component by using the `useCallback` hook.

## Some things to note

Although memoization is a pretty fascinating technique and performance boost, do **NOT** use it everywhere in your application. Why? because anytime we memoize, our application takes up memory to cache results. We may end up hurting the performance of our application instead of improving it. What's kind of ideal? Memoize:

- components or functions with expensive and time-consuming computations.
- when computation time is more critical than space in your application.
- components or functions that receive the same prop or argument values overtime.
- when a function or component is more frequently computed or rendered.

## Conclusion

We have seen how the performance of our application can be improved with memoization. We also discussed the 3 tools that React provides for memoization and their respective use cases. We also discussed how memoization in React slightly differs from the traditional one. 

I hope the information in this article helps you create better and more performant applications in the future.

Thanks for reading😊.
