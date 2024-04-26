import { useContext, useEffect, useState, createContext } from "react";
import isEqual from "lodash.isequal";

const appContext = createContext(null);

export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>;
};

export const createStore = (reducer, initialState, enhancer) => {
  const store = new Store(reducer, initialState);
  if (enhancer !== undefined) {
    if (typeof enhancer !== "function") {
      throw new Error("enhancer should be function");
    }
    return enhancer(createStore)(reducer, initialState);
  }
  return store;
};

export const compose = (...fns) => {
  if (!fns.length) return (arg) => arg;
  if (fns.length === 1) return fns[0];
  return fns.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
};

export const applyMiddleware =
  (...middlewares) =>
  (createStore) =>
  (reducer, defaultState) => {
    const store = createStore(reducer, defaultState);
    const chain = middlewares.map((item) =>
      item({
        getState: store.getState,
        dispatch: store.dispatch,
      })
    );
    const dispatch = compose(...chain)(store.dispatch);
    return {
      ...store,
      dispatch,
    };
  };

export const thunk =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (typeof action === "function") {
      return action(dispatch);
    }
    return next(action);
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
        typeof selector === "function"
          ? selector(nextState)
          : { state: nextState };
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
