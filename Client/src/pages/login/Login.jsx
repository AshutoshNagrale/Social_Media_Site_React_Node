import { useContext, useRef } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import "./login.css";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SocialZone</h3>
          <span className="loginDesc">Connect with Friends and Families.</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleLogin}>
            <input
              type="email"
              ref={email}
              placeholder="Email"
              className="loginInput"
              required
            />
            <input
              type="password"
              ref={password}
              placeholder="Password"
              className="loginInput"
              required
              minLength={6}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress
                  className="circularProgress"
                  sx={{
                    color: "white",
                  }}
                  size={35}
                />
              ) : (
                "Login"
              )}
            </button>
            <span className="loginForgot">Forgot Password ?</span>
            <button className="loginRegister">
              {isFetching ? (
                <CircularProgress
                  className="circularProgress"
                  sx={{
                    color: "white",
                  }}
                  size={35}
                />
              ) : (
                "Create a New Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
