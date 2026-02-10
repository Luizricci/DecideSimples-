'use client'
import React, { useState } from 'react'
import styles from './home.module.css'
import Link from 'next/link'
import { FaBalanceScale, FaChartLine, FaCalendarAlt, FaPiggyBank } from 'react-icons/fa'

const calculadorasDestaque = [
    {
        id: 'juros-compostos',
        icon: <FaBalanceScale />,
        title: 'Juros Compostos',
        description: 'Simule o crescimento do seu dinheiro ao longo do tempo.',
        href: '/Calculadoras/juros-compostos'
    },
    {
        id: 'parcelamento',
        icon: <FaCalendarAlt />,
        title: 'Planejamento',
        description: 'Escolha uma estratégia para atingir metas.',
        href: '/Calculadoras/parcelamento'
    }
]

const calculadorasSecundarias = [
    {
        id: 'juros-compostos',
        icon: <FaChartLine />,
        title: 'Juros Compostos',
        description: 'Simule o crescimento do dinheiro ao longo do tempo.',
        href: '/Calculadoras/juros-compostos'
    },
    {
        id: 'desconto-vista',
        icon: <FaBalanceScale />,
        title: 'Taxas de Anos',
        description: 'Entenda como as taxas de juros afetam seu dinheiro.',
        href: '/Calculadoras/desconto-vista'
    },
    {
        id: 'aportes-mensais',
        icon: <FaPiggyBank />,
        title: 'Aposentadoria',
        description: 'Calcule sua provisão de aposentadoria para se preparar.',
        href: '/Calculadoras/aportes-mensais'
    },
    {
        id: 'inflacao',
        icon: <FaCalendarAlt />,
        title: 'Planejamento',
        description: 'Organize seus próximos passos e metas.',
        href: '/Calculadoras/inflacao'
    }
]

export default function Home() {
    // Estado para a calculadora embutida
    const [valorInicial, setValorInicial] = useState('')
    const [aporteMensal, setAporteMensal] = useState('')
    const [taxaJuros, setTaxaJuros] = useState('')
    const [periodo, setPeriodo] = useState('')

    const valorInicialNum = parseFloat(valorInicial) || 0
    const aporteNum = parseFloat(aporteMensal) || 0
    const taxaNum = parseFloat(taxaJuros) || 0
    const periodoNum = parseFloat(periodo) || 0
    const meses = periodoNum * 12
    const taxaMensal = taxaNum / 100 / 12

    let montanteFinal = 0
    if (meses > 0 && taxaMensal > 0) {
        const fator = Math.pow(1 + taxaMensal, meses)
        const montanteInicial = valorInicialNum * fator
        const montanteAportes = aporteNum * ((fator - 1) / taxaMensal)
        montanteFinal = montanteInicial + montanteAportes
    } else if (meses > 0) {
        montanteFinal = valorInicialNum + (aporteNum * meses)
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1 className={styles.heroTitle}>
                            Decisões Financeiras<br />
                            Mais Inteligentes.
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Calcule, compare e planeje seu<br />
                            futuro financeiro com confiança.
                        </p>
                        <Link href="/Calculadoras" className={styles.heroButton}>
                            Comece Agora
                        </Link>
                    </div>

                    <div className={styles.heroCards}>
                        {calculadorasDestaque.map((calc) => (
                            <Link key={calc.id} href={calc.href} className={styles.heroCard}>
                                <div className={styles.heroCardIcon}>{calc.icon}</div>
                                <div className={styles.heroCardContent}>
                                    <h3 className={styles.heroCardTitle}>{calc.title}</h3>
                                    <p className={styles.heroCardDesc}>{calc.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ferramentas Populares */}
            <section className={styles.ferramentas}>
                <div className={styles.ferramentasContent}>
                    <h2 className={styles.sectionTitle}>Finanças: Superior</h2>
                    
                    <div className={styles.ferramentasGrid}>
                        {calculadorasSecundarias.map((calc) => (
                            <Link key={calc.id} href={calc.href} className={styles.ferramentaCard}>
                                <div className={styles.ferramentaIcon}>{calc.icon}</div>
                                <h3 className={styles.ferramentaTitle}>{calc.title}</h3>
                                <p className={styles.ferramentaDesc}>{calc.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Calculadora Embutida */}
            <section className={styles.calculadoraSection}>
                <div className={styles.calculadoraContent}>
                    <h2 className={styles.sectionTitleLeft}>Calculadora de Juros Compostos</h2>
                    
                    <div className={styles.calculadoraWrapper}>
                        <div className={styles.calculadoraForm}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Valor Inicial (R$)</label>
                                    <input 
                                        type="number" 
                                        placeholder="0"
                                        value={valorInicial}
                                        onChange={(e) => setValorInicial(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Taxa de Juros (%)</label>
                                    <input 
                                        type="number" 
                                        placeholder="0"
                                        value={taxaJuros}
                                        onChange={(e) => setTaxaJuros(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Período (anos)</label>
                                    <input 
                                        type="number" 
                                        placeholder="0"
                                        value={periodo}
                                        onChange={(e) => setPeriodo(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Aporte Mensal (R$)</label>
                                    <input 
                                        type="number" 
                                        placeholder="0"
                                        value={aporteMensal}
                                        onChange={(e) => setAporteMensal(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.resultPreview}>
                                <span className={styles.resultLabel}>
                                    Em {periodoNum || 0} anos, seu investimento total será:
                                </span>
                                <span className={styles.resultValue}>
                                    {formatCurrency(montanteFinal)}
                                </span>
                            </div>

                            <Link href="/Calculadoras/juros-compostos" className={styles.calcButton}>
                                Calcular
                            </Link>
                        </div>

                        <div className={styles.calculadoraResultado}>
                            <h3>Resultado</h3>
                            <div className={styles.resultadoBox}>
                                <div className={styles.resultadoItem}>
                                    <span className={styles.resultadoLabel}>Valor Investido</span>
                                    <span className={styles.resultadoValor}>
                                        {formatCurrency(valorInicialNum + (aporteNum * meses))}
                                    </span>
                                </div>
                                <div className={styles.resultadoItem}>
                                    <span className={styles.resultadoLabel}>Juros Ganhos</span>
                                    <span className={styles.resultadoValorGreen}>
                                        +{formatCurrency(montanteFinal - (valorInicialNum + (aporteNum * meses)))}
                                    </span>
                                </div>
                                <div className={styles.resultadoItem}>
                                    <span className={styles.resultadoLabel}>Total Final</span>
                                    <span className={styles.resultadoValorBig}>
                                        {formatCurrency(montanteFinal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
