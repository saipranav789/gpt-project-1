import { useState } from "react";
import useAuthContext from "./useAuthContext";
import axios from "axios";

const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      const json = response;
      console.log(json);
      if (json) {
        //save the user to local storage
        localStorage.setItem("user", JSON.stringify(json));
        //update the auth context
        dispatch({ type: "LOGIN", payload: json });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};

export default useLogin;
