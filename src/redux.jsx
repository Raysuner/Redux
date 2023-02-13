import { useState, useEffect, useContext, createContext } from "react";

const appContext = createContext(null);

const store = {
  state: {
    user: {
      name: "qing",
    },
    group: "前端组",
  },
  listenerList: [],
  setState(newState) {
    store.state = newState;
    store.listenerList.forEach((fn) => fn());
  },
  subscribe(fn) {
    store.listenerList.push(fn);
    return () => {
      const idx = store.listenerList.indexOf(fn);
      if (idx !== -1) {
        store.listenerList.splice(idx, 1);
      }
    };
  },
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "updateUser":
      return {
        ...state,
        user: {
          ...state.user,
          name: payload,
        },
      };

    default:
      return state;
  }
};

const isChanged = (oldValue, newValue) => {
  for (const key in newValue) {
    if (oldValue[key] !== newValue[key]) {
      return true;
    }
  }
  return false;
};

const connect = (selector) => (Component) => (props) => {
  const { state, setState } = useContext(appContext);
  const [, forceUpdate] = useState({});

  const data = selector ? selector(state) : { state };

  const dispatch = (action) => {
    setState(reducer(state, action));
  };

  useEffect(() => {
    return store.subscribe(() => {
      const newData = selector ? selector(store.state) : { state: store.state };
      if (isChanged(data, newData)) {
        forceUpdate({});
      }
    });
  }, [selector]);

  return <Component {...props} {...data} dispatch={dispatch} />;
};

export { store, connect, appContext };
