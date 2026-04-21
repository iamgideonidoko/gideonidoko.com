---
title: The flushSync Method in React
date: 2022-08-03
cover: https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/The%20flushSync%20Method%20in%20React_gideonidoko.com_84383afe42.jpg?alt=media&token=91871eaa-c219-4d17-b91b-f56612436274
description: React batches multiple state updates made within hooks or callbacks to improve the performance of applications. flushSync is a method made available by the react-dom package that helps to bypass the default state update batching.
tags: [react, javascript]
---

React batches multiple state updates made within hooks or callbacks to improve the performance of applications. Components will be rerendered immediately after every synchronous state update is made if state updates are not batched. This can lead to performance issues.

Consider the below `App` component:

```jsx
export default function App() {
    const [count, setCount] = React.useState(0);
    const [toggle, setToggle] = React.useState(false);
    const [text, setText] = React.useState('');
    const [data, setData] = React.useState(null);

    const handleClick = () => {
        setCount(count + 1);
        setToggle((prevState) => !prevState);
        setText(`Rand: ${(Math.random() * 100).toFixed(0)}`);
        setData({ one: 1, two: 2 });
    }

    console.log('Component rendered');

    return (
        <div>
          <button onClick={() => handleClick()}>Click me</button>
          <h2>Count: {count}</h2>
          <h2>Toggle: {toggle ? 'Yes' : 'False'}</h2>
          <h2>Text: {text}</h2>
          <h2>Data: {JSON.stringify(data)}</h2>
        </div>
      );
}
```

All four state updates in the `handleClick` click event handler will be performed before the `App` component will be re-rendered. The component will only be rendered once after the **[Click me]** instead of four times because of the batched state update feature of React.

The image below shows the state of the component after the button is clicked once:

![https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/flushsync-update-before_gideonidoko.com_acca7458d0.PNG?alt=media&token=df0df38e-2917-4872-9fe0-7cee45b08815](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/flushsync-update-before_gideonidoko.com_acca7458d0.PNG?alt=media&token=df0df38e-2917-4872-9fe0-7cee45b08815)

You can see from the 'Component rendered’ log message that the `App` was re-rendered just once.

React v18 comes with automatic batching — an improvement to the feature — that makes every state update invoked anywhere batched by default.

## What then does `flushSync` do?

State update batching is not required in some cases, such as when the next state update is dependent on the previous one. This is where `flushSync` comes in.

`flushSync` is a method made available by the [react-dom](https://www.npmjs.com/package/react-dom) package that helps to bypass the default state update batching. It takes in a callback when invoked and flushes any updates contained within the provided callback, synchronously causing the DOM to be instantly updated.

```jsx
flushSync(callback)
```

To get started with using `flushSync`, import the `flushSync` method from `react-dom` and wrap your state updates with the callback passed to the method.

Let’s make the `setCount` state update synchronous.

```jsx
import { flushSync } from 'react-dom';

// ...
    const handleClick = () => {
				// Component is re-rendered after this update
        flushSync(() => setCount(count + 1))
				// the DOM is updated at this point
        setToggle((prevState) => !prevState);
        setText(`Rand: ${(Math.random() * 100).toFixed(0)}`);
        setData({ one: 1, two: 2 });
				// the component is re-rendered and the DOM is updated again at this point
    }
// ...
```

Below is the new state of the component:

![https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/flushsync-update-after_gideonidoko.com_5e5a98150b.PNG?alt=media&token=60d73ef5-4949-4feb-b829-a861aced2842](https://firebasestorage.googleapis.com/v0/b/gideonidoko-website-assets.appspot.com/o/flushsync-update-after_gideonidoko.com_5e5a98150b.PNG?alt=media&token=60d73ef5-4949-4feb-b829-a861aced2842)

You can see that the 'Component rendered’ log message is displayed twice, indicating that the `App` was re-rendered twice *—* the first time after the `setCount` state update was invoked and the second time after the rest of the state updates.

## Wrap up

In this article, you learned about React’s state update batching feature that reduces performance loss. You also saw how to use the `flusySync` method of the `react-dom` package to bypass this feature.

Yes, **immediately rendering components after every state update can cause performance loss. This is why you should use `flushSync` sparingly.

## Resources

- [flushSync - React documentation](https://reactjs.org/docs/react-dom.html#flushsync)
