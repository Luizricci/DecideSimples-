'use client'
import React from 'react'
import Link from 'next/link'
import { InputNumber, Table, message } from 'antd'
import { FaArrowLeft, FaShare, FaRedo, FaCreditCard, FaChartLine, FaPercentage, FaLightbulb } from 'react-icons/fa'
import { useUrlParams, formatCurrency } from '@/hooks/useCalculator'
import styles from '@/styles/calculator.module.css'

export default function Parcelamento() {
    const { params, updateParam, resetParams, generateShareUrl } = useUrlParams(['v', 'p', 't'])

    const valor = params.v
    const parcelas = params.p
    const taxa = params.t || '0'

    const valorNum = parseFloat(valor) || 0
    const parcelasNum = parseInt(parcelas) || 0
    const taxaNum = parseFloat(taxa) || 0

    // Cálculo com juros compostos (Price)
    const taxaMensal = taxaNum / 100
    let valorParcela = 0
    let totalPago = 0
    let jurosTotal = 0

    if (taxaNum > 0 && parcelasNum > 0 && valorNum > 0) {
        // Fórmula Price: PMT = PV * [i * (1+i)^n] / [(1+i)^n - 1]
        const fator = Math.pow(1 + taxaMensal, parcelasNum)
        valorParcela = valorNum * (taxaMensal * fator) / (fator - 1)
        totalPago = valorParcela * parcelasNum
        jurosTotal = totalPago - valorNum
    } else if (taxaNum === 0 && parcelasNum > 0 && valorNum > 0) {
        // Sem juros
        valorParcela = valorNum / parcelasNum
        totalPago = valorNum
        jurosTotal = 0
    }

    const handleShare = async () => {
        const url = generateShareUrl()
        await navigator.clipboard.writeText(url)
        message.success('Link copiado para a área de transferência!')
    }

    // Tabela de parcelas
    const parcelasData = []
    if (valorNum > 0 && parcelasNum > 0) {
        let saldoDevedor = valorNum
        for (let i = 1; i <= Math.min(parcelasNum, 12); i++) {
            const jurosDoMes = saldoDevedor * taxaMensal
            const amortizacao = valorParcela - jurosDoMes
            saldoDevedor = saldoDevedor - amortizacao
            
            parcelasData.push({
                key: i.toString(),
                parcela: `${i}ª`,
                valor: formatCurrency(valorParcela),
                juros: formatCurrency(jurosDoMes),
                amortizacao: formatCurrency(amortizacao),
                saldo: formatCurrency(Math.max(0, saldoDevedor))
            })
        }
    }

    const columns = [
        { title: 'Parcela', dataIndex: 'parcela', key: 'parcela' },
        { title: 'Valor', dataIndex: 'valor', key: 'valor' },
        { title: 'Juros', dataIndex: 'juros', key: 'juros' },
        { title: 'Amortização', dataIndex: 'amortizacao', key: 'amortizacao' },
        { title: 'Saldo', dataIndex: 'saldo', key: 'saldo' },
    ]

    const showResults = valorNum > 0 && parcelasNum > 0

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <Link href="/Calculadoras" className={styles.backLink}>
                    <FaArrowLeft />
                    <span>Voltar para Calculadoras</span>
                </Link>

                <div className={styles.header}>
                    <div className={styles.headerIcon}>
                        <FaCreditCard />
                    </div>
                    <h1 className={styles.title}>Parcelamento</h1>
                    <p className={styles.subtitle}>
                        Calcule o valor das parcelas e descubra quanto você vai pagar de juros no total.
                    </p>
                </div>

                <div className={styles.form}>
                    <h3 className={styles.formTitle}>Dados do Parcelamento</h3>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Valor Total (R$)</label>
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
                        <label className={styles.label}>Número de Parcelas</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="0"
                            value={parcelas ? parseInt(parcelas) : null}
                            onChange={(value) => updateParam('p', value?.toString() || '')}
                            min={1}
                            max={120}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Taxa de Juros (% ao mês)</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="0 (sem juros)"
                            value={taxa && taxa !== '0' ? parseFloat(taxa) : null}
                            onChange={(value) => updateParam('t', value?.toString() || '0')}
                            min={0}
                            max={100}
                            step={0.1}
                            suffix="%"
                        />
                        <span className={styles.hint}>Deixe 0 para parcelamento sem juros</span>
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
                        <div className={styles.result} style={{ 
                            background: taxaNum > 0 
                                ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' 
                                : 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' 
                        }}>
                            <div className={styles.resultHeader}>
                                <p className={styles.resultLabel}>
                                    Valor da Parcela
                                    {taxaNum === 0 && <span style={{ 
                                        marginLeft: 12, 
                                        background: 'rgba(255,255,255,0.2)', 
                                        padding: '4px 12px', 
                                        borderRadius: 12, 
                                        fontSize: '0.75rem' 
                                    }}>SEM JUROS</span>}
                                </p>
                                <p className={styles.resultValue}>
                                    {parcelasNum}x de {formatCurrency(valorParcela)}
                                </p>
                            </div>
                            
                            <div className={styles.resultGrid}>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Valor Original</p>
                                    <p className={styles.resultItemValue}>{formatCurrency(valorNum)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Total a Pagar</p>
                                    <p className={styles.resultItemValue}>{formatCurrency(totalPago)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Juros Total</p>
                                    <p className={`${styles.resultItemValue} ${taxaNum > 0 ? styles.negative : styles.positive}`}>
                                        {taxaNum > 0 ? '+' : ''}{formatCurrency(jurosTotal)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {taxaNum > 0 && (
                            <div className={styles.tableWrapper}>
                                <h4 className={styles.tableTitle}>
                                    <FaChartLine /> Detalhamento das Parcelas
                                </h4>
                                <Table 
                                    columns={columns} 
                                    dataSource={parcelasData} 
                                    pagination={false}
                                    size="small"
                                    scroll={{ x: true }}
                                />
                                {parcelasNum > 12 && (
                                    <p className={styles.hint} style={{ textAlign: 'center', marginTop: 12 }}>
                                        Mostrando as 12 primeiras parcelas de {parcelasNum}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className={`${styles.decision} ${taxaNum > 0 ? styles.decisionNegative : styles.decisionPositive}`}>
                            <h4 className={styles.decisionTitle}>
                                <FaLightbulb /> O que isso significa?
                            </h4>
                            <p className={styles.decisionText}>
                                {taxaNum > 0 ? (
                                    <>
                                        Você vai pagar <strong>{formatCurrency(jurosTotal)}</strong> de juros, 
                                        o que representa <strong>{((jurosTotal / valorNum) * 100).toFixed(1)}%</strong> do valor original.
                                        {jurosTotal > valorNum * 0.2 && (
                                            <> Considere pagar à vista ou em menos parcelas para economizar.</>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        Excelente! Você encontrou um parcelamento <strong>sem juros</strong>. 
                                        Aproveite para manter o dinheiro rendendo enquanto paga as parcelas.
                                    </>
                                )}
                            </p>
                        </div>

                        <div className={styles.explanation}>
                            <h4 className={styles.explanationTitle}>
                                <FaPercentage /> Dica importante
                            </h4>
                            <p className={styles.explanationText}>
                                {taxaNum > 0 ? (
                                    <>
                                        • Juros de cartão de crédito podem chegar a 15% ao mês<br />
                                        • Parcelamentos com juros acumulam mais do que parece<br />
                                        • Sempre negocie taxas menores ou busque alternativas
                                    </>
                                ) : (
                                    <>
                                        • Parcelamento sem juros é uma forma de crédito grátis<br />
                                        • Invista o valor que sobra para ganhar rendimentos<br />
                                        • Cuidado para não comprometer o orçamento futuro
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
