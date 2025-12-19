import HomePage from "../../pages/HomePage";
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import RegisterPage from "../../pages/RegistrationPage";
import LoginPage from "../../pages/LoginPageClean";
import ProtectedRoute from "../../shared/ProtectedRoute";
import FavoritePage from "../../pages/FavoritePage";
import BookDetailPage from "../../pages/BookDetailPage";

function Router({
  registerHandler,
  loginHandler,
  sendOtpHandler,
  verifyOtpHandler,
  logoutHandler,
  user,
  deleteHandler,
}) {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout logoutHandler={logoutHandler} user={user} />}>
          <Route path="/" element={<HomePage user={user} />} />
          <Route
            path="/books/:id"
            element={
              <ProtectedRoute isAllowed={!!user} redirectTo="/login">
                <BookDetailPage user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute isAllowed={!!user} redirectTo="/login">
                <FavoritePage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/registration"
          element={
            <ProtectedRoute isAllowed={!user} redirectTo="/">
              <RegisterPage registerHandler={registerHandler} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute isAllowed={!user} redirectTo="/">
              <LoginPage
                loginHandler={loginHandler}
                sendOtpHandler={sendOtpHandler}
                verifyOtpHandler={verifyOtpHandler}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
