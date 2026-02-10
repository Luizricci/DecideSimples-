'use client'
import React from 'react'
import Link from 'next/link'
import styles from './calculadoras.module.css'
import { FaChartLine, FaChartBar, FaCreditCard, FaPercentage, FaBullseye, FaBalanceScale, FaChartArea } from 'react-icons/fa'

const calculadorasFinanceiras = [
    {
        id: 'juros-simples',
        icon: <FaChartBar />,
        title: 'Juros Simples',
        description: 'Calcule o valor final de uma aplicação ou dívida com taxa de juros simples.',
        href: '/Calculadoras/juros-simples'
    },
    {
        id: 'juros-compostos',
        icon: <FaChartLine />,
        title: 'Juros Compostos',
        description: 'Descubra o poder dos juros sobre juros. Essencial para investimentos.',
        href: '/Calculadoras/juros-compostos'
    },
    {
        id: 'parcelamento',
        icon: <FaCreditCard />,
        title: 'Parcelamento',
        description: 'Compare o custo real de parcelar com e sem juros.',
        href: '/Calculadoras/parcelamento'
    },
    {
        id: 'desconto-vista',
        icon: <FaPercentage />,
        title: 'Desconto à Vista',
        description: 'Calcule se vale mais pagar à vista com desconto ou parcelar.',
        href: '/Calculadoras/desconto-vista'
    }
]

const calculadorasInvestimentos = [
    {
        id: 'aportes-mensais',
        icon: <FaBullseye />,
        title: 'Aportes Mensais',
        description: 'Simule quanto seu dinheiro pode render com aportes regulares.',
        href: '/Calculadoras/aportes-mensais'
    },
    {
        id: 'comparador-investimentos',
        icon: <FaBalanceScale />,
        title: 'Comparador de Investimentos',
        description: 'Compare Poupança, CDB e Tesouro Selic lado a lado.',
        href: '/Calculadoras/comparador-investimentos'
    },
    {
        id: 'inflacao',
        icon: <FaChartArea />,
        title: 'Impacto da Inflação',
        description: 'Entenda quanto seu dinheiro perde de poder de compra.',
        href: '/Calculadoras/inflacao'
    }
]

export default function Calculadoras() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Calculadoras Financeiras</h1>
                <p className={styles.subtitle}>
                    Ferramentas simples e explicativas para ajudar você a tomar decisões 
                    financeiras mais inteligentes.
                </p>
            </header>

            {/* Módulo 1 - Calculadoras Financeiras Básicas */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>💼</span>
                    Calculadoras Financeiras
                </h2>
                <div className={styles.grid}>
                    {calculadorasFinanceiras.map((calc) => (
                        <Link key={calc.id} href={calc.href} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>{calc.icon}</div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{calc.title}</h3>
                                    <p className={styles.cardDescription}>{calc.description}</p>
                                </div>
                            </div>
                            <div className={styles.cardFooter}>
                                Calcular agora
                                <span className={styles.cardArrow}>→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Módulo 2 - Calculadoras de Investimentos */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>📊</span>
                    Calculadoras de Investimentos
                </h2>
                <div className={styles.grid}>
                    {calculadorasInvestimentos.map((calc) => (
                        <Link key={calc.id} href={calc.href} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>{calc.icon}</div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{calc.title}</h3>
                                    <p className={styles.cardDescription}>{calc.description}</p>
                                </div>
                            </div>
                            <div className={styles.cardFooter}>
                                Calcular agora
                                <span className={styles.cardArrow}>→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}
