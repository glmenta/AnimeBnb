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

  return (
    <div className = 'popup'>
    <form onSubmit={handleSubmit} className='login'>
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
  </form>
  </div>
  );
}

export default LoginFormPage;
