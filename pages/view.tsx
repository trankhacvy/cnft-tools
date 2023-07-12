import { useWallet } from "@solana/wallet-adapter-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import ConnectWalletButton from "@/components/connect-wallet-button"
import { NetworkSelect } from "@/components/network-select"
import { NFTItem, NFTItemSkeleton } from "@/components/nft-item"
import { Button } from "@/components/ui/button"
import { SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import { Typography } from "@/components/ui/typography"
import { readAllNFTs } from "@/libs/shyft"
import { Network, Nft } from "@/types"

export default function Transfer() {
  const { connected, publicKey } = useWallet()
  const [loading, setLoading] = useState(false)
  const [network, setNetwork] = useState<Network>("mainnet-beta")
  const [nfts, setNFTs] = useState<Nft[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (publicKey && network) {
      setLoading(true)
      readAllNFTs(publicKey.toBase58(), network)
        .then((response) => {
          if (response.success) {
            setNFTs(response.result.nfts)
          } else {
            toast({
              variant: "error",
              title: "Error",
              description: response.message ?? "Unknown error",
            })
          }
        })
        .catch((error: any) => {
          toast({
            variant: "error",
            title: "Error",
            description: error?.message ?? "Unknown error",
          })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [publicKey, network])

  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Your cNFTs
        </Typography>

        <div className="w-auto">
          <NetworkSelect value={network} onValueChange={(value) => setNetwork(value as Network)}>
            <SelectTrigger>
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
          </NetworkSelect>
        </div>
      </div>

      {!connected || !publicKey ? (
        <div className="py-10 flex items-center justify-center">
          <ConnectWalletButton>Connect wallet</ConnectWalletButton>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 10 }).map((_, idx) => (
                <NFTItemSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <>
              {nfts.length === 0 ? (
                <div className="py-10  flex flex-col items-center justify-center gap-5">
                  <Typography className="font-semibold" color="secondary">
                    No cNFT
                  </Typography>
                  <Link href="/mint">
                    <Button>Create one</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {nfts.map((nft) => (
                    <NFTItem key={nft.mint} nft={nft} network={network} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
