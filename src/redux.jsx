import { useContext, useEffect, useState, createContext } from "react";

const appContext = createContext(null);

export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>;
};

export const createStore = (reducer, initialState) => {
  const store = new Store(reducer, initialState);
  return store;
};

// const judgeIsChanged = (prevState, nextState) => {
//   if (prevState === nextState) return false;

//   let ret = false
//   Object.keys(prevState).forEach(key => {
//     if (typeof)
//   });
// };

export const connect = (selector) => (Component) => (props) => {
  const { state, subscribe, dispatch } = useContext(appContext);
  const [, update] = useState({});
  const finalState =
    typeof selector === "function" ? selector(state) : { state };
  useEffect(() => {
    subscribe((nextState) => {
      const newState =
        typeof selector === "function" ? selector(nextState) : nextState;
      // if (judgeIsChanged(state, newState)) {
      update({});
      // }
    });
  }, []);
  return <Component {...props} {...finalState} dispatch={dispatch} />;
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
