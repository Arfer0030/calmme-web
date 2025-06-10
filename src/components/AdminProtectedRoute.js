"use client";
import ProtectedRoute from "./ProtectedRoute";

export default function AdminProtectedRoute({ children }) {
  return <ProtectedRoute adminOnly={true}>{children}</ProtectedRoute>;
}
