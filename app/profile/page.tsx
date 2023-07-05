"use client"
import styles from "./profile.module.scss";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../context/store";
import Link from "next/link";
import axios from 'axios';
import Image from 'next/image';
import followingimg from '../../public/Following.png';
import calendar from '../../public/Calendar.png';
import post from '../../public/Post.png';

interface User {
  _id: string;
  username: string;
  // Outras propriedades do usuário, se houver
}

interface Post {
  _id: string;
  title: string;
  text: string;
  category: string;
  // Outras propriedades do post
}

const Profile = () => {
  const isLoggedIn = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userName, setUserName] = useState("");
  const [following, setFollowing] = useState<User[]>([]);
  const [dreamCount, setDreamCount] = useState(0);
  const [nightmareCount, setNightmareCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fazer uma chamada para obter o ID do usuário logado e armazená-lo no estado
        const userResponse = await axios.get('https://crescent-cmxzospgf-tandreotti.vercel.app/auth/user', { withCredentials: true });
        const user = userResponse.data;

        // Fazer a requisição do nome do usuário logado utilizando o ID
        const usernameResponse = await axios.get(`https://crescent-cmxzospgf-tandreotti.vercel.app/users/${user._id}`);
        setUserName(usernameResponse.data.username);
        
        // Fazer a requisição do nome dos amigos utilizando o ID
        const friendsResponse = await axios.get(`https://crescent-cmxzospgf-tandreotti.vercel.app/users/${user._id}/friends`);
        setFollowing(friendsResponse.data);

        // Fazer a requisição do número de sonhos e pesadelos postados
        const dreamResponse = await axios.get(`https://crescent-cmxzospgf-tandreotti.vercel.app/posts/${user._id}/posts?category=dreams`);
        setDreamCount(dreamResponse.data.length);

        const nightmareResponse = await axios.get(`https://crescent-cmxzospgf-tandreotti.vercel.app/posts/${user._id}/posts?category=nightmares`);
        setNightmareCount(nightmareResponse.data.length);
        
        // Fazer a requisição dos posts do usuário logado utilizando o ID
        const response = await axios.get(`https://crescent-cmxzospgf-tandreotti.vercel.app/posts/${user._id}/posts`);
        setPosts(response.data);

      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openCalendarModal = () => {
    setIsCalendarModalOpen(true);
  };
  
  const closeCalendarModal = () => {
    setIsCalendarModalOpen(false);
  };

  return (
    <div className={styles.main}>
      <div className={styles.posts}>
        <div className={styles.postBigImage}>
          <Image className={styles.image} src={calendar} width={360} height={222} alt="Calendar" />
          <button onClick={openCalendarModal} className={styles.calendarBtn}>Calendar</button>
        </div>
        <div className={styles.post}>
          <h2 className={styles.positionName}>{userName}</h2>
          <div className={styles.position}>
            <div className={styles.left}>
              <p>
                <span>{dreamCount}</span>
                <br />
                Dreams
              </p>
            </div>
            {isLoggedIn && isLoggedIn.isLoggedIn ? (
              <div className={styles.starPosition}>
                <Image className={styles.star} onClick={openModal} src={followingimg} width={36} height={36} alt="Following" />
                <h4>Following</h4>
              </div>
            ) : (
              <p>logue para vizualizar</p>
            )}
            <div className={styles.right}>
              <p>
                <span>{nightmareCount}</span>
                <br />
                Nightmares
              </p>
            </div>
          </div>
        </div>
        <div className={styles.postBigImage}>
          <Image className={styles.imageRight} src={post} width={360} height={222} alt="Post" />
          <Link href={`/post`}><button className={styles.postBtn}>POST</button></Link>
        </div>
      </div>
      <div className={styles.posts}>
        {posts.map((post, index) => (
          <Link
            href={post.category === "dreams" ? `dreams/${post._id}` : `nightmares/${post._id}`}
            key={post._id}
            className={((index + 1) % 3 === 2) ? styles.post : styles.postBig}
          >
            <h2>{post.title}</h2>
            <p>{post.text}</p>
          </Link>
        ))}
      </div>
      {isModalOpen && (
        <div className={styles.modal}>
          {/* Conteúdo do modal */}
          <div className={styles.modalBox}>
            <h2>Following {following.length} users</h2>
            {following.map((friend) => (
              <Link href={`profile/${friend._id}`} key={friend._id} ><p key={friend._id}>{friend.username}</p></Link>
            ))}
            <button onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
      {isCalendarModalOpen && (
        <div className={styles.modal}>
          {/* Conteúdo do modal */}
          <div className={styles.modalBox}>
            <h2>Coming Soon</h2>
            <button onClick={closeCalendarModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;