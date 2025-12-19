import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({
  children,
  isAllowed,
  redirectTo = "/",
}) {
  if (!isAllowed) return <Navigate to={redirectTo} replace />;
  return children ?? <Outlet />;
}
