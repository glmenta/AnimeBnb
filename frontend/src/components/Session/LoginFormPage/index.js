import React, { useState } from "react";
import * as sessionActions from "../../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  //validations
  const MIN_USERNAME_LENGTH = 4;
  const MIN_PASSWORD_LENGTH = 6;

  const validCredential = credential.length >= MIN_USERNAME_LENGTH;
  const validPassword = password.length >= MIN_PASSWORD_LENGTH;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
          else {
            setErrors(["The provided credentials are invalid"]);
          }
        }
      );
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({
      credential: "Demo-lition",
      password: "password"
    })).then(closeModal);
  };

  return (
    <div className = 'popup'>
    <form onSubmit={handleSubmit} className='login'>
      <h1>Log In</h1>
    <ul className='ul'>
      {errors.map((error, idx) => (
        <li key={idx} className='li'>
          {error}
        </li>
      ))}
    </ul>
    <label className='label'>
      Username or Email
      <input
        className='input'
        type='text'
        id='username-input'
        value={credential}
        onChange={e => setCredential(e.target.value)}
        required
      />
    </label>
    <label className='label'>
      Password
      <input
        className='input'
        type='password'
        value={password}
        id='username-input'
        onChange={e => setPassword(e.target.value)}
        required
      />
    </label>
    <button type='submit'
      className='button'
      disabled={!validCredential || !validPassword}
      >
      Log In
    </button>
      <div className='demo-login'>
        <a
        href="javascript:void(0)"
        onClick={handleDemoLogin}
        >Demo User</a>
      </div>
  </form>
  </div>
  );
}

export default LoginFormPage;
