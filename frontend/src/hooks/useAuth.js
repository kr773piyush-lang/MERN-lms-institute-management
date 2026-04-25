import { useMemo } from "react";
import { useSelector } from "react-redux";

const useAuth = () => {
  const authState = useSelector((state) => state.auth);

  return useMemo(
    () => ({
      ...authState,
      isLoggedIn: Boolean(authState.token && authState.user),
    }),
    [authState],
  );
};

export default useAuth;
