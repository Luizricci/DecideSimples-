'use client'
import React, { useState } from 'react'
import styles from '../styles/header.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div className={styles.container}>
        <Link href="/home" className={styles.logo}>
            <Image src="/logo-Photoroom.png" alt="DecideSimples Logo" width={50} height={50} />
            <h1>DecideSimples</h1>
        </Link>
        
        {/* Hamburger Button - Mobile Only */}
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Menu">
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`}></span>
        </button>

        {/* Desktop Menu */}
        <div className={styles.menu}>
            <ul className={styles.menuItem}>
                <li><a href="/Calculadoras">Calculadoras</a></li>
                <li><a href="/Sobre">Sobre</a></li>
                <li><a href="/Contato">Contato</a></li>
            </ul>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
            <ul className={styles.mobileMenuItem}>
                <li><a href="/Calculadoras" onClick={() => setMenuOpen(false)}>Calculadoras</a></li>
                <li><a href="/Sobre" onClick={() => setMenuOpen(false)}>Sobre</a></li>
                <li><a href="/Contato" onClick={() => setMenuOpen(false)}>Contato</a></li>
            </ul>
        </div>
    </div>
  )
}
