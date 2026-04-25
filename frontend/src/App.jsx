import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "./components/common/Loader";
import ProtectedRoute from "./routes/ProtectedRoute";
import { bootstrapAuth } from "./features/auth/authSlice";
import { ROLES } from "./utils/constants";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const UnauthorizedPage = lazy(() => import("./pages/auth/UnauthorizedPage"));
const SuperAdminDashboard = lazy(() =>
  import("./pages/admin/SuperAdminDashboard"),
);
const InstituteAdminDashboard = lazy(() =>
  import("./pages/admin/InstituteAdminDashboard"),
);
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return (
    <Suspense fallback={<Loader fullScreen text="Loading page..." />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/super-admin/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institute-admin/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.INSTITUTE_ADMIN]}>
              <InstituteAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="register" element={<Navigate to="/register" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
