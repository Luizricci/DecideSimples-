'use client'
import React from 'react'
import Link from 'next/link'
import { InputNumber, Select, Table, message } from 'antd'
import { FaArrowLeft, FaShare, FaRedo, FaChartLine, FaArrowDown, FaArrowUp, FaLightbulb } from 'react-icons/fa'
import { useUrlParams, formatCurrency } from '@/hooks/useCalculator'
import styles from '@/styles/calculator.module.css'

export default function Inflacao() {
    const { params, updateParam, resetParams, generateShareUrl } = useUrlParams(['v', 'i', 'p', 'tp'])

    const valor = params.v
    const inflacao = params.i || '0.5'
    const periodo = params.p
    const tipoPeriodo = params.tp || 'anos'

    const valorNum = parseFloat(valor) || 0
    const inflacaoNum = parseFloat(inflacao) || 0.5
    let periodoNum = parseFloat(periodo) || 0

    // Converte anos para meses
    const periodoMeses = tipoPeriodo === 'anos' ? periodoNum * 12 : periodoNum

    // Taxa mensal em decimal
    const taxaMensal = inflacaoNum / 100

    // Poder de compra futuro: valor / (1 + inflação)^n
    const valorFuturo = valorNum / Math.pow(1 + taxaMensal, periodoMeses)
    const perdaPoder = valorNum - valorFuturo
    const perdaPercent = valorNum > 0 ? (perdaPoder / valorNum) * 100 : 0

    // Quanto você precisaria para manter o poder de compra
    const valorNecessario = valorNum * Math.pow(1 + taxaMensal, periodoMeses)
    const acrescimoNecessario = valorNecessario - valorNum

    const handleShare = async () => {
        const url = generateShareUrl()
        await navigator.clipboard.writeText(url)
        message.success('Link copiado para a área de transferência!')
    }

    // Evolução da perda de poder de compra
    const evolucao = []
    if (valorNum > 0 && periodoMeses > 0) {
        const anos = Math.min(Math.ceil(periodoMeses / 12), 10)
        for (let ano = 0; ano <= anos; ano++) {
            const meses = ano * 12
            const valorAtual = valorNum / Math.pow(1 + taxaMensal, meses)
            const perda = valorNum - valorAtual
            
            evolucao.push({
                key: ano.toString(),
                ano: `Ano ${ano}`,
                valorReal: formatCurrency(valorAtual),
                perda: formatCurrency(perda),
                perdaPercent: `${((perda / valorNum) * 100).toFixed(1)}%`
            })
        }
    }

    const columns = [
        { title: 'Período', dataIndex: 'ano', key: 'ano' },
        { title: 'Poder de Compra', dataIndex: 'valorReal', key: 'valorReal' },
        { title: 'Perda', dataIndex: 'perda', key: 'perda' },
        { title: 'Perda %', dataIndex: 'perdaPercent', key: 'perdaPercent' },
    ]

    const showResults = valorNum > 0 && periodoNum > 0

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <Link href="/Calculadoras" className={styles.backLink}>
                    <FaArrowLeft />
                    <span>Voltar para Calculadoras</span>
                </Link>

                <div className={styles.header}>
                    <div className={styles.headerIcon}>
                        <FaChartLine />
                    </div>
                    <h1 className={styles.title}>Impacto da Inflação</h1>
                    <p className={styles.subtitle}>
                        Descubra como a inflação corroi o poder de compra do seu dinheiro ao longo do tempo 
                        e quanto você precisa ter para manter seu padrão.
                    </p>
                </div>

                <div className={styles.form}>
                    <h3 className={styles.formTitle}>Simule o Impacto</h3>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Valor Atual (R$)</label>
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
                        <span className={styles.hint}>Quanto você tem ou pretende ter</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Inflação Estimada (% ao mês)</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="0.5"
                            value={parseFloat(inflacao)}
                            onChange={(value) => updateParam('i', value?.toString() || '0.5')}
                            min={0}
                            max={10}
                            step={0.1}
                            suffix="%"
                        />
                        <span className={styles.hint}>IPCA média histórica: ~0,5% a.m. | Alta inflação: ~1% a.m.</span>
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
                                min={1}
                            />
                            <Select
                                size="large"
                                style={{ width: 150 }}
                                value={tipoPeriodo}
                                onChange={(value) => updateParam('tp', value)}
                                options={[
                                    { value: 'anos', label: 'Anos' },
                                    { value: 'meses', label: 'Meses' },
                                ]}
                            />
                        </div>
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
                            <div className={`${styles.statCard} ${styles.statCardNegative}`}>
                                <div className={styles.statCardIcon} style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' }}>
                                    <FaArrowDown style={{ color: '#dc2626' }} />
                                </div>
                                <p className={styles.statCardValue}>{formatCurrency(valorFuturo)}</p>
                                <p className={styles.statCardLabel}>Poder de Compra Futuro</p>
                            </div>
                            <div className={`${styles.statCard} ${styles.statCardPositive}`}>
                                <div className={styles.statCardIcon} style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
                                    <FaArrowUp style={{ color: '#059669' }} />
                                </div>
                                <p className={styles.statCardValue}>{formatCurrency(valorNecessario)}</p>
                                <p className={styles.statCardLabel}>Valor Necessário no Futuro</p>
                            </div>
                        </div>

                        <div className={styles.result}>
                            <div className={styles.resultHeader}>
                                <p className={styles.resultLabel}>Resumo do Impacto</p>
                            </div>
                            
                            <div className={styles.resultGrid}>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Valor Hoje</p>
                                    <p className={styles.resultItemValue}>{formatCurrency(valorNum)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Perda Total</p>
                                    <p className={`${styles.resultItemValue} ${styles.negative}`}>-{formatCurrency(perdaPoder)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Perda %</p>
                                    <p className={`${styles.resultItemValue} ${styles.negative}`}>-{perdaPercent.toFixed(1)}%</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Período</p>
                                    <p className={styles.resultItemValue}>{periodoMeses} meses</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.tableWrapper}>
                            <h3 className={styles.tableTitle}>
                                <FaChartLine /> Evolução da Perda
                            </h3>
                            <Table 
                                columns={columns} 
                                dataSource={evolucao} 
                                pagination={false}
                                size="small"
                            />
                        </div>

                        <div className={`${styles.decision} ${styles.decisionNegative}`}>
                            <h4 className={styles.decisionTitle}>⚠️ O que isso significa na prática?</h4>
                            <p className={styles.decisionText}>
                                Os seus <strong>{formatCurrency(valorNum)}</strong> de hoje vão comprar o equivalente 
                                a apenas <strong>{formatCurrency(valorFuturo)}</strong> daqui a{' '}
                                {tipoPeriodo === 'anos' ? `${periodoNum} anos` : `${periodoNum} meses`}.
                                <br /><br />
                                Isso significa que se você não investir esse dinheiro com rendimento acima da inflação, 
                                você perderá <strong>{perdaPercent.toFixed(1)}%</strong> do seu poder de compra.
                            </p>
                        </div>

                        <div className={`${styles.decision} ${styles.decisionPositive}`}>
                            <h4 className={styles.decisionTitle}>
                                <FaLightbulb style={{ marginRight: 8 }} />
                                Como se proteger da inflação?
                            </h4>
                            <p className={styles.decisionText}>
                                • <strong>Invista em ativos reais:</strong> Imóveis, ações de boas empresas<br />
                                • <strong>Títulos indexados:</strong> Tesouro IPCA+, CDBs atrelados à inflação<br />
                                • <strong>Diversifique:</strong> Não deixe todo dinheiro parado na poupança<br />
                                • <strong>Revise salário:</strong> Negocie reajustes anuais acima da inflação
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

