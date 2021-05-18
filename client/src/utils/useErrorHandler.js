import { useState } from "react";

function useErrorHandler(givenError) {
  const [error, setError] = useState(null);
  if (givenError) throw givenError.message;
  if (error) throw error;
  return setError;
}

export default useErrorHandler;
