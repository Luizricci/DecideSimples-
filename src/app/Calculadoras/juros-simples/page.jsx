'use client'
import React from 'react'
import Link from 'next/link'
import { InputNumber, Select, message } from 'antd'
import { FaArrowLeft, FaShare, FaRedo, FaChartBar, FaLightbulb } from 'react-icons/fa'
import { useUrlParams, formatCurrency } from '@/hooks/useCalculator'
import styles from '@/styles/calculator.module.css'

export default function JurosSimples() {
    const { params, updateParam, resetParams, generateShareUrl } = useUrlParams(['c', 't', 'p', 'tp'])

    const capital = params.c
    const taxa = params.t
    const periodo = params.p
    const tipoPeriodo = params.tp || 'meses'

    const capitalNum = parseFloat(capital) || 0
    const taxaNum = parseFloat(taxa) || 0
    const periodoNum = parseFloat(periodo) || 0

    // Cálculo de juros simples: J = C * i * n
    const taxaMensal = taxaNum / 100
    const juros = capitalNum * taxaMensal * periodoNum
    const montante = capitalNum + juros

    const handleShare = async () => {
        const url = generateShareUrl()
        await navigator.clipboard.writeText(url)
        message.success('Link copiado para a área de transferência!')
    }

    const showResults = capitalNum > 0 && taxaNum > 0 && periodoNum > 0

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <Link href="/Calculadoras" className={styles.backLink}>
                    <FaArrowLeft /> Voltar para Calculadoras
                </Link>

                <header className={styles.header}>
                    <div className={styles.headerIcon}>
                        <FaChartBar />
                    </div>
                    <h1 className={styles.title}>Juros Simples</h1>
                    <p className={styles.subtitle}>
                        Calcule o valor dos juros e o montante final de uma aplicação ou dívida 
                        com taxa de juros simples.
                    </p>
                </header>

                <div className={styles.form}>
                    <h2 className={styles.formTitle}>Dados do Cálculo</h2>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Capital Inicial (R$)</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="0,00"
                            value={capital ? parseFloat(capital) : null}
                            onChange={(value) => updateParam('c', value?.toString() || '')}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                            parser={(value) => value.replace(/\./g, '')}
                            min={0}
                            prefix="R$"
                        />
                        <span className={styles.hint}>Valor inicial do empréstimo ou investimento</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Taxa de Juros (% ao mês)</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="0"
                            value={taxa ? parseFloat(taxa) : null}
                            onChange={(value) => updateParam('t', value?.toString() || '')}
                            min={0}
                            max={100}
                            step={0.1}
                            suffix="%"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Período</label>
                        <div className={styles.inputRow}>
                            <InputNumber
                                style={{ flex: 1 }}
                                size="large"
                                placeholder="0"
                                value={periodo ? parseFloat(periodo) : null}
                                onChange={(value) => updateParam('p', value?.toString() || '')}
                                min={0}
                            />
                            <Select
                                size="large"
                                style={{ width: 150 }}
                                value={tipoPeriodo}
                                onChange={(value) => updateParam('tp', value)}
                                options={[
                                    { value: 'meses', label: 'Meses' },
                                    { value: 'anos', label: 'Anos' },
                                ]}
                            />
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button className={styles.buttonReset} onClick={resetParams}>
                            <FaRedo /> Limpar
                        </button>
                    </div>
                </div>

                {showResults && (
                    <>
                        <div className={styles.result}>
                            <div className={styles.resultHeader}>
                                <p className={styles.resultLabel}>Montante Final</p>
                                <p className={styles.resultValue}>{formatCurrency(montante)}</p>
                            </div>
                            
                            <div className={styles.resultGrid}>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Capital</p>
                                    <p className={styles.resultItemValue}>{formatCurrency(capitalNum)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Juros</p>
                                    <p className={`${styles.resultItemValue} ${styles.positive}`}>+{formatCurrency(juros)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Período</p>
                                    <p className={styles.resultItemValue}>{periodoNum} {tipoPeriodo}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Taxa</p>
                                    <p className={styles.resultItemValue}>{taxaNum}% a.m.</p>
                                </div>
                            </div>

                            <button className={styles.shareButton} onClick={handleShare}>
                                <FaShare /> Compartilhar resultado
                            </button>
                        </div>

                        <div className={styles.explanation}>
                            <h3 className={styles.explanationTitle}>
                                <FaChartBar /> Como calculamos
                            </h3>
                            <p className={styles.explanationText}>
                                No <strong>juros simples</strong>, os juros são calculados sempre sobre o valor 
                                inicial (capital). Diferente dos juros compostos, aqui os juros não se acumulam.
                            </p>
                            <div className={styles.formula}>
                                J = C × i × n → J = {formatCurrency(capitalNum)} × {taxaNum}% × {periodoNum} = {formatCurrency(juros)}
                            </div>
                            <p className={styles.explanationText}>
                                <strong>Onde:</strong> J = Juros, C = Capital inicial, i = Taxa de juros, n = Número de períodos
                            </p>
                        </div>

                        <div className={styles.decision}>
                            <h3 className={styles.decisionTitle}>
                                <FaLightbulb /> O que isso significa?
                            </h3>
                            <p className={styles.decisionText}>
                                {juros > capitalNum * 0.3 ? (
                                    <>
                                        Os juros representam <strong>{((juros / capitalNum) * 100).toFixed(1)}%</strong> do valor inicial. 
                                        Isso é significativo! Se for uma dívida, vale a pena buscar alternativas com juros menores.
                                    </>
                                ) : (
                                    <>
                                        Os juros representam <strong>{((juros / capitalNum) * 100).toFixed(1)}%</strong> do valor inicial. 
                                        A taxa está dentro de um patamar razoável.
                                    </>
                                )}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
