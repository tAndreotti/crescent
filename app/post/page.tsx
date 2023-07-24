"use client"
import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './post.module.scss';
import axios from 'axios';

type Props = {}

const Post = (props: Props) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [titleError, setTitlerror] = useState("");
  const [textError, setTextError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [category, setCategory] = useState<string>("");
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('https://api.waning.cloud/auth/user', { withCredentials: true });
        const user = userResponse.data;
        setUserId(user._id);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    let isValid = true;
  
    if (!title || title.length < 5) {
      setTitlerror("Title should have at least 5 characters");
      isValid = false;
    } else {
      setTitlerror("");
    }
    
    if (!text || text.length < 5) {
      setTextError("Text should have at least 5 characters");
      isValid = false;
    } else {
      setTextError("");
    }
  
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (category === "") {
      console.log("Please select a category");
      return;
    }

    try {
      const response = await axios.post('https://api.waning.cloud/posts', {
        userId,
        title,
        text,
        category,
      },{ withCredentials: true });

      if (response.status === 200) {
        const posts = response.data;

        // Redirecionar o usuário para a página desejada após a criação do post
        router.push('/');
      } else {
        console.log(response.data.msg); // Mensagem de erro da API
        // Exibir mensagem de erro para o usuário
        setSubmitError("Invalid information");
      }
    } catch (error) {
      console.log(error); // Tratar erro de conexão ou outro erro de requisição
      // Exibir mensagem de erro para o usuário
      setSubmitError("Invalid information");
    }
  };

  return (
    <div className={styles.main}>
      <h1>Sign Up</h1>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formInput}>
            <label htmlFor="title"><h4>Title:</h4></label>
            <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" id='title' placeholder='Title of the story' />
            {titleError && <div className={styles.error}>{titleError}</div>}
          </div>
          <div className={styles.formInput}>
            <label htmlFor="text"><h4>Description:</h4></label>
            <textarea onChange={(e) => setText(e.target.value)} value={text} id='text' placeholder='Describe your dream/nightmare' rows={6} />
            {textError && <div className={styles.error}>{textError}</div>}
          </div>
          <div className={styles.formInput}>
            <label htmlFor="text"><h4>Category:</h4></label>
            <div>
              <input type="radio" id="dreams" name="category" value="dreams" checked={category === 'dreams'} onChange={(e) => setCategory(e.target.value)}/>
              <label htmlFor="dreams">Dream</label>
            </div>
            <div>
              <input type="radio" id="nightmares" name="category" value="nightmares" checked={category === 'nightmares'} onChange={(e) => setCategory(e.target.value)}/>
              <label htmlFor="nightmares">Nightmare</label>
            </div>
          </div>
          <button className={styles.buttonStyle} type='submit'><h3>POST</h3></button>
          {submitError && <div className={styles.error}>{submitError}</div>}
        </form>
      </div>
    </div>
  )
}

export default Post;