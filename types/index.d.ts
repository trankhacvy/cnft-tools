export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type BaseResponse<T> = {
  success: boolean
  message: string
  result: T
}

export type Network = "mainnet-beta" | "devnet" | "testnet"

export type CreateMerkleTreeRequestBody = {
  network: Network
  wallet_address: string
  max_depth_size_pair: {
    max_depth: number
    max_buffer_size: number
  }
  canopy_depth: number
  fee_payer?: string
}

export type CreateMerkleTreeResult = {
  encoded_transaction: string
  tree: string
  signers: Array<string>
}

export type MintNFTRequestBody = {
  network: Network
  creator_wallet: string
  metadata_uri: string
  merkle_tree: string
  is_delegate_authority?: boolean
  collection_address?: string
  max_supply?: number
  primary_sale_happend?: boolean
  is_mutable?: boolean
  receiver?: string
  fee_payer?: string
}

export type MintNFTResult = {
  encoded_transaction: string
  mint: string
  signers: Array<string>
}

export type TransferNFTRequestBody = {
  network: Network
  merkle_tree: string
  nft_address: string
  sender: string
  receiver: string
}

export type TransferNFTResult = {
  encoded_transaction: string
  signers: Array<string>
}

export type BurnNFTRequestBody = {
  network: string
  merkle_tree: string
  nft_address: string
  wallet_address: string
}

export type BurnNFTResult = {
  encoded_transaction: string
  signers: Array<string>
}

export type CollectionInfo = {
  address?: string
  verified?: boolean
  name?: string
  family?: string
}

export type NftFile = {
  uri: string
  type: string
}

export type Creator = {
  address: string
  verified: boolean
  share: number
}

export type Nft = {
  name: string
  description: string
  symbol: string
  image_uri: string
  royalty: number
  mint: string
  attributes: { [k: string]: string | number }
  owner: string
  update_authority: string
  cached_image_uri: string
  animation_url: string
  cached_animation_url: string
  metadata_uri: string
  creators: Creator[]
  collection: CollectionInfo
  attributes_array: any
  files: NftFile[]
  external_url: string
  is_loaded_metadata: boolean
  primary_sale_happened: boolean
  is_mutable: boolean
}

export type UploadResult = {
  cid: string
  uri: string
}

export type UploadMetadataRequestBody = {
  name: string
  symbol: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: any
  }>
  royalty: number
  creator: string
  share: number
  external_url: string
  files: Array<{
    uri: string
    type: string
  }>
}
