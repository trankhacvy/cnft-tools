import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"
import { Typography } from "@/components/ui/typography"
import { Network, Nft } from "@/types"

type NFTItemProps = {
  nft: Nft
  network: Network
}

export function NFTItem({ nft, network }: NFTItemProps) {
  return (
    <a
      href={`https://translator.shyft.to/address/${nft.mint}?cluster=${network}&compressed=true`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <AspectRatio>
          <img className="w-full h-auto object-cover" src={nft.cached_image_uri ?? nft.image_uri} alt={nft.name} />
        </AspectRatio>
        <div className="p-5 w-full">
          <Typography className="mb-2 font-semibold">{nft.name}</Typography>
          <Typography as="p" color="secondary" level="body4" className="line-clamp-2 text-ellipsis">
            {nft.description}
          </Typography>
        </div>
      </div>
    </a>
  )
}

export function NFTItemSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <AspectRatio>
        <Skeleton className="h-full w-full" />
      </AspectRatio>
      <div className="p-5">
        <Skeleton className="mb-2 h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
