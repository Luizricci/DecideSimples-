'use client'
import React from 'react'
import Link from 'next/link'
import { InputNumber, Select, Table, message } from 'antd'
import { FaArrowLeft, FaShare, FaRedo, FaChartLine, FaPercentage, FaLightbulb } from 'react-icons/fa'
import { useUrlParams, formatCurrency } from '@/hooks/useCalculator'
import styles from '@/styles/calculator.module.css'

export default function JurosCompostos() {
    const { params, updateParam, resetParams, generateShareUrl } = useUrlParams(['c', 't', 'p', 'tp'])

    const capital = params.c
    const taxa = params.t
    const periodo = params.p
    const tipoPeriodo = params.tp || 'meses'

    const capitalNum = parseFloat(capital) || 0
    const taxaNum = parseFloat(taxa) || 0
    let periodoNum = parseFloat(periodo) || 0

    // Converte anos para meses se necessário
    if (tipoPeriodo === 'anos') {
        periodoNum = periodoNum * 12
    }

    // Taxa mensal em decimal
    const taxaMensal = taxaNum / 100
    
    // Cálculo de juros compostos: M = C * (1 + i)^n
    const montante = capitalNum * Math.pow(1 + taxaMensal, periodoNum)
    const juros = montante - capitalNum
    const rentabilidade = capitalNum > 0 ? ((montante - capitalNum) / capitalNum) * 100 : 0

    const handleShare = async () => {
        const url = generateShareUrl()
        await navigator.clipboard.writeText(url)
        message.success('Link copiado para a área de transferência!')
    }

    // Dados para mostrar evolução
    const evolucao = []
    if (capitalNum > 0 && taxaNum > 0 && periodoNum > 0) {
        for (let i = 0; i <= Math.min(periodoNum, 12); i++) {
            const valor = capitalNum * Math.pow(1 + taxaMensal, i)
            const jurosDoMes = i > 0 ? valor - capitalNum * Math.pow(1 + taxaMensal, i - 1) : 0
            evolucao.push({ 
                key: i.toString(),
                periodo: i, 
                valor: formatCurrency(valor),
                juros: i > 0 ? `+ ${formatCurrency(jurosDoMes)}` : '-'
            })
        }
    }

    const columns = [
        { title: 'Mês', dataIndex: 'periodo', key: 'periodo' },
        { title: 'Valor Acumulado', dataIndex: 'valor', key: 'valor' },
        { title: 'Juros do Período', dataIndex: 'juros', key: 'juros' },
    ]

    const showResults = capitalNum > 0 && taxaNum > 0 && periodoNum > 0

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <Link href="/Calculadoras" className={styles.backLink}>
                    <FaArrowLeft /> Voltar para Calculadoras
                </Link>

                <header className={styles.header}>
                    <div className={styles.headerIcon}>
                        <FaChartLine />
                    </div>
                    <h1 className={styles.title}>Juros Compostos</h1>
                    <p className={styles.subtitle}>
                        Descubra o poder dos juros sobre juros e veja como seu dinheiro pode crescer 
                        exponencialmente ao longo do tempo.
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
                        <span className={styles.hint}>Valor inicial do investimento</span>
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
                        {showResults && (
                            <button className={styles.buttonShare} onClick={handleShare}>
                                <FaShare /> Compartilhar
                            </button>
                        )}
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
                                    <p className={styles.resultItemLabel}>Juros Acumulados</p>
                                    <p className={`${styles.resultItemValue} ${styles.positive}`}>+{formatCurrency(juros)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Rentabilidade</p>
                                    <p className={`${styles.resultItemValue} ${styles.positive}`}>+{rentabilidade.toFixed(2)}%</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Período</p>
                                    <p className={styles.resultItemValue}>{periodoNum} meses</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.tableWrapper}>
                            <h3 className={styles.tableTitle}>
                                <FaChartLine /> Evolução Mês a Mês
                            </h3>
                            <Table 
                                columns={columns} 
                                dataSource={evolucao} 
                                pagination={false}
                                size="small"
                            />
                        </div>

                        <div className={styles.explanation}>
                            <h3 className={styles.explanationTitle}>
                                <FaPercentage /> O poder dos juros compostos
                            </h3>
                            <p className={styles.explanationText}>
                                Nos <strong>juros compostos</strong>, os juros são calculados sobre o montante 
                                acumulado (capital + juros anteriores). É o famoso efeito &ldquo;bola de neve&rdquo; que faz 
                                seu dinheiro crescer exponencialmente.
                            </p>
                            <div className={styles.formula}>
                                M = C × (1 + i)^n = {formatCurrency(capitalNum)} × (1 + {taxaNum}%)^{periodoNum} = {formatCurrency(montante)}
                            </div>
                        </div>

                        <div className={`${styles.decision} ${styles.decisionPositive}`}>
                            <h3 className={styles.decisionTitle}>
                                <FaLightbulb /> O que isso significa?
                            </h3>
                            <p className={styles.decisionText}>
                                {rentabilidade > 100 ? (
                                    <>
                                        Seu dinheiro mais que dobrou! A rentabilidade de <strong>{rentabilidade.toFixed(1)}%</strong> mostra 
                                        o poder do tempo nos juros compostos. Continue investindo de forma consistente.
                                    </>
                                ) : (
                                    <>
                                        Sua rentabilidade foi de <strong>{rentabilidade.toFixed(1)}%</strong>. 
                                        Considere aumentar o prazo ou buscar taxas maiores para potencializar os ganhos.
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
