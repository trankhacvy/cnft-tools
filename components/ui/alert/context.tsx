import * as React from "react"
import { type AlertProps } from "./alert"

export type AlertContextValue = undefined | Pick<AlertProps, "variant">

const AlertContext = React.createContext<AlertContextValue>(undefined)

export default AlertContext
