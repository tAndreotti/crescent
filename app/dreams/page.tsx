"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './dreams.module.scss';
import Image from 'next/image';
import dreams from '../../public/Dreams.png';
import axios from 'axios';

interface Post {
  _id: string;
  title: string;
  text: string;
  // Outras propriedades do post
}

const Dreams = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'https://crescent-api.vercel.app/posts?category=dreams';
    
        if (searchQuery) {
          url += `&search=${searchQuery}`;
        }
    
        const response = await axios.get(url);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, [searchQuery]);

  return (
    <div className={styles.main}>
      <div className={styles.searchParams}>
        <input onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} type="search" name="search" id="search" placeholder='Follow your dreams...' />
      </div>
      <div className={styles.firstPosts}>
        <div className={styles.postsBig}>
          {posts.slice(0, 2).map((post) => (
            <Link href={`dreams/${post._id}`} key={post._id} className={styles.postBig}>
              <h2>{post.title}</h2>
              <p>{post.text}</p>
            </Link>
          ))}
        </div>
        <div className={styles.dreams}>
          <Image src={dreams} width={360} height={480} alt="Dreams" />
          <div className={`${styles.description} ${styles.colorPattern}`}>
            <h2>Dreams</h2>
          </div>
        </div>
        <div className={styles.postsBig}>
          {posts.slice(2, 4).map((post) => (
            <Link href={`dreams/${post._id}`} key={post._id} className={styles.postBig}>
              <h2>{post.title}</h2>
              <p>{post.text}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.posts}>
        {posts.slice(4).map((post, index) => (
          <Link
            href={`dreams/${post._id}`}
            key={post._id}
            className={((index + 1) % 3 === 2) ? styles.post : styles.postBig}
          >
            <h2>{post.title}</h2>
            <p>{post.text}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dreams;