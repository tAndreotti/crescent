"use client"
import styles from './nightmares.module.scss';
import { useState, useEffect, useContext, FormEvent } from 'react';
import { AuthContext } from "../../context/store";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import following from '../../../public/Following.png';
import notfollowing from '../../../public/NotFollowing.png';

interface User {
  _id: string;
  username: string;
  // Outras propriedades do usuário, se houver
}

interface Post {
  username: string;
  userId: string;
  _id: string;
  title: string;
  text: string;
  createdAt: string;
  // Outras propriedades do post
}

const Nightmares = () => {
  const isLoggedIn = useContext(AuthContext);
  const [post, setPost] = useState<Post | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [friendId, setFriendId] = useState("");
  const [myId, setMyId] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const router = useRouter();

  const [text, setText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fazer uma chamada para obter o ID do usuário logado e armazená-lo no estado
        let myId = "";
        let user = null;

        try {
          const myIdResponse = await axios.get('https://crescent-cmxzospgf-tandreotti.vercel.app/auth/user', { withCredentials: true });
          user = myIdResponse.data;
          myId = user?._id || ""; // Obtém o ID do usuário ou define uma string vazia caso o usuário esteja deslogado
        } catch (error) {
          // Trata o erro ao obter o ID do usuário (usuário deslogado)
          console.error('Error fetching user ID:', error);
        }
        setMyId(myId);

        const postId = window.location.pathname.split('/').pop(); // Obtém o último segmento da URL como o ID do post

        const response = await axios.get(`https://crescent-cmxzospgf-tandreotti.vercel.app/posts/${postId}`);
        setPost(response.data);

        const postUserId = response.data.userId;
        setFriendId(postUserId);

        // Fazer a requisição do nome dos amigos utilizando o ID
        const friendsResponse = await axios.get(`https://crescent-cmxzospgf-tandreotti.vercel.app/users/${user._id}/friends`);
        const friends = friendsResponse.data;
        const friendIds = friends.map((friend: User) => friend._id);
        setIsFriend(friendIds.includes(postUserId));

        if (user && response.data.userId && user._id === response.data.userId) {
          setIsOwner(true);
        };
        
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, [post]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleFollow = async () => {
    try {
      if (isFriend) {
        // Remover o amigo
        await axios.patch(`https://crescent-cmxzospgf-tandreotti.vercel.app/users/${myId}/${friendId}`, { withCredentials: true });
        setIsFriend(false);
      } else {
        // Adicionar o amigo
        await axios.patch(`https://crescent-cmxzospgf-tandreotti.vercel.app/users/${myId}/${friendId}`, { withCredentials: true });
        setIsFriend(true);
      }
    } catch (error) {
      console.error('Error adding/removing friend:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      const postId = window.location.pathname.split('/').pop();
      await axios.delete(`https://crescent-cmxzospgf-tandreotti.vercel.app/posts/${myId}/${postId}`, { withCredentials: true });
      
      // Redirecionar o usuário para a página desejada após o login
      router.push('/profile');

    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openUpdate = () => {
    setText(post?.text || "");
    setIsUpdateOpen(true);
  };
  
  const closeUpdate = () => {
    setIsUpdateOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const postId = window.location.pathname.split('/').pop();
      const response = await axios.patch(`https://crescent-cmxzospgf-tandreotti.vercel.app/posts/${myId}/${postId}`, {
        text,
      },{ withCredentials: true });

      if (response.status === 200) {
        const posts = response.data;

      } else {
        console.log(response.data.msg); // Mensagem de erro da API
        // Exibir mensagem de erro para o usuário
      }

      setIsUpdateOpen(false);
      router.push(`/nightmares/${postId}`);

    } catch (error) {
      console.log(error); // Tratar erro de conexão ou outro erro de requisição
      // Exibir mensagem de erro para o usuário
    }
  };

  return (
    <div className={styles.main}>
      {post ? (
        <div key={post._id} className={styles.container}>
          <div className={styles.vertical}>
            <div className={styles.horizontal}>
              <h2>{post.title} / <Link href={`profile/${post.userId}`}><span>{post.username}</span></Link></h2>
              {isLoggedIn && isLoggedIn.isLoggedIn ? (
                isFriend ? (
                  <Image className={styles.star} onClick={handleFollow} src={following} width={36} height={36} alt="Following" />
                ) : (
                  <Image className={styles.star} onClick={handleFollow} src={notfollowing} width={36} height={36} alt="Not Following" />
                )
              ) : (
                <p>Login to Follow</p>
              )}
            </div>
            <div className={styles.date}>
              <h5>{formatDate(post.createdAt)}</h5>
            </div>
          </div>
          <div>
            <p>{post.text}</p>
          </div>
          {post && isOwner && (
            <div className={styles.horizontal}>
              <h5 onClick={openUpdate}>Update Memory</h5>
              <h5 onClick={openModal}>Delete</h5>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {post && isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <h2>Delete Post</h2>
            <p>Are you sure you want to delete <br /> <strong>&quot;{post.title}&quot;</strong>?</p>
            <div className={`${styles.horizontal} ${styles.width}`}>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {post && isUpdateOpen && (
        <div className={styles.modal}>
          <div className={styles.modalUpdateBox}>
            <h2>Update Memory</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formInput}>
                <label htmlFor="text"><h4>Description:</h4></label>
                <textarea onChange={(e) => setText(e.target.value)} value={text} id='text' placeholder='Describe your nightmare' rows={6} />
              </div>
              <div className={styles.horizontal}>
                <button className={styles.buttonStyle} type='submit'><h3>POST</h3></button>
                <button onClick={closeUpdate}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Nightmares;