import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import * as sessionActions from "../../../store/session";
import './SignupForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  //validations
  const MIN_FIRSTNAME_LENGTH = 2;
  const MIN_LASTNAME_LENGTH = 2;
  const MIN_EMAIL_LENGTH = 5;
  const MIN_USERNAME_LENGTH = 4;
  const MIN_PASSWORD_LENGTH = 6;
  const MIN_CONFIRM_PASSWORD_LENGTH = 6;

  const validFirstName = firstName.length >= MIN_FIRSTNAME_LENGTH;
  const validLastName = lastName.length >= MIN_LASTNAME_LENGTH;
  const validEmail = email.length >= MIN_EMAIL_LENGTH;
  const validUsername = username.length >= MIN_USERNAME_LENGTH;
  const validPassword = password.length >= MIN_PASSWORD_LENGTH;
  const validConfirmPassword = confirmPassword.length >= MIN_CONFIRM_PASSWORD_LENGTH;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setErrors({...errors, ...newErrors})

    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  const handleDemoSignup = (e) => {
    e.preventDefault();
    setErrors([])
    return dispatch(sessionActions.signup({
      username: "Demo-lition",
      email: "demo@example.com",
      firstName: 'Demo',
      lastName: 'Man',
      password: "password"
    })).then(closeModal)
  }

  return (
    <div className='form-container'>
      <div className='submit-form'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
         <ul >
                {Object.values(errors).map((error, idx) => {
                return (
                    <li className='signup-errors' key={idx}>{error}</li>)})}
            </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit"
        id='submit-signup-button'
          disabled={!validEmail || !validUsername || !validFirstName || !validLastName || !validPassword || !validConfirmPassword}
        >Sign Up</button>
        <div className='demo-signup'>
        <a
        href="javascript:void(0)"
        onClick={handleDemoSignup}
        >Demo Signup</a>
        </div>
      </form>
      </div>
    </div>
  );
}

export default SignupFormPage;

// if (!validFirstName) {
//   errors.push('First name must be at least ' + MIN_FIRSTNAME_LENGTH + ' characters long');
// }

// if (!validLastName) {
//   errors.push('Last name must be at least ' + MIN_LASTNAME_LENGTH + ' characters long');
// }

// if (!validEmail) {
//   errors.push('Email must be at least ' + MIN_EMAIL_LENGTH + ' characters long');
// }

// if (!emailRegex.test(email)) {
//   errors.push("Please enter a valid email address")
// }

// if (!validUsername) {
//   errors.push('Username must be at least ' + MIN_USERNAME_LENGTH + ' characters long');
// }

// if (!validPassword) {
//   errors.push('Password must be at least ' + MIN_PASSWORD_LENGTH + ' characters long');
// }

// if (!validConfirmPassword) {
//   errors.push('Confirm password must be at least ' + MIN_CONFIRM_PASSWORD_LENGTH + ' characters long');
// }

// if (password !== confirmPassword) {
//   errors.push('Confirm Password field must be the same as the Password field');
// }

// if (errors.length > 0) {
//   alert(errors.join('\n'));
//   return;
// }

// if (!validEmail || !validUsername || !validFirstName || !validLastName || !validPassword || !validConfirmPassword) {
//   setErrors(['Please correct the errors below']);
//   return;
// }
