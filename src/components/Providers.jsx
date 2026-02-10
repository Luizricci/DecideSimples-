'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ConfigProvider } from 'antd'
import ptBR from 'antd/locale/pt_BR'

const antdTheme = {
    token: {
        colorPrimary: '#1F6F78',
        borderRadius: 8,
        fontFamily: 'inherit',
    },
}

export function Providers({ children }) {
    return (
        <ChakraProvider value={defaultSystem}>
            <ConfigProvider locale={ptBR} theme={antdTheme}>
                {children}
            </ConfigProvider>
        </ChakraProvider>
    )
}
