import { useCallback, useState } from "react";

const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (requestFn) => {
    try {
      setLoading(true);
      setError(null);
      return await requestFn();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute, clearError: () => setError(null) };
};

export default useApiRequest;
