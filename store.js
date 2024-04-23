import { createStore } from "./src/redux";

const initialState = {
  user: {
    name: "ztq",
    age: 18,
  },
  group: {
    name: "前端组",
  },
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "updateUser":
      return {
        ...state,
        user: { ...state.user, name: payload.name },
      };
    default:
      return state;
  }
};

export default createStore(reducer, initialState);
