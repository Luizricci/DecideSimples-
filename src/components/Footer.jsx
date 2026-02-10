import React from 'react'
import styles from '../styles/footer.module.css'


export default function Footer() {
  return (
    <footer className={styles.container}>
        <div className={styles.content}>
            <div className={styles.section}>
                <h3>DecideSimples</h3>
                <p>Ferramentas e calculadoras para ajudar você a tomar decisões mais inteligentes no dia a dia.</p>
            </div>

            <div className={styles.section}>
                <h3>Navegação</h3>
                <ul className={styles.links}>
                    <li><a href="/home">Início</a></li>
                    <li><a href="/calculadoras">Calculadoras</a></li>
                    <li><a href="/sobre">Sobre</a></li>
                    <li><a href="/contato">Contato</a></li>
                </ul>
            </div>
        </div>

        <hr className={styles.divider} />
        <div className={styles.bottom}>
            <p className={styles.copyright}>© 2026 DecideSimples. Todos os direitos reservados.</p>
            <div className={styles.bottomLinks}>
                <a href="/privacidade">Privacidade</a>
                <a href="/termos">Termos de Uso</a>
            </div>
        </div>
    </footer>
  )
}
