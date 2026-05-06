export { durationObserver, pauseObserver }

class Observer {
  callbacks = [];

  subscribe(cb) {
    this.callbacks.push(cb);
  };

  unsubscribe(cb) {
    this.callbacks = this.callbacks.filter((_cb) => _cb !== cb);
  };

  broadcast(...params) {
    this.callbacks.forEach((cb) => cb(...params));
  }
}

const durationObserver = new Observer();
const pauseObserver = new Observer();