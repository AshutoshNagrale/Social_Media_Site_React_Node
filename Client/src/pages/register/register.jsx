import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.current.value !== passwordAgain.current.value) {
      passwordAgain.current.setCustomValidity("Password Don't Match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("http://localhost:4400/api/auth/register", user);
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SocialZone</h3>
          <span className="loginDesc">Connect with Friends and Families.</span>
        </div>
        <div className="loginRight">
          <form onSubmit={handleSubmit} className="loginBox">
            <input
              required
              type="text"
              ref={username}
              placeholder="Username"
              className="loginInput"
            />
            <input
              required
              type="email"
              ref={email}
              placeholder="Email"
              className="loginInput"
            />
            <input
              required
              type="password"
              ref={password}
              placeholder="Password"
              className="loginInput"
              min={6}
            />
            <input
              required
              type="password"
              ref={passwordAgain}
              placeholder="Password Again"
              className="loginInput"
              minLength={6}
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button className="loginRegister">Log into your Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}
