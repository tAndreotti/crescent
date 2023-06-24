"use client"
import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.scss';
import Image from 'next/image';
import dreams from '../public/Dreams.png';
import nightmares from '../public/Nightmares.png';
import arrow from '../public/Arrow.png';

export default function Home() {
  const [isHoveredRight, setIsHoveredRight] = useState(false);
  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const [isHoveredBottom, setIsHoveredBottom] = useState(false);

  const handleMouseEnterRight = () => {
    setIsHoveredRight(true);
  };

  const handleMouseLeaveRight = () => {
    setIsHoveredRight(false);
  };

  const handleMouseEnterLeft = () => {
    setIsHoveredLeft(true);
  };

  const handleMouseLeaveLeft = () => {
    setIsHoveredLeft(false);
  };

  const handleMouseEnterBottom = () => {
    setIsHoveredBottom(true);
  };

  const handleMouseLeaveBottom = () => {
    setIsHoveredBottom(false);
  };

  return (
    <main className={styles.main}>
      <div className={styles.text}>
        <h3>
          &ldquo;The darkness of the night becomes a stage for an ethereal symphony, <br />
          where the boundary between the real and the unknown dissolves <br />
          in the embrace of twilight&ldquo;
        </h3>
      </div>
      <div className={styles.cards}>
        <div onMouseEnter={handleMouseEnterLeft} onMouseLeave={handleMouseLeaveLeft} className={styles.card}>
          <Link href="/dreams"><Image src={dreams} width={360} height={480} alt="Dreams" /></Link>
          <div className={styles.description}>
            <h2>DREAMS</h2>
            <p>In a whirlwind of thoughts and desires, dreams emerge like shimmering stars, illuminating the darkness of the night.</p>
            <Link href="/dreams"><button>Dreams</button></Link>
          </div>
        </div>
        <div className={`${styles.arrow} ${isHoveredRight ? styles.hoveredRight : ""} ${isHoveredLeft ? styles.hoveredLeft : ""} ${isHoveredBottom ? styles.hoveredBottom : ""}`}>
          <Image src={arrow} width={88} height={88} alt="Arrow" />
        </div>
        <div onMouseEnter={handleMouseEnterRight} onMouseLeave={handleMouseLeaveRight} className={styles.card}>
          <Link href="/nightmares"><Image src={nightmares} width={360} height={480} alt="Nightmares" priority={true} /></Link>
          <div className={`${styles.description} ${styles.colorPattern}`}>
            <h2>Nightmares</h2>
            <p>The unknown composes a melody that resonates in our souls, where despair wanders like a silent scream in the darkness.</p>
            <Link href="/nightmares"><button>NIGHTMARES</button></Link>
          </div>
        </div>
      </div>
      <div onMouseEnter={handleMouseEnterBottom} onMouseLeave={handleMouseLeaveBottom} className={styles.explore}>
        <h4>Uncover what your dreams are trying to tell you:</h4>
        <Link href="/meanings"><button>EXPLORE THEIR MEANING</button></Link>
      </div>
    </main>
  )
}
