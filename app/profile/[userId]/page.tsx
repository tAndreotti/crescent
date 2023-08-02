"use client"
import styles from "./profile.module.scss";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../context/store";
import axios from 'axios';
import Image from 'next/image';
import calendar from '../../../public/Calendar.png';
import post from '../../../public/Post.png';
import Link from "next/link";
import following from '../../../public/Following.png';
import notfollowing from '../../../public/NotFollowing.png';

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

const UserProfile = () => {
  const isLoggedIn = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userName, setUserName] = useState("");
  const [dreamCount, setDreamCount] = useState(0);
  const [nightmareCount, setNightmareCount] = useState(0);
  const [isFriend, setIsFriend] = useState(false);
  const [friendId, setFriendId] = useState("");
  const [myId, setMyId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fazer uma chamada para obter o ID do usuário dono da página
        const userId = window.location.pathname.split('/').pop(); // Obtém o último segmento da URL como o ID do post
        if (userId) {
          setFriendId(userId);
        };

        // Fazer a requisição dos posts do usuário logado utilizando o ID
        const response = await axios.get(`https://api.waning.cloud/posts/${userId}/posts`);
        setPosts(response.data);

        // Fazer uma chamada para obter o ID do usuário logado e armazená-lo no estado
        let myId = "";
        let user = null;

        try {
          const myIdResponse = await axios.get('https://api.waning.cloud/auth/user', { withCredentials: true });
          user = myIdResponse.data;
          myId = user?._id || ""; // Obtém o ID do usuário ou define uma string vazia caso o usuário esteja deslogado
        } catch (error) {
          // Trata o erro ao obter o ID do usuário (usuário deslogado)
          console.error('Error fetching user ID:', error);
        }
        setMyId(myId);

        const userResponse = await axios.get(`https://api.waning.cloud/users/${userId}`);
        setUserName(userResponse.data.username);

        // Fazer a requisição do número de sonhos e pesadelos postados
        const dreamResponse = await axios.get(`https://api.waning.cloud/posts/${userId}/posts?category=dreams`);
        setDreamCount(dreamResponse.data.length);

        const nightmareResponse = await axios.get(`https://api.waning.cloud/posts/${userId}/posts?category=nightmares`);
        setNightmareCount(nightmareResponse.data.length);

        // Fazer a requisição do nome dos amigos utilizando o ID
        const friendsResponse = await axios.get(`https://api.waning.cloud/users/${myId}/friends`);
        const friends = friendsResponse.data;
        const friendIds = friends.map((friend: User) => friend._id);
        setIsFriend(friendIds.includes(userId));
        
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, []);

  const handleFollow = async () => {
    try {
      if (isFriend) {
        // Remover o amigo
        await axios.patch(`https://api.waning.cloud/users/${myId}/${friendId}`, { withCredentials: true });
        setIsFriend(false);
      } else {
        // Adicionar o amigo
        await axios.patch(`https://api.waning.cloud/users/${myId}/${friendId}`, { withCredentials: true });
        setIsFriend(true);
      }
    } catch (error) {
      console.error('Error adding/removing friend:', error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.posts}>
        <div className={`${styles.postLeft} ${styles.postBigImage}`}>
          <Image className={styles.image} src={calendar} width={360} height={222} alt="Calendar" />
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
              isFriend ? (
                <div onClick={handleFollow} className={styles.starPosition}>
                  <Image className={styles.star} src={following} width={36} height={36} alt="Following" />
                  <h4>Unfollow</h4>
                </div>
              ) : (
                <div onClick={handleFollow} className={styles.starPosition}>
                  <Image className={styles.star} src={notfollowing} width={36} height={36} alt="Not Following" />
                  <h4>Follow</h4>
                </div>
              )
            ) : (
              <p>Login to Follow</p>
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
        <div className={`${styles.postRight} ${styles.postBigImage}`}>
          <Image className={styles.imageRight} src={post} width={360} height={222} alt="Post" />
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
    </div>
  );
};

export default UserProfile;