import { SelectProps } from "@radix-ui/react-select"
import React, { PropsWithChildren } from "react"
import { Select, SelectContent, SelectItem } from "./ui/select"

type NetworkSelect = SelectProps & PropsWithChildren

export function NetworkSelect({ children, ...rest }: SelectProps) {
  return (
    <Select {...rest}>
      {children}
      <SelectContent position="popper" sideOffset={8} className="!w-[var(--radix-select-trigger-width)]">
        <SelectItem value="mainnet-beta">Mainnet</SelectItem>
        <SelectItem value="devnet">Devnet</SelectItem>
        <SelectItem value="testnet">Testnet</SelectItem>
      </SelectContent>
    </Select>
  )
}
