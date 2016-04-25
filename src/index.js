import React from 'react';
import Promise from 'promise';

const asyncPoll = (intervalDuration = 60 * 1000, onInterval) => {

	return (Component) => class extends React.Component {
		constructor () {
			super();
			this.startPolling = this.startPolling.bind(this);
			this.stopPolling = this.stopPolling.bind(this);
		}

		componentDidMount () {
			this.startPolling();
		}

		componentWillUnmount () {
			this.stopPolling();
		}

		startPolling () {
			if (this.interval) return;
			this.keepPolling = true;
			this.asyncInterval(intervalDuration, onInterval);
		}

		stopPolling () {
			this.keepPolling = false;
			if (this.interval) clearTimeout(this.interval);
		}

		asyncInterval (intervalDuration, fn) {
			const promise = fn(this.getProps(), this.props.dispatch);
			const asyncTimeout = () => setTimeout(() => {
				this.asyncInterval(intervalDuration, fn);
			}, intervalDuration);
			const assignNextInterval = () => {
				if (!this.keepPolling) return this.stopPolling();
				this.interval = asyncTimeout();
			};

			Promise.resolve(promise)
			.then(assignNextInterval)
			.catch(assignNextInterval);
		}

		getProps () {
			return {
				...this.props,
				startPolling: this.startPolling,
				stopPolling: this.stopPolling,
				isPolling: Boolean(this.interval),
			};
		}

		render () {
			const props = this.getProps();
			return <Component {...props} />;
		}
	};

};

export default asyncPoll;
