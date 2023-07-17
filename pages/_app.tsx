import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { Analytics } from "@vercel/analytics/react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import type { AppProps } from "next/app"
import { DefaultSeo } from "next-seo"
import type { FC } from "react"
import React, { useMemo } from "react"
import { Layout } from "@/components/layout/layout"
import { Toaster } from "@/components/ui/toast"
import { siteConfig } from "@/config/site"

require("@solana/wallet-adapter-react-ui/styles.css")
require("../styles/globals.css")

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const network = WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [network])

  return (
    <>
      <DefaultSeo
        title={siteConfig.name}
        openGraph={{
          type: "website",
          locale: "en_EN",
          description: siteConfig.description,
          site_name: siteConfig.name,
          title: siteConfig.name,
          images: [
            {
              url: siteConfig.ogImage,
            },
          ],
        }}
        description={siteConfig.description}
      />

      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Layout>
              <Component {...pageProps} />
              <Toaster />
            </Layout>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
      <Analytics />
    </>
  )
}

export default App
