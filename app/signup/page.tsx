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
  const router = useRouter();
  const isLoggedIn = useContext(AuthContext);

  const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        console.log(user); // Dados do usuário registrado

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
          </div>
          <div className={styles.formInput}>
            <label htmlFor="email"><h4>Email:</h4></label>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" id='email' placeholder='Insert your email' />
          </div>
          <div className={styles.formInput}>
            <label htmlFor="password"><h4>Password:</h4></label>
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" id='password' placeholder='Insert your password' />
          </div>
          <button className={styles.buttonStyle} type='submit'><h3>Sign Up</h3></button>
        </form>
      </div>
    </div>
  )
}

export default SignUp;