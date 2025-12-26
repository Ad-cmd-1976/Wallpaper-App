import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const AuthSuccessPage = () => {
  const navigate = useNavigate();
  const { getGoogleUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const success = await getGoogleUser();
      if (success) {
        navigate("/");
      }
      else {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, getGoogleUser]);

  return <p>Logging in with Google...</p>;
};

export default AuthSuccessPage;
