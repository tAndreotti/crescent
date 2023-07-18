"use client"
import React, { useState, FormEvent, useContext } from 'react';
import { useRouter } from 'next/navigation';
import styles from './signup.module.scss';
import axios from 'axios';
import { AuthContext } from '../context/store';

type Props = {}

const SignUp = (props: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const isLoggedIn = useContext(AuthContext);

  const validateForm = () => {
    let isValid = true;
  
    if (!username || username.length < 2) {
      setUsernameError("Username should have at least 2 characters");
      isValid = false;
    } else {
      setUsernameError("");
    }
    
    if (!email || !email.includes("@")) {
      setEmailError("Invalid email");
      isValid = false;
    } else {
      setEmailError("");
    }
  
    if (!password || password.length < 6) {
      setPasswordError("Password should have at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }
  
    return isValid;
  };

  const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('https://api.waning.cloud/auth/register', {
        email,
        password,
        username,
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const user = response.data;
        // console.log(user); // Dados do usuário registrado

        if (isLoggedIn && isLoggedIn.updateIsLoggedIn) {
          isLoggedIn.updateIsLoggedIn(true);
        }

        // Redirecionar o usuário para a página desejada após o registro
        router.push('/');

      } else {
        console.log(response.data.msg); // Mensagem de erro da API
        // Exibir mensagem de erro para o usuário
      }
    } catch (error) {
      console.log(error); // Tratar erro de conexão ou outro erro de requisição
      // Exibir mensagem de erro para o usuário
    }
  };

  return (
    <div className={styles.main}>
      <h1>Sign Up</h1>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formInput}>
            <label htmlFor="username"><h4>Username:</h4></label>
            <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" id='username' placeholder='Insert your email' />
            {usernameError && <div className={styles.error}>{usernameError}</div>}
          </div>
          <div className={styles.formInput}>
            <label htmlFor="email"><h4>Email:</h4></label>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" id='email' placeholder='Insert your email' />
            {emailError && <div className={styles.error}>{emailError}</div>}
          </div>
          <div className={styles.formInput}>
            <label htmlFor="password"><h4>Password:</h4></label>
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" id='password' placeholder='Insert your password' />
            {passwordError && <div className={styles.error}>{passwordError}</div>}
          </div>
          <button className={styles.buttonStyle} type='submit'><h3>Sign Up</h3></button>
          {loginError && <div className={styles.error}>{loginError}</div>}
        </form>
      </div>
    </div>
  )
}

export default SignUp;