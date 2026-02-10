import React from 'react'
import styles from '../styles/header.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <div className={styles.container}>
        <Link href="/home" className={styles.logo}>
            <Image src="/logo-Photoroom.png" alt="DecideSimples Logo" width={50} height={50} />
            <h1>DecideSimples</h1>
        </Link>
        <div className={styles.menu}>
            <ul className={styles.menuItem}>
                <li><a href="/Calculadoras">Calculadoras</a></li>
                <li><a href="/Sobre">Sobre</a></li>
                <li><a href="/Contato">Contato</a></li>
            </ul>
        </div>
    </div>
  )
}
