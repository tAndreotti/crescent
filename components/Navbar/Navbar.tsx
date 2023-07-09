"use client";
import React, { useContext, useState } from 'react';
import styles from './Navbar.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import moon from '../../public/Luna.png';
import burgr from '../../public/Burgr.png';
import { usePathname } from 'next/navigation';
import { AuthContext } from '@/app/context/store';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const isLoggedIn = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  
  const handleLogout = async () => {
    try {
      const response = await axios.post('https://crescent-cmxzospgf-tandreotti.vercel.app/auth/logout', null, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        console.log(response.data.msg); // Mensagem de sucesso
        // Atualizar o estado de autenticação para false (usuário deslogado)
        if (isLoggedIn && isLoggedIn.updateIsLoggedIn) {
          isLoggedIn.updateIsLoggedIn(false);
        }
        // Redirecionar o usuário para a página de login ou outra página desejada
        router.push('/login');
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
    <>
    <div className={styles.lilNavbar}>
      <Image onClick={() => setShowMenu(!showMenu)} className={styles.burgr} src={burgr} width={24} height={20} alt="Menu" />
      <div className={styles.burgr}></div>
      <div className={styles.lilogo}>
        <Link href="/"><Image src={moon} width={60} height={60} alt="Home" /></Link>
      </div>
      <div className={styles.logo}>
        <Link href="/"><Image src={moon} width={80} height={80} alt="Home" /></Link>
      </div>
    </div>
    <nav className={`${styles.navbar} ${showMenu && styles.showMenu}`}>
      <div className={styles.nav}>
        <Link href="/" className={`${styles.navStyle} ${pathname === "/" && styles.active}`}>
          <h5>Home</h5>
        </Link>
        <Link href="/dreams" className={`${styles.navStyle} ${pathname === "/dreams" && styles.active}`}>
          <h5>Dreams</h5>
        </Link>
        <Link href="/nightmares" className={`${styles.navStyle} ${pathname === "/nightmares" && styles.active}`}>
          <h5>Nightmares</h5>
        </Link>
      </div>
      <div className={styles.logo}>
        <Link href="/"><Image src={moon} width={80} height={80} alt="Home" /></Link>
      </div>
      <div className={styles.nav}>
        <Link href="/meanings" className={`${styles.navStyle} ${pathname === "/meanings" && styles.active}`}>
          <h5>Meanings</h5>
        </Link>
        {isLoggedIn && isLoggedIn.isLoggedIn ? (
          <>
            <Link href="/post" className={`${styles.navStyle} ${pathname === "/post" && styles.active}`}>
              <h5>Post</h5>
            </Link>
            <Link href="/profile" className={`${styles.navStyle} ${pathname === "/profile" && styles.active}`}>
              <h5>My Posts</h5>
            </Link>
            <button onClick={handleLogout} className={`${styles.navStyle}`}>
              <h5>Logout</h5>
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={`${styles.navStyle} ${pathname === "/login" && styles.active}`}>
              <h5>Login</h5>
            </Link>
            <Link href="/signup" className={`${styles.navStyleInverse} ${pathname === "/signup" && styles.active}`}>
              <h5>Sign Up</h5>
            </Link>
          </>
        )}
      </div>
    </nav>
    </>
  )
}

export default Navbar;