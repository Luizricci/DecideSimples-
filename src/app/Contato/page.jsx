'use client'
import React, { useState } from 'react'
import styles from './contato.module.css'
import { FaEnvelope, FaInstagram, FaClock, FaCheck } from 'react-icons/fa'

export default function Contato() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        assunto: '',
        mensagem: ''
    })
    const [enviado, setEnviado] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Aqui você pode integrar com um serviço de email como Formspree, EmailJS, etc.
        console.log('Form data:', formData)
        setEnviado(true)
        setFormData({ nome: '', email: '', assunto: '', mensagem: '' })
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Entre em Contato</h1>
                <p className={styles.subtitle}>
                    Tem alguma dúvida, sugestão ou quer sugerir uma nova calculadora? 
                    Fale conosco!
                </p>
            </header>

            <div className={styles.content}>
                <div className={styles.info}>
                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><FaEnvelope /></div>
                        <div>
                            <h3>Email</h3>
                            <p>contato@decidesimples.com</p>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><FaInstagram /></div>
                        <div>
                            <h3>Redes Sociais</h3>
                            <p>@decidesimples</p>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><FaClock /></div>
                        <div>
                            <h3>Tempo de Resposta</h3>
                            <p>Até 48 horas úteis</p>
                        </div>
                    </div>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {enviado ? (
                        <div className={styles.success}>
                            <div className={styles.successIcon}><FaCheck /></div>
                            <h3>Mensagem enviada!</h3>
                            <p>Obrigado pelo contato. Responderemos em breve.</p>
                            <button 
                                type="button" 
                                className={styles.button}
                                onClick={() => setEnviado(false)}
                            >
                                Enviar outra mensagem
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Nome</label>
                                <input
                                    type="text"
                                    name="nome"
                                    className={styles.input}
                                    value={formData.nome}
                                    onChange={handleChange}
                                    placeholder="Seu nome"
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className={styles.input}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Assunto</label>
                                <select
                                    name="assunto"
                                    className={styles.select}
                                    value={formData.assunto}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione um assunto</option>
                                    <option value="duvida">Dúvida sobre calculadora</option>
                                    <option value="sugestao">Sugestão de nova calculadora</option>
                                    <option value="bug">Reportar problema</option>
                                    <option value="parceria">Parceria comercial</option>
                                    <option value="outro">Outro assunto</option>
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Mensagem</label>
                                <textarea
                                    name="mensagem"
                                    className={styles.textarea}
                                    value={formData.mensagem}
                                    onChange={handleChange}
                                    placeholder="Escreva sua mensagem aqui..."
                                    rows="5"
                                    required
                                />
                            </div>

                            <button type="submit" className={styles.submitButton}>
                                Enviar Mensagem
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    )
}
