import { useEffect, useState } from "react";
import Router from "./app/Router/Router";
import axios from "axios";
import "./shared/axiosinstance";
import { setAccessToken } from "./shared/axiosinstance";

function App() {
  const [user, setUser] = useState(null);

  const registerHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      console.log("Registration data being sent:", data);

      const response = await axios.post("/api/auth/registration", data);
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      alert(
        "Ошибка регистрации: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const response = await axios.post("/api/auth/login", data);
    setUser(response.data.user);
    setAccessToken(response.data.accessToken);
  };

  const logoutHandler = () => {
    axios.delete("/api/auth/logout").then(() => {
      setUser(null);
    });
  };

  useEffect(() => {
    axios
      .get("/api/auth/refresh")
      .then((res) => {
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
      })
      .finally();
  }, []);

  return (
    <Router
      user={user}
      registerHandler={registerHandler}
      loginHandler={loginHandler}
      logoutHandler={logoutHandler}
      // deleteHandler={deleteHandler}
    />
  );
}

export default App;
