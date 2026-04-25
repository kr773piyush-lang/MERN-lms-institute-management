import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../components/common/ErrorAlert";
import { clearAuthError, login } from "../../features/auth/authSlice";
import { getPrimaryRole, ROLE_HOME_ROUTE } from "../../utils/constants";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  instituteId: yup.string().optional(),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      instituteId: "default",
    },
  });

  useEffect(() => {
    if (user) {
      const role = getPrimaryRole(user);
      navigate(ROLE_HOME_ROUTE[role] || "/unauthorized", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const onSubmit = async (values) => {
    await dispatch(login(values));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">LMS Login</h1>
        <p className="mb-5 text-sm text-slate-500">Sign in with your backend credentials.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorAlert message={error} />
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-red-500">{errors.email?.message}</p>
          </div>
          <div>
            <label
              htmlFor="instituteId"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Institute ID
            </label>
            <input
              id="instituteId"
              type="text"
              {...register("instituteId")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-red-500">{errors.instituteId?.message}</p>
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-red-500">{errors.password?.message}</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
