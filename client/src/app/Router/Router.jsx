import HomePage from "../../pages/HomePage";
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router";
import Layout from "../Layout";
import RegisterPage from "../../pages/RegistrationPage";
import LoginPage from "../../pages/LoginPage";
import ProtectedRoute from "../../shared/ProtectedRoute";
import AuthorPage from "../../pages/AuthorPage";

function Router({ registerHandler, loginHandler, logoutHandler, user, deleteHandler }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout logoutHandler={logoutHandler} user={user} />}>
          <Route path="/" element={<HomePage user={user} />} />
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
                <LoginPage loginHandler={loginHandler} />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/books/my"
          element={
            <ProtectedRoute isAllowed={!!user} redirectTo="/books/my">
              <AuthorPage user={user} deleteHandler={deleteHandler}/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
