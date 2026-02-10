'use client'
import React from 'react'
import Link from 'next/link'
import { InputNumber, message } from 'antd'
import { FaArrowLeft, FaShare, FaRedo, FaTag, FaMoneyBillWave, FaCreditCard, FaCheck, FaPercentage } from 'react-icons/fa'
import { useUrlParams, formatCurrency } from '@/hooks/useCalculator'
import styles from '@/styles/calculator.module.css'

export default function DescontoVista() {
    const { params, updateParam, resetParams, generateShareUrl } = useUrlParams(['v', 'd', 'p', 'r'])

    const valor = params.v
    const desconto = params.d
    const parcelas = params.p
    const rendimento = params.r || '1'

    const valorNum = parseFloat(valor) || 0
    const descontoNum = parseFloat(desconto) || 0
    const parcelasNum = parseInt(parcelas) || 0
    const rendimentoNum = parseFloat(rendimento) || 1

    // Valor à vista com desconto
    const valorVista = valorNum * (1 - descontoNum / 100)
    const economiaDesconto = valorNum - valorVista

    // Valor da parcela (sem juros)
    const valorParcela = parcelasNum > 0 ? valorNum / parcelasNum : 0

    // Se investir a diferença, quanto teria ao final?
    const taxaMensal = rendimentoNum / 100
    let valorInvestido = 0
    let rendimentoTotal = 0

    if (parcelasNum > 0 && valorVista > 0) {
        // Valor que sobra por mês investindo
        const sobraPorMes = valorParcela
        
        // Simula investir a diferença mês a mês
        for (let i = parcelasNum - 1; i >= 0; i--) {
            valorInvestido += sobraPorMes * Math.pow(1 + taxaMensal, i)
        }
        rendimentoTotal = valorInvestido - valorNum
    }

    // Decisão: qual vale mais a pena?
    const diferencaFinal = economiaDesconto - (valorInvestido - valorNum)
    const vistaVale = economiaDesconto > (valorInvestido - valorNum)

    const handleShare = async () => {
        const url = generateShareUrl()
        await navigator.clipboard.writeText(url)
        message.success('Link copiado para a área de transferência!')
    }

    const showResults = valorNum > 0 && descontoNum > 0 && parcelasNum > 0

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <Link href="/Calculadoras" className={styles.backLink}>
                    <FaArrowLeft />
                    <span>Voltar para Calculadoras</span>
                </Link>

                <div className={styles.header}>
                    <div className={styles.headerIcon}>
                        <FaTag />
                    </div>
                    <h1 className={styles.title}>Desconto à Vista</h1>
                    <p className={styles.subtitle}>
                        Descubra se vale mais a pena pagar à vista com desconto ou parcelar 
                        sem juros e investir a diferença.
                    </p>
                </div>

                <div className={styles.form}>
                    <h3 className={styles.formTitle}>Compare as opções</h3>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Valor do Produto (R$)</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="0,00"
                            value={valor ? parseFloat(valor) : null}
                            onChange={(value) => updateParam('v', value?.toString() || '')}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                            parser={(value) => value.replace(/\./g, '')}
                            min={0}
                            prefix="R$"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Desconto à Vista (%)</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="0"
                            value={desconto ? parseFloat(desconto) : null}
                            onChange={(value) => updateParam('d', value?.toString() || '')}
                            min={0}
                            max={100}
                            step={0.5}
                            suffix="%"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Parcelas sem Juros</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="0"
                            value={parcelas ? parseInt(parcelas) : null}
                            onChange={(value) => updateParam('p', value?.toString() || '')}
                            min={1}
                            max={24}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Rendimento do seu dinheiro (% ao mês)</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="1"
                            value={rendimento ? parseFloat(rendimento) : 1}
                            onChange={(value) => updateParam('r', value?.toString() || '1')}
                            min={0}
                            max={10}
                            step={0.1}
                            suffix="%"
                        />
                        <span className={styles.hint}>CDI atual ≈ 1% a.m. | Poupança ≈ 0,5% a.m.</span>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button className={styles.buttonReset} onClick={resetParams}>
                            <FaRedo style={{ marginRight: 8 }} />
                            Limpar
                        </button>
                        {showResults && (
                            <button className={styles.buttonShare} onClick={handleShare}>
                                <FaShare />
                                Compartilhar
                            </button>
                        )}
                    </div>
                </div>

                {showResults && (
                    <>
                        <div className={styles.statsGrid}>
                            <div className={`${styles.statCard} ${vistaVale ? styles.statCardWinner : ''}`}>
                                <div className={styles.statCardIcon}>
                                    <FaMoneyBillWave />
                                </div>
                                {vistaVale && <span className={styles.winnerBadge}><FaCheck /> MELHOR OPÇÃO</span>}
                                <p className={styles.statCardLabel}>À Vista</p>
                                <p className={`${styles.statCardValue} ${vistaVale ? styles.statCardPositive : ''}`}>
                                    {formatCurrency(valorVista)}
                                </p>
                                <p className={styles.statCardLabel}>
                                    Economia: {formatCurrency(economiaDesconto)} ({descontoNum}%)
                                </p>
                            </div>

                            <div className={`${styles.statCard} ${!vistaVale ? styles.statCardWinner : ''}`}>
                                <div className={styles.statCardIcon}>
                                    <FaCreditCard />
                                </div>
                                {!vistaVale && <span className={styles.winnerBadge}><FaCheck /> MELHOR OPÇÃO</span>}
                                <p className={styles.statCardLabel}>Parcelado + Investir</p>
                                <p className={`${styles.statCardValue} ${!vistaVale ? styles.statCardPositive : ''}`}>
                                    {parcelasNum}x {formatCurrency(valorParcela)}
                                </p>
                                <p className={styles.statCardLabel}>
                                    Rendimento: {formatCurrency(rendimentoTotal)} ({rendimentoNum}% a.m.)
                                </p>
                            </div>
                        </div>

                        <div className={styles.result}>
                            <div className={styles.resultHeader}>
                                <p className={styles.resultLabel}>Resumo da Análise</p>
                                <p className={styles.resultValue}>
                                    {vistaVale ? 'Vista ganha ' : 'Parcelar ganha '}
                                    {formatCurrency(Math.abs(diferencaFinal))}
                                </p>
                            </div>
                            
                            <div className={styles.resultGrid}>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Economia à Vista</p>
                                    <p className={`${styles.resultItemValue} ${styles.positive}`}>
                                        {formatCurrency(economiaDesconto)}
                                    </p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Rendimento Investindo</p>
                                    <p className={`${styles.resultItemValue} ${styles.positive}`}>
                                        {formatCurrency(rendimentoTotal)}
                                    </p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Diferença</p>
                                    <p className={styles.resultItemValue}>
                                        {formatCurrency(Math.abs(diferencaFinal))}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.decision} ${vistaVale ? styles.decisionPositive : ''}`}>
                            <h4 className={styles.decisionTitle}>💡 Recomendação</h4>
                            <p className={styles.decisionText}>
                                {vistaVale ? (
                                    <>
                                        <strong>Pague à vista!</strong> O desconto de {descontoNum}% supera o rendimento 
                                        que você teria investindo. Você economiza <strong>{formatCurrency(Math.abs(diferencaFinal))}</strong> pagando à vista.
                                    </>
                                ) : (
                                    <>
                                        <strong>Parcele e invista!</strong> Com rendimento de {rendimentoNum}% a.m., 
                                        você ganha mais investindo do que o desconto oferecido. 
                                        Vantagem de <strong>{formatCurrency(Math.abs(diferencaFinal))}</strong>.
                                    </>
                                )}
                            </p>
                        </div>

                        <div className={styles.explanation}>
                            <h4 className={styles.explanationTitle}>
                                <FaPercentage /> Importante considerar
                            </h4>
                            <p className={styles.explanationText}>
                                • O cálculo assume que você realmente vai investir a diferença<br />
                                • Considere o risco: investimentos podem render menos que o esperado<br />
                                • Pagar à vista elimina a preocupação com parcelas futuras
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
