// 请从课程简介里下载本代码
import React from "react";
import { connect, Provider } from "./redux";
import store from "./store";

const 大儿子 = () => (
  <section>
    大儿子
    <User />
  </section>
);
const 二儿子 = () => (
  <section>
    二儿子
    <UserModifier />
  </section>
);
const 幺儿子 = connect()(
  React.memo(
    () => {
      return <section>幺儿子</section>;
    },
    (oldProps, newProps) => {
      return oldProps.group === newProps.group;
    }
  )
);
const User = connect()(({ state }) => {
  return <div>User:{state.user.name}</div>;
});

const UserModifier = connect((state) => ({ user: state.user }))(
  ({ user, dispatch }) => {
    const onChange = (e) => {
      dispatch({ type: "updateUser", payload: { name: e.target.value } });
    };
    return (
      <div>
        {/* <input value={user.name} onChange={onChange} /> */}
        name: {user.name}
        <button
          onClick={() => {
            dispatch((dispatchArg) => {
              setTimeout(() => {
                dispatchArg({
                  type: "updateUser",
                  payload: { name: "大帅比" },
                });
              }, 2000);
            });
          }}
        >
          异步action
        </button>
      </div>
    );
  }
);

const App = () => {
  return (
    <Provider store={store}>
      <大儿子 />
      <二儿子 />
      <幺儿子 />
    </Provider>
  );
};

export default App;
