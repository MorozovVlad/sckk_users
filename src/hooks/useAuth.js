import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { axios } from "../api/api";

const STATE = {
  LOGIN: 1,
  LOGOUT: 2,
  UNKNOWN: 3,
  AUTH: 4,
};

export const useAuth = (message) => {
  const history = useHistory();
  const location = useLocation();

  const [stateAuth, setStateAuth] = useState(STATE.UNKNOWN);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/get_user")
      .then(({ data }) => {
        if (data.login) {
          setStateAuth(STATE.AUTH);
          setUser(data);
        }
      })
      .catch(() => {
        setStateAuth(STATE.LOGOUT);
      });
  }, []);

  useEffect(() => {
    if (stateAuth === STATE.LOGOUT) {
      history.push("/login");
    } else if (stateAuth === STATE.LOGIN) {
      history.push("/");
      setStateAuth(STATE.AUTH);
    }
  }, [stateAuth, location.pathname]);

  const tryLogout = () => {
    axios.get("/logout").then(() => {
      setStateAuth(STATE.LOGOUT);
    });
  };

  const tryLogin = (values) => {
    axios.post("/login", values).then(({ data }) => {
      if (data.login) {
        setStateAuth(STATE.LOGIN);
        setUser(data);
      } else {
        message.open({
          type: "error",
          content: "Логин или пароль неверны!",
        });
      }
    });
  };
  return {
    tryLogout,
    tryLogin,
    isStateAuth: stateAuth === STATE.AUTH,
    user,
  };
};
