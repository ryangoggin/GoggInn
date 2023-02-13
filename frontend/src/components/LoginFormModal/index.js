// Phase 1: Frontend Authme --> Phase 4 Modal
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
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

  const loginDemo = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ "credential": "Demo-lition", "password": "password" }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  }

  return (
    <div className='form-container'>
        <form onSubmit={handleSubmit}>
        <h1 className="form-text form-header">Log In</h1>
        <ul>
          {errors.map((error, idx) => (
              <li key={idx} className="errors">{error}</li>
            ))}
        </ul>
        <label className="form-text">
            Username or Email
            <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            />
        </label>
        <label className="form-text">
            Password
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </label >
        <button className="form-button form-text" type="submit" disabled={credential.length < 4 || password.length < 6}>Log In</button>
        <button className="form-button form-text" onClick={loginDemo}>Log in as Demo User</button>
        </form>
    </div>
  );
}

export default LoginFormModal;
