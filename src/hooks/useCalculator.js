'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook para carregar parâmetros da URL de forma segura
 * Usa um padrão que evita múltiplos setState síncronos
 */
export function useUrlParams(paramKeys) {
    // Usa ref para evitar re-renders desnecessários
    const keysRef = useRef(paramKeys)
    
    const [params, setParams] = useState(() => {
        const initial = {}
        paramKeys.forEach(key => {
            initial[key] = ''
        })
        return initial
    })
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const loadParams = () => {
            const searchParams = new URLSearchParams(window.location.search)
            const newParams = {}
            let hasAnyParam = false
            
            keysRef.current.forEach(key => {
                const value = searchParams.get(key)
                if (value) {
                    newParams[key] = value
                    hasAnyParam = true
                } else {
                    newParams[key] = ''
                }
            })
            
            if (hasAnyParam) {
                setParams(newParams)
            }
            setIsLoaded(true)
        }

        loadParams()
    }, [])

    const updateParam = useCallback((key, value) => {
        setParams(prev => ({ ...prev, [key]: value }))
    }, [])

    const resetParams = useCallback(() => {
        const reset = {}
        keysRef.current.forEach(key => {
            reset[key] = ''
        })
        setParams(reset)
    }, [])

    const generateShareUrl = useCallback(() => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                searchParams.set(key, value)
            }
        })
        return `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`
    }, [params])

    return { params, updateParam, resetParams, generateShareUrl, isLoaded }
}

/**
 * Formata valor para moeda brasileira
 */
export function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/**
 * Formata percentual
 */
export function formatPercent(value) {
    return `${value.toFixed(2)}%`
}
