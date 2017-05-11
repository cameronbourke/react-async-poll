import React from 'react';
import Promise from 'promise';

const asyncPoll = ({
	intervalDuration = 60 * 1000,
	onInterval,
	pollWhenHidden = true,
}) => {

	return (Component) => class extends React.Component {
		constructor () {
			super();
			this.startPolling = this.startPolling.bind(this);
			this.stopPolling = this.stopPolling.bind(this);
			this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
		}

		componentWillMount () {
			if (!pollWhenHidden) {
				document.addEventListener('visibilitychange', this.handleVisibilityChange);
			}
		}

		componentDidMount () {
			this.startPolling();
		}

		componentWillUnmount () {
			this.stopPolling();
			document.removeEventListener('visibilitychange', this.handleVisibilityChange);
		}

		startPolling () {
			if (this.interval) return;
			this.keepPolling = true;
			this.asyncInterval(intervalDuration, onInterval);
		}

		stopPolling () {
			this.keepPolling = false;
			if (this.interval) {
				clearTimeout(this.interval);
				this.interval = null;
			}
		}

		handleVisibilityChange () {
			if (document.hidden) {
				this.stopPolling();
			} else {
				this.startPolling();
			}
		}

		asyncInterval (intervalDuration, fn) {
			const promise = fn(this.getProps(), this.props.dispatch);
			const asyncTimeout = () => setTimeout(() => {
				this.asyncInterval(intervalDuration, fn);
			}, intervalDuration);
			const assignNextInterval = () => {
				if (!this.keepPolling) {
					this.stopPolling();
					return;
				}
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
