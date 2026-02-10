'use client'
import React from 'react'
import Link from 'next/link'
import { InputNumber, Select, Button, Table, message } from 'antd'
import { FaArrowLeft, FaShare, FaRedo, FaWallet, FaChartLine, FaCalendarAlt, FaPercentage } from 'react-icons/fa'
import { useUrlParams, formatCurrency } from '@/hooks/useCalculator'
import styles from '@/styles/calculator.module.css'

export default function AportesMensais() {
    const { params, updateParam, resetParams, generateShareUrl } = useUrlParams(['i', 'a', 't', 'p', 'tp'])

    const inicial = params.i || '0'
    const aporte = params.a
    const taxa = params.t
    const periodo = params.p
    const tipoPeriodo = params.tp || 'anos'

    const inicialNum = parseFloat(inicial) || 0
    const aporteNum = parseFloat(aporte) || 0
    const taxaNum = parseFloat(taxa) || 0
    let periodoNum = parseFloat(periodo) || 0

    // Converte anos para meses
    const periodoMeses = tipoPeriodo === 'anos' ? periodoNum * 12 : periodoNum

    // Taxa mensal em decimal
    const taxaMensal = taxaNum / 100

    // Cálculo: VF = VI × (1+i)^n + PMT × [((1+i)^n - 1) / i]
    let montanteFinal = 0
    let totalInvestido = inicialNum
    let rendimentoTotal = 0

    if (periodoMeses > 0 && taxaMensal > 0) {
        const fator = Math.pow(1 + taxaMensal, periodoMeses)
        const montanteInicial = inicialNum * fator
        const montanteAportes = aporteNum * ((fator - 1) / taxaMensal)
        montanteFinal = montanteInicial + montanteAportes
        totalInvestido = inicialNum + (aporteNum * periodoMeses)
        rendimentoTotal = montanteFinal - totalInvestido
    } else if (periodoMeses > 0) {
        montanteFinal = inicialNum + (aporteNum * periodoMeses)
        totalInvestido = montanteFinal
    }

    const rentabilidade = totalInvestido > 0 ? (rendimentoTotal / totalInvestido) * 100 : 0

    const handleShare = async () => {
        const url = generateShareUrl()
        await navigator.clipboard.writeText(url)
        message.success('Link copiado para a área de transferência!')
    }

    // Evolução anual
    const evolucaoAnual = []
    if (periodoMeses > 0 && taxaMensal > 0) {
        const anosTotal = Math.ceil(periodoMeses / 12)
        for (let ano = 0; ano <= Math.min(anosTotal, 10); ano++) {
            const meses = ano * 12
            const fator = Math.pow(1 + taxaMensal, meses)
            const montante = inicialNum * fator + (meses > 0 ? aporteNum * ((fator - 1) / taxaMensal) : 0)
            const investido = inicialNum + (aporteNum * meses)
            
            evolucaoAnual.push({
                key: ano.toString(),
                ano: `Ano ${ano}`,
                investido: formatCurrency(investido),
                montante: formatCurrency(montante),
                rendimento: formatCurrency(montante - investido)
            })
        }
    }

    const columns = [
        { title: 'Período', dataIndex: 'ano', key: 'ano' },
        { title: 'Total Investido', dataIndex: 'investido', key: 'investido' },
        { title: 'Montante', dataIndex: 'montante', key: 'montante' },
        { title: 'Rendimento', dataIndex: 'rendimento', key: 'rendimento' },
    ]

    const showResults = periodoNum > 0 && (aporteNum > 0 || inicialNum > 0)

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <Link href="/Calculadoras" className={styles.backLink}>
                    <FaArrowLeft />
                    <span>Voltar para Calculadoras</span>
                </Link>

                <div className={styles.header}>
                    <div className={styles.headerIcon}>
                        <FaWallet />
                    </div>
                    <h1 className={styles.title}>Aportes Mensais</h1>
                    <p className={styles.subtitle}>
                        Simule quanto você pode acumular investindo regularmente ao longo do tempo. 
                        Veja o poder do investimento consistente!
                    </p>
                </div>

                <div className={styles.form}>
                    <h3 className={styles.formTitle}>Dados do Investimento</h3>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Valor Inicial (R$)</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="0,00 (opcional)"
                            value={inicial && inicial !== '0' ? parseFloat(inicial) : null}
                            onChange={(value) => updateParam('i', value?.toString() || '0')}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                            parser={(value) => value.replace(/\./g, '')}
                            min={0}
                            prefix="R$"
                        />
                        <span className={styles.hint}>Quanto você já tem para começar</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Aporte Mensal (R$)</label>
                        <InputNumber
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="0,00"
                            value={aporte ? parseFloat(aporte) : null}
                            onChange={(value) => updateParam('a', value?.toString() || '')}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                            parser={(value) => value.replace(/\./g, '')}
                            min={0}
                            prefix="R$"
                        />
                        <span className={styles.hint}>Quanto você vai investir todo mês</span>
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
                            max={10}
                            step={0.1}
                            suffix="%"
                        />
                        <span className={styles.hint}>CDI ≈ 1% | Poupança ≈ 0,5% | Renda Variável ≈ 0,8% a 1,5%</span>
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
                        <div className={styles.result}>
                            <div className={styles.resultHeader}>
                                <p className={styles.resultLabel}>Montante Final</p>
                                <p className={styles.resultValue}>{formatCurrency(montanteFinal)}</p>
                            </div>
                            
                            <div className={styles.resultGrid}>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Total Investido</p>
                                    <p className={styles.resultItemValue}>{formatCurrency(totalInvestido)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Rendimento</p>
                                    <p className={`${styles.resultItemValue} ${styles.positive}`}>+{formatCurrency(rendimentoTotal)}</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Rentabilidade</p>
                                    <p className={`${styles.resultItemValue} ${styles.positive}`}>+{rentabilidade.toFixed(1)}%</p>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultItemLabel}>Período</p>
                                    <p className={styles.resultItemValue}>{periodoMeses} meses</p>
                                </div>
                            </div>
                        </div>

                        {evolucaoAnual.length > 0 && (
                            <div className={styles.tableWrapper}>
                                <h3 className={styles.tableTitle}>
                                    <FaChartLine /> Evolução por Ano
                                </h3>
                                <Table 
                                    columns={columns} 
                                    dataSource={evolucaoAnual} 
                                    pagination={false}
                                    size="small"
                                />
                            </div>
                        )}

                        <div className={styles.explanation}>
                            <h4 className={styles.explanationTitle}>
                                <FaPercentage /> O poder dos aportes regulares
                            </h4>
                            <p className={styles.explanationText}>
                                Com aportes de <strong>{formatCurrency(aporteNum)}</strong> por mês durante{' '}
                                <strong>{tipoPeriodo === 'anos' ? `${periodoNum} anos` : `${periodoNum} meses`}</strong>,{' '}
                                você investiu um total de <strong>{formatCurrency(totalInvestido)}</strong>.
                                <br /><br />
                                Os juros compostos renderam <strong>{formatCurrency(rendimentoTotal)}</strong> extras — 
                                isso é <strong>{((rendimentoTotal / totalInvestido) * 100).toFixed(1)}%</strong> do que você investiu!
                            </p>
                        </div>

                        <div className={`${styles.decision} ${styles.decisionPositive}`}>
                            <h4 className={styles.decisionTitle}>💡 Dicas para seu investimento</h4>
                            <p className={styles.decisionText}>
                                • <strong>Consistência é chave:</strong> Investir todo mês, mesmo valores pequenos, faz grande diferença<br />
                                • <strong>Comece cedo:</strong> Quanto mais tempo, maior o efeito dos juros compostos<br />
                                • <strong>Aumente gradualmente:</strong> Eleve seus aportes conforme sua renda crescer
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
