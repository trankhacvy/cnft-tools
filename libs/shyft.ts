import {
  BaseResponse,
  BurnNFTRequestBody,
  BurnNFTResult,
  CreateMerkleTreeRequestBody,
  CreateMerkleTreeResult,
  MintNFTRequestBody,
  MintNFTResult,
  Network,
  Nft,
  TransferNFTRequestBody,
  TransferNFTResult,
  UploadMetadataRequestBody,
  UploadResult,
} from "@/types"
import fetcher from "./fetcher"
import { SHYFT_API_ENDPOINT } from "@/config/api"

export function createTree(body: CreateMerkleTreeRequestBody) {
  return fetcher<BaseResponse<CreateMerkleTreeResult>>(`${SHYFT_API_ENDPOINT}/sol/v1/nft/compressed/create_tree`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
    },
    body: JSON.stringify(body),
  })
}

export function mintNFT(body: MintNFTRequestBody) {
  return fetcher<BaseResponse<MintNFTResult>>(`${SHYFT_API_ENDPOINT}/sol/v1/nft/compressed/mint`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
    },
    body: JSON.stringify(body),
  })
}

export function transferNFT(body: TransferNFTRequestBody) {
  return fetcher<BaseResponse<TransferNFTResult>>(`${SHYFT_API_ENDPOINT}/sol/v1/nft/compressed/transfer`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
    },
    body: JSON.stringify(body),
  })
}

export function burnNFT(body: BurnNFTRequestBody) {
  return fetcher<BaseResponse<BurnNFTResult>>(`${SHYFT_API_ENDPOINT}/sol/v1/nft/compressed/burn`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
    },
    body: JSON.stringify(body),
  })
}

export function readAllNFTs(wallet: string, network: Network) {
  return fetcher<BaseResponse<{ nfts: Nft[] }>>(
    `${SHYFT_API_ENDPOINT}/sol/v1/nft/compressed/read_all?network=${network}&wallet_address=${wallet}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
      },
    }
  )
}

export function readNFT(nftAddress: string, network: Network) {
  return fetcher<BaseResponse<Nft>>(
    `${SHYFT_API_ENDPOINT}/sol/v1/nft/compressed/read?network=${network}&nft_address=${nftAddress}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
      },
    }
  )
}

export function upload(file: File) {
  const formdata = new FormData()
  formdata.append("file", file, file.name)

  return fetcher<BaseResponse<UploadResult>>(`${SHYFT_API_ENDPOINT}/sol/v1/storage/upload`, {
    method: "POST",
    headers: {
      // "content-type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
    },
    body: formdata,
  })
}

export function uploadMetadata(metadata: UploadMetadataRequestBody) {
  return fetcher<BaseResponse<UploadResult>>(`${SHYFT_API_ENDPOINT}/sol/v1/metadata/create`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_SHYFT_API_KEY!,
    },
    body: JSON.stringify(metadata),
  })
}
