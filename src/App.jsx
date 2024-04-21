// 请从课程简介里下载本代码
import { connect, Provider } from "./redux";
import store from "../store";

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
const 幺儿子 = () => <section>幺儿子</section>;
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
        <input value={user.name} onChange={onChange} />
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
