'use client'
import React from 'react'
import Link from 'next/link'
import { InputNumber, Select, Table, message } from 'antd'
import { FaArrowLeft, FaShare, FaRedo, FaBalanceScale, FaChartBar, FaTrophy, FaPiggyBank, FaChartLine, FaRocket, FaLightbulb } from 'react-icons/fa'
import { useUrlParams, formatCurrency } from '@/hooks/useCalculator'
import styles from '@/styles/calculator.module.css'

export default function ComparadorInvestimentos() {
    const { params, updateParam, resetParams, generateShareUrl } = useUrlParams(['c', 'p', 'tp', 't1', 't2', 't3'])

    const capital = params.c
    const periodo = params.p
    const tipoPeriodo = params.tp || 'anos'
    const taxa1 = params.t1 || '0.5'  // Poupança
    const taxa2 = params.t2 || '1.0'  // CDI
    const taxa3 = params.t3 || '1.2'  // Renda Variável

    const capitalNum = parseFloat(capital) || 0
    let periodoNum = parseFloat(periodo) || 0
    const taxa1Num = parseFloat(taxa1) || 0.5
    const taxa2Num = parseFloat(taxa2) || 1.0
    const taxa3Num = parseFloat(taxa3) || 1.2

    // Converte anos para meses
    const periodoMeses = tipoPeriodo === 'anos' ? periodoNum * 12 : periodoNum

    // Calcula montante para cada investimento
    const calcularMontante = (taxaMensal, meses) => {
        return capitalNum * Math.pow(1 + taxaMensal / 100, meses)
    }

    const montante1 = calcularMontante(taxa1Num, periodoMeses)
    const montante2 = calcularMontante(taxa2Num, periodoMeses)
    const montante3 = calcularMontante(taxa3Num, periodoMeses)

    const rendimento1 = montante1 - capitalNum
    const rendimento2 = montante2 - capitalNum
    const rendimento3 = montante3 - capitalNum

    const rentab1 = capitalNum > 0 ? (rendimento1 / capitalNum) * 100 : 0
    const rentab2 = capitalNum > 0 ? (rendimento2 / capitalNum) * 100 : 0
    const rentab3 = capitalNum > 0 ? (rendimento3 / capitalNum) * 100 : 0

    // Encontrar o melhor
    const investimentos = [
        { nome: 'Poupança', taxa: taxa1Num, montante: montante1, rendimento: rendimento1, rentab: rentab1, icon: <FaPiggyBank /> },
        { nome: 'CDI/CDB', taxa: taxa2Num, montante: montante2, rendimento: rendimento2, rentab: rentab2, icon: <FaChartLine /> },
        { nome: 'Renda Variável', taxa: taxa3Num, montante: montante3, rendimento: rendimento3, rentab: rentab3, icon: <FaRocket /> },
    ]

    const melhor = investimentos.reduce((a, b) => a.montante > b.montante ? a : b)
    const diferenca = melhor.rendimento - investimentos.reduce((a, b) => a.montante < b.montante ? a : b).rendimento

    const handleShare = async () => {
        const url = generateShareUrl()
        await navigator.clipboard.writeText(url)
        message.success('Link copiado para a área de transferência!')
    }

    // Dados da tabela de evolução
    const evolucao = []
    if (capitalNum > 0 && periodoMeses > 0) {
        const anos = Math.min(Math.ceil(periodoMeses / 12), 10)
        for (let ano = 0; ano <= anos; ano++) {
            const meses = ano * 12
            evolucao.push({
                key: ano.toString(),
                ano: `Ano ${ano}`,
                poupanca: formatCurrency(calcularMontante(taxa1Num, meses)),
                cdi: formatCurrency(calcularMontante(taxa2Num, meses)),
                rv: formatCurrency(calcularMontante(taxa3Num, meses)),
            })
        }
    }

    const columns = [
        { title: 'Período', dataIndex: 'ano', key: 'ano' },
        { title: 'Poupança', dataIndex: 'poupanca', key: 'poupanca' },
        { title: 'CDI/CDB', dataIndex: 'cdi', key: 'cdi' },
        { title: 'Renda Variável', dataIndex: 'rv', key: 'rv' },
    ]

    const showResults = capitalNum > 0 && periodoNum > 0

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <Link href="/Calculadoras" className={styles.backLink}>
                    <FaArrowLeft />
                    <span>Voltar para Calculadoras</span>
                </Link>

                <div className={styles.header}>
                    <div className={styles.headerIcon}>
                        <FaBalanceScale />
                    </div>
                    <h1 className={styles.title}>Comparador de Investimentos</h1>
                    <p className={styles.subtitle}>
                        Compare diferentes tipos de investimento e veja qual rende mais para o seu perfil.
                    </p>
                </div>

                <div className={styles.form}>
                    <h3 className={styles.formTitle}>Configure a Comparação</h3>
                    
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
                        <span className={styles.hint}>Quanto você tem para investir</span>
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

                    <h4 className={styles.formTitle} style={{ marginTop: '1.5rem' }}>Taxas de Rendimento (% ao mês)</h4>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Poupança</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            value={parseFloat(taxa1)}
                            onChange={(value) => updateParam('t1', value?.toString() || '0.5')}
                            min={0}
                            max={10}
                            step={0.1}
                            suffix="%"
                        />
                        <span className={styles.hint}>Rendimento típico: ~0,5% a.m.</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>CDI/CDB</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            value={parseFloat(taxa2)}
                            onChange={(value) => updateParam('t2', value?.toString() || '1.0')}
                            min={0}
                            max={10}
                            step={0.1}
                            suffix="%"
                        />
                        <span className={styles.hint}>Rendimento típico: ~1% a.m.</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Renda Variável</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            value={parseFloat(taxa3)}
                            onChange={(value) => updateParam('t3', value?.toString() || '1.2')}
                            min={0}
                            max={10}
                            step={0.1}
                            suffix="%"
                        />
                        <span className={styles.hint}>Rendimento típico: ~0,8% a 1,5% a.m.</span>
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
                            {investimentos.map((inv) => (
                                <div 
                                    key={inv.nome}
                                    className={`${styles.statCard} ${inv.nome === melhor.nome ? styles.statCardWinner : ''}`}
                                >
                                    <div className={styles.statCardIcon}>
                                        {inv.icon}
                                    </div>
                                    <p className={styles.statCardLabel}>{inv.nome}</p>
                                    <p className={`${styles.statCardValue} ${styles.statCardPositive}`}>
                                        {formatCurrency(inv.montante)}
                                    </p>
                                    <p className={styles.statCardLabel}>
                                        Rendimento: {formatCurrency(inv.rendimento)}
                                    </p>
                                    <p className={`${styles.statCardLabel} ${styles.positive}`} style={{ fontWeight: 600 }}>
                                        +{inv.rentab.toFixed(1)}%
                                    </p>
                                    <p className={styles.statCardLabel} style={{ fontSize: '0.8rem', color: '#888' }}>
                                        Taxa: {inv.taxa}% a.m.
                                    </p>
                                    {inv.nome === melhor.nome && (
                                        <span className={styles.winnerBadge}>
                                            <FaTrophy /> MELHOR
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={styles.result}>
                            <div className={styles.resultHeader}>
                                <p className={styles.resultLabel}>Melhor Investimento</p>
                                <p className={styles.resultValue}>{melhor.nome}</p>
                            </div>
                            
                            <div className={styles.resultGrid}>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Capital Inicial</p>
                                    <p className={styles.resultItemValue}>{formatCurrency(capitalNum)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Montante Final</p>
                                    <p className={`${styles.resultItemValue} ${styles.positive}`}>{formatCurrency(melhor.montante)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Diferença (maior - menor)</p>
                                    <p className={`${styles.resultItemValue} ${styles.positive}`}>+{formatCurrency(diferenca)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Período</p>
                                    <p className={styles.resultItemValue}>{periodoMeses} meses</p>
                                </div>
                            </div>
                        </div>

                        {evolucao.length > 0 && (
                            <div className={styles.tableWrapper}>
                                <h3 className={styles.tableTitle}>
                                    <FaChartBar /> Evolução por Ano
                                </h3>
                                <Table 
                                    columns={columns} 
                                    dataSource={evolucao} 
                                    pagination={false}
                                    size="small"
                                    scroll={{ x: true }}
                                />
                            </div>
                        )}

                        <div className={styles.explanation}>
                            <h4 className={styles.explanationTitle}>
                                <FaLightbulb /> Entendendo os investimentos
                            </h4>
                            <p className={styles.explanationText}>
                                <strong>Poupança:</strong> Baixo risco, liquidez diária, rendimento menor (~0,5% a.m.)
                                <br /><br />
                                <strong>CDI/CDB:</strong> Risco baixo a médio, atrelado à taxa Selic (~1% a.m.)
                                <br /><br />
                                <strong>Renda Variável:</strong> Maior risco, maior potencial de retorno (variável)
                            </p>
                        </div>

                        <div className={`${styles.decision} ${styles.decisionNegative}`}>
                            <h4 className={styles.decisionTitle}>⚠️ Importante considerar</h4>
                            <p className={styles.decisionText}>
                                • Renda variável pode ter rentabilidade negativa em alguns períodos<br />
                                • CDBs podem ter carência ou IR regressivo<br />
                                • Diversifique seus investimentos para reduzir riscos<br />
                                • Consulte um profissional para decisões importantes
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
