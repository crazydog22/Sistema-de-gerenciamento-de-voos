'use client'

import React, { useEffect } from 'react'
import Head from 'next/head'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Remove any injected attributes from extensions
    document.documentElement.removeAttribute('bbai-tooltip-injected')
  }, [])

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <Head>
        <title>Sistema de Gerenciamento de Voos</title>
        <meta name="description" content="Sistema para gerenciamento de voos e operações aéreas" />
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
