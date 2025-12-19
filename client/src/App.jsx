import { useEffect, useState } from "react";
import Router from "./app/Router/Router";
import axios from "axios";
import "./shared/axiosinstance";
import { setAccessToken } from "./shared/axiosinstance";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();
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
        t("errors.registration") +
          ": " +
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

  const sendOtpHandler = async (phone) => {
    const response = await axios.post("/api/auth/send-otp", { phone });
    return response.data;
  };

  const verifyOtpHandler = async ({ phone, code }) => {
    const response = await axios.post("/api/auth/verify-otp", { phone, code });
    setUser(response.data.user);
    setAccessToken(response.data.accessToken);
    return response.data;
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
      sendOtpHandler={sendOtpHandler}
      verifyOtpHandler={verifyOtpHandler}
      logoutHandler={logoutHandler}
      // deleteHandler={deleteHandler}
    />
  );
}

export default App;
