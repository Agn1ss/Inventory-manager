import { useEffect } from "react";
import { useThisUserStore } from "../store/thisUserStore";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccessPage() {
  const navigate = useNavigate();
  const setUser = useThisUserStore(state => state.setUser);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get("accessToken");
    const refreshToken = query.get("refreshToken");

    if (accessToken) {
      localStorage.setItem("token", accessToken);
      // Можно вызвать API, чтобы получить данные пользователя по токену
      // или использовать данные из токена
      // setUser({ ... }) если есть user
      navigate("/"); // редирект на корень
    } else {
      navigate("/");
    }
  }, []);

  return <div>Redirecting...</div>;
}