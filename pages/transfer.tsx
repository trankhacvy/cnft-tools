import { TransferNFTForm } from "@/components/transfer-nft-form"
import { Typography } from "@/components/ui/typography"

export default function Transfer() {
  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Transfer cNFT
        </Typography>
      </div>
      <TransferNFTForm />
    </>
  )
}
