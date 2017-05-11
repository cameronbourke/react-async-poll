react-async-poll
=========================

WebSockets are cool and awesome, but sometimes we don't get to choose our backend. So how can we still get the most recent data into our react app on a regular basis? Polling to the rescue!

**NOTE:** version 2.x has a breaking change in the interface. For extensibility, `asyncPoll()` now takes only one argument: an object with named attributes.

## Installation
react-async-poll requires React 0.14 or later.
```
npm install --save react-async-poll
```

## Usage
```js
// ES6
...
import React from 'react';
import asyncPoll from 'react-async-poll';

const WrappedComponent = ({ data }) => {
	const list = data.map(({ title }) => <li>{title}</li>);
	return <ul>{list}</ul>;
};

const onPollInterval = (props, dispatch) => {
	/*
	In this example, dispatch will return a Promise
	and then call this function again [intervalDuration]
	milliseconds later once the Promise has resolved
	*/
	return dispatch(getNewData(props.id));
};

/*
The first invocation of asyncPoll will return a function
that accepts only one argument: your component
*/
export default asyncPoll({
    intervalDuration: 60 * 1000,
    onPollInterval
})(WrappedComponent);
```

## Documentation

### `asyncPoll(options)`

Connects a React component to a polling instance.

#### Options
- `[intervalDuration]` (Number, optional, default `60000`): This length of time in milliseconds will be used to determine how long to wait until the next call of the `[onInterval]` function once the returned promise resolves.
- `[onInterval([ownProps], dispatch)]` (Function): If a `Promise` is returned, `[onInterval]` will initiate a `setTimeout` with the `[intervalDuration]` once the `Promise` has resolved. The `dispatch` parameter is only passed to `[onInterval]` if it is available in props, otherwise it will be `undefined`.
- `[pollWhenHidden]` (Boolean, default `true`): if set to `false`, the [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) will be used to determine if the page is visible and polling will only occur when the page is visible.

#### Remarks
- The asyncPoll function needs to be invoked twice. The first time with the first two arguments described above (configuration), and a second time, with the last (the component): `asyncPoll({options})(MyComponent)`. This is because a higher-order component is just a function that takes an existing component and returns another component that wraps it.

- It does not modify the passed React component. It returns a new, polling component, that you should use instead.

#### API Reference

Your component that is passed to `asyncPoll` is wrapped and passed its `ownProps` and an additional three that give you explicit control over the polling, if you have that use case.

Property      | Type     | Description
------------- | -------- | ------------------
isPolling     | boolean  | whether or not there is a polling instance in the wrapper component
stopPolling   | function | stops the polling in the wrapper component if not already stopped, handy if you want to stop the polling before it is done by default in `componentWillUnmount`
startPolling  | function | starts the polling in the wrapper component if not already polling

## Todo
- Add unit tests

## License

MIT Licensed Copyright (c) Cameron Bourke 2016
