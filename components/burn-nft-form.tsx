import { zodResolver } from "@hookform/resolvers/zod"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Transaction } from "@solana/web3.js"
import { Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Networks } from "@/config/enum"
import { burnNFT, readAllNFTs } from "@/libs/shyft"
import { Nft } from "@/types"
import ConnectWalletButton from "./connect-wallet-button"
import { NetworkSelect } from "./network-select"
import { useToast } from "./ui/toast"
import { Typography } from "./ui/typography"

const formSchema = z.object({
  merkle_tree: z.string().trim().min(1, { message: "This field is required." }),
  nft_address: z.string().trim().min(1, { message: "This field is required." }),
  network: z.enum(Networks),
})

export function BurnNFTForm() {
  const { toast } = useToast()
  const { connected, publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [nfts, setNFTs] = useState<Nft[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merkle_tree: "",
      nft_address: "",
      network: "devnet",
    },
  })

  const network = form.watch("network")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!publicKey) {
        toast({
          variant: "warning",
          title: "Please connect to your wallet",
        })
        return
      }
      const response = await burnNFT({
        merkle_tree: values.merkle_tree,
        nft_address: values.nft_address,
        wallet_address: publicKey.toBase58(),
        network: values.network,
      })

      if (response.success) {
        const tx = Transaction.from(Buffer.from(response.result.encoded_transaction, "base64"))
        const signature = await sendTransaction(tx, connection)
        await connection.confirmTransaction(signature, "confirmed")

        toast({
          variant: "success",
          title: "NFT burned successfully",
          description: (
            <a
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://translator.shyft.to/tx/${signature}?cluster=${values.network}`}
            >
              View transaction
            </a>
          ),
        })
      } else {
        toast({
          variant: "error",
          title: "Error :(",
          description: response.message ?? "Unknown error",
        })
      }
    } catch (error: any) {
      toast({
        variant: "error",
        title: "Error :(",
        description: error?.message ?? "Unknown error",
      })
    }
  }

  useEffect(() => {
    if (publicKey && network) {
      setLoading(true)
      readAllNFTs(publicKey.toBase58(), network)
        .then((response) => {
          if (response.success) {
            setNFTs(response.result.nfts)
            form.reset({
              merkle_tree: "",
              nft_address: response.result.nfts?.[0].mint,
              network: "devnet",
            })
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
  }, [publicKey, network, setLoading, setNFTs, form])

  return (
    <div className="max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="rounded-2xl shadow-card bg-white flex flex-col gap-5 p-5 mb-5">
            {/* merkle tree */}
            <FormField
              control={form.control}
              name="merkle_tree"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Merkle tree</FormLabel>
                  <FormControl>
                    <Input placeholder="Merkle tree address" error={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormDescription>Merkle tree where NFT present</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* nft */}
            <FormField
              control={form.control}
              name="nft_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT</FormLabel>
                  {connected ? (
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select NFT" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent
                          position="popper"
                          sideOffset={8}
                          className="!w-[var(--radix-select-trigger-width)]"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center p-10">
                              <Loader2Icon className="animate-spin" />
                            </div>
                          ) : (
                            nfts.map((nft) => (
                              <SelectItem key={nft.mint} value={nft.mint}>
                                <div className="!flex items-center gap-3">
                                  <img
                                    className="w-8 h-8 object-contain rounded-sm overflow-hidden"
                                    src={nft.cached_image_uri ?? nft.image_uri}
                                    alt={nft.name}
                                  />
                                  {nft.name}
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  ) : (
                    <FormControl>
                      <Typography as="p" color="warning">
                        You need to connect to you wallet
                      </Typography>
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* network */}
            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network</FormLabel>
                  <FormControl>
                    <NetworkSelect onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                      </FormControl>
                    </NetworkSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            {connected ? (
              <Button loading={form.formState.isSubmitting} type="submit">
                Burn
              </Button>
            ) : (
              <ConnectWalletButton>Connect Wallet</ConnectWalletButton>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
