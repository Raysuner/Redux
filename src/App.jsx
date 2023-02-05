import { createContext, useContext } from "react";
import { useState } from "react";
import "./App.css";

const appContext = createContext(null);

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

const User = () => {
  const { appState } = useContext(appContext);
  return <div>User: {appState.user.name}</div>;
};

const UserModifier = () => {
  const { appState, setAppState } = useContext(appContext);
  const onChange = (e) => {
    appState.user.name = e.target.value;
    setAppState({ ...appState });
  };

  return (
    <div>
      <input value={appState.user.name} onChange={onChange} />
    </div>
  );
};

function App() {
  const [appState, setAppState] = useState({
    user: {
      name: "qing",
    },
  });

  return (
    <div className="App">
      <appContext.Provider value={{ appState, setAppState }}>
        <大儿子 />
        <二儿子 />
        <幺儿子 />
      </appContext.Provider>
    </div>
  );
}

export default App;
