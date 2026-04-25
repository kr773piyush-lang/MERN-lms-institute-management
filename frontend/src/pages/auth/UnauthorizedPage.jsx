import { Link } from "react-router-dom";

const UnauthorizedPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6 text-center">
    <h1 className="text-3xl font-bold text-slate-900">Unauthorized</h1>
    <p className="mt-2 text-slate-600">You do not have permission to access this page.</p>
    <Link
      to="/login"
      className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
    >
      Go to login
    </Link>
  </div>
);

export default UnauthorizedPage;
