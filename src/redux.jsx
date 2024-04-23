import { useContext, useEffect, useState, createContext } from "react";
import isEqual from "lodash.isequal";

const appContext = createContext(null);

export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>;
};

export const createStore = (reducer, initialState) => {
  const store = new Store(reducer, initialState);
  return store;
};

export const connect = (selector) => (Component) => (props) => {
  const store = useContext(appContext);
  const curState = store.getState();
  const [, update] = useState({});
  const state =
    typeof selector === "function" ? selector(curState) : { state: curState };
  useEffect(() => {
    return store.subscribe((nextState) => {
      const newState =
        typeof selector === "function" ? selector(nextState) : nextState;
      if (!isEqual(state, newState)) {
        update({});
      }
    });
  }, []);
  return <Component {...props} {...state} dispatch={store.dispatch} />;
};

export class Store {
  constructor(reducer, initialState) {
    this.state = initialState;
    this.reducer = reducer;
    this.listeners = [];
  }

  getState = () => this.state;

  setState = (newState) => {
    this.state = newState;
    this.listeners.forEach((it) => {
      it(this.state);
    });
  };

  dispatch = (action) => {
    this.setState(this.reducer(this.state, action));
  };

  subscribe = (fn) => {
    this.listeners.push(fn);
    return () => {
      const idx = this.listeners.indexOf(fn);
      if (idx === -1) return;
      this.listeners.splice(idx, 1);
    };
  };
}
