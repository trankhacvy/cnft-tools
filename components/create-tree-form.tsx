import { zodResolver } from "@hookform/resolvers/zod"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Transaction } from "@solana/web3.js"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SelectTrigger, SelectValue } from "@/components/ui/select"
import { Networks } from "@/config/enum"
import { createTree } from "@/libs/shyft"
import { getTreeOptions } from "@/utils/get-tree-options"
import ConnectWalletButton from "./connect-wallet-button"
import { NetworkSelect } from "./network-select"
import { useToast } from "./ui/toast"

const formSchema = z.object({
  number_of_nodes: z
    .number({ required_error: "Required.", invalid_type_error: "Required" })
    .min(1, "Number of nodes must be greater than 1.")
    .max(1073741824, `Number of nodes must be less than 1073741824.`),
  network: z.enum(Networks),
})

export function CreateTreeForm() {
  const { toast } = useToast()
  const { connected, publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number_of_nodes: 32,
      network: "devnet",
    },
  })

  const numOfNodes = form.watch("number_of_nodes")

  const treeOptions = getTreeOptions(numOfNodes ?? 0)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!publicKey) {
        toast({
          variant: "warning",
          title: "Please connect to your wallet",
        })
        return
      }
      const { maxDepth, maxBufferSize, canopyDepth } = getTreeOptions(values.number_of_nodes)
      const response = await createTree({
        wallet_address: publicKey.toBase58(),
        network: values.network,
        max_depth_size_pair: {
          max_depth: maxDepth,
          max_buffer_size: maxBufferSize,
        },
        canopy_depth: canopyDepth,
      })

      if (response.success) {
        const tx = Transaction.from(Buffer.from(response.result.encoded_transaction, "base64"))
        const signature = await sendTransaction(tx, connection)
        await connection.confirmTransaction(signature, "confirmed")

        toast({
          variant: "success",
          title: "Merkel tree created successfully",
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

  return (
    <div className="max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="rounded-2xl shadow-card bg-white flex flex-col gap-5 p-5 mb-5">
            <FormField
              control={form.control}
              name="number_of_nodes"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Number of nodes</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1024"
                      error={fieldState.invalid}
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  {numOfNodes ? (
                    <FormDescription>{`max_depth = ${treeOptions.maxDepth}, max_buffer_size = ${treeOptions.maxBufferSize}, canopy_depth = ${treeOptions.canopyDepth}`}</FormDescription>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Create
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
