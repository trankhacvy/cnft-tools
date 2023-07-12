import * as React from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "@/utils/cn"
import AlertContext from "./context"

const alertVariants = tv({
  base: "relative flex items-center w-full px-4 py-3 rounded-lg",
  variants: {
    variant: {
      info: "bg-info-100 text-info-900",
      error: "bg-error-100 text-error-900",
      success: "bg-success-100 text-success-900",
      warning: "bg-warning-100 text-warning-900",
    },
  },
  defaultVariants: {
    variant: "info",
  },
})

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant = "info", ...props }, ref) => (
  <AlertContext.Provider value={{ variant }}>
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  </AlertContext.Provider>
))
Alert.displayName = "Alert"

const alertIconVariants = tv({
  base: "mr-3 [&>svg]:w-6 [&>svg]:h-6",
  variants: {
    variant: {
      info: "text-info-500",
      error: "text-error-500",
      success: "text-success-500",
      warning: "text-warning-500",
    },
  },
  defaultVariants: {
    variant: "info",
  },
})

const AlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertIconVariants>
>(({ className, variant = "info", ...props }, ref) => {
  const values = React.useContext(AlertContext)
  return (
    <div ref={ref} className={cn(alertIconVariants({ variant: values?.variant ?? variant }), className)} {...props} />
  )
})
AlertIcon.displayName = "AlertIcon"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-1 text-sm [&_p]:leading-relaxed", className)} {...props} />
  )
)
AlertDescription.displayName = "AlertDescription"

const alertCloseVariants = tv({
  base: "-mr-2 ml-3",
  variants: {
    variant: {
      info: "[&>button]:text-info-900",
      error: "[&>button]:text-error-900",
      success: "[&>button]:text-success-900",
      warning: "[&>button]:text-warning-900",
    },
  },
  defaultVariants: {
    variant: "info",
  },
})

const AlertClose = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertCloseVariants>
>(({ className, variant = "info", ...props }, ref) => {
  const values = React.useContext(AlertContext)
  return (
    <div ref={ref} className={cn(alertCloseVariants({ variant: values?.variant ?? variant }), className)} {...props} />
  )
})
AlertClose.displayName = "AlertClose"

export { Alert, AlertIcon, AlertClose, AlertTitle, AlertDescription }
