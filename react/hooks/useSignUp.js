import { useState } from "react";
import useAuthContext from "./useAuthContext";
import axios from "axios";

const useSignUp = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/register", {
        email,
        password,
      });

      // Since axios already parses the response, no need to call .json()
      const json = response;
      if (json) {
        // Save the user to local storage
        localStorage.setItem("user", JSON.stringify(json));

        // Update the auth context after a 2 second delay
        setTimeout(() => {
          dispatch({ type: "LOGIN", payload: json });
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
export default useSignUp;
