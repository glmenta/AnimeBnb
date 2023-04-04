import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
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
    <button type='submit' className='button'>
      Log In
    </button>
  </form>
  </div>
  );
}

export default LoginFormPage;
