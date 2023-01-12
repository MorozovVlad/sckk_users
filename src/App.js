import "./App.css";
import UsersTable2 from "./components/UsersTable2";
import {
  Switch,
  Route,
  useLocation,
  useHistory,
  Redirect,
} from "react-router-dom";
import Login from "./components/Login/Login";
import { createContext, useEffect, useState } from "react";
import { message } from "antd";
import { useAuth } from "./hooks/useAuth";

export const AppContext = createContext();

function App() {
  const [messageApi, contextHolder] = message.useMessage();

  const { tryLogout, tryLogin, isStateAuth, user } = useAuth(messageApi);

  return (
    <div className="App">
      {contextHolder}
      <AppContext.Provider
        value={{ auth: { tryLogout, tryLogin, user }, message: messageApi }}
      >
        <Switch>
          {isStateAuth ? (
            <Route path="/">
              <UsersTable2 />
            </Route>
          ) : null}
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </AppContext.Provider>
    </div>
  );
}

export default App;
