'use client'
import React from 'react'
import styles from './sobre.module.css'
import Link from 'next/link'
import { FaCalculator, FaBook, FaLightbulb, FaLock } from 'react-icons/fa'

const features = [
    {
        icon: <FaCalculator />,
        title: 'Calculadoras Práticas',
        description: 'Ferramentas para juros, parcelamentos, investimentos e muito mais.'
    },
    {
        icon: <FaBook />,
        title: 'Explicações Simples',
        description: 'Cada cálculo vem com explicações em linguagem acessível.'
    },
    {
        icon: <FaLightbulb />,
        title: 'Orientação à Decisão',
        description: 'Não apenas números, mas recomendações práticas para você.'
    },
    {
        icon: <FaLock />,
        title: 'Sem Cadastro',
        description: 'Use todas as ferramentas gratuitamente, sem criar conta.'
    }
]

export default function Sobre() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Sobre o DecideSimples</h1>
                <p className={styles.subtitle}>
                    Ajudando você a tomar decisões financeiras mais inteligentes
                </p>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Nossa Missão</h2>
                <p className={styles.text}>
                    O DecideSimples nasceu com um objetivo claro: democratizar a educação 
                    financeira através de ferramentas simples e acessíveis. Acreditamos que 
                    todos merecem ter acesso a informações claras para tomar melhores decisões 
                    com seu dinheiro.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>O que oferecemos</h2>
                <div className={styles.features}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.feature}>
                            <div className={styles.featureIcon}>{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Por que criamos isso?</h2>
                <p className={styles.text}>
                    Muitas pessoas tomam decisões financeiras sem entender completamente 
                    as implicações. Parcelar ou pagar à vista? Qual investimento é melhor? 
                    Quanto meu dinheiro vai valer no futuro?
                </p>
                <p className={styles.text}>
                    Criamos o DecideSimples para responder essas perguntas de forma clara e 
                    objetiva, sem jargões técnicos ou complicações desnecessárias.
                </p>
            </section>

            <section className={styles.cta}>
                <h2>Pronto para começar?</h2>
                <p>Explore nossas calculadoras e tome decisões mais inteligentes.</p>
                <Link href="/Calculadoras" className={styles.button}>Ver Calculadoras</Link>
            </section>
        </div>
    )
}
