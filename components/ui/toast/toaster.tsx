import * as ToastPrimitives from "@radix-ui/react-toast"
import { AlertCircleIcon, AlertOctagonIcon, AlertTriangleIcon, CheckIcon, X } from "lucide-react"
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert"
import { Toast, ToastProvider, ToastViewport } from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} {...props}>
            <Alert variant={variant}>
              <AlertIcon>
                {variant === "info" && <AlertCircleIcon />}
                {variant === "success" && <CheckIcon />}
                {variant === "warning" && <AlertTriangleIcon />}
                {variant === "error" && <AlertOctagonIcon />}
              </AlertIcon>
              <div className="flex-1">
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{description}</AlertDescription>
              </div>
              <ToastPrimitives.Close>
                <X />
              </ToastPrimitives.Close>
            </Alert>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
