import { store, connect, appContext } from "./redux";
import "./App.css";

const 大儿子 = () => {
  console.log("大儿子");
  return (
    <section>
      大儿子
      <User />
    </section>
  );
};

const 二儿子 = () => {
  console.log("二儿子");
  return (
    <section>
      二儿子
      <UserModifier />
    </section>
  );
};

const 幺儿子 = connect()((props) => {
  const { state } = props;
  console.log("幺儿子");
  return <section>幺儿子, group: {state.group}</section>;
});

const User = connect((state) => ({
  user: state.user,
}))((props) => {
  console.log("User");
  const { user } = props;
  return <div>User: {user.name}</div>;
});

const UserModifier = connect()((props) => {
  console.log("UserModifier");
  const { dispatch, state } = props;
  const onChange = (e) => {
    dispatch({
      type: "updateUser",
      payload: e.target.value,
    });
  };

  return (
    <div>
      <input value={state.user.name} onChange={onChange} />
    </div>
  );
});

function App() {
  console.log("app");

  return (
    <div className="App">
      <appContext.Provider value={store}>
        <大儿子 />
        <二儿子 />
        <幺儿子 />
      </appContext.Provider>
    </div>
  );
}

export default App;
