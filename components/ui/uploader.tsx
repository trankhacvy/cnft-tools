import cx from "classnames"
import { ArrowUpIcon, XIcon } from "lucide-react"
import React, { forwardRef, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { IconButton } from "@/components/ui/icon-button"
import { Typography } from "@/components/ui/typography"

export type UploaderFile = File & { preview?: string }

export interface UploaderProps {
  maxFiles?: number
  maxSize?: number
  accept?: Record<string, string[]>
  className?: string
  onChange: (files: Array<UploaderFile | string>) => void
  isDisabled?: boolean
  onExceedFileCount?: VoidFunction
  onExceedFileSize?: VoidFunction
  value?: (UploaderFile | string)[]
}

const DEFAULT_MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const DEFAULT_MAX_FILE_SIZE = 1

export const Uploader = forwardRef<HTMLDivElement, UploaderProps>((props, ref) => {
  const {
    maxFiles = DEFAULT_MAX_FILE_SIZE,
    maxSize = DEFAULT_MAX_SIZE_BYTES,
    accept = { "image/*": [] },
    className,
    onChange,
    isDisabled: isDisabledProp = false,
    onExceedFileCount,
    onExceedFileSize,
    value,
    ...rest
  } = props
  const [files, setFiles] = useState<Array<UploaderFile | string>>(value?.filter(Boolean) ?? [])

  const multiple = maxFiles > 1

  const isDisabled = isDisabledProp || (multiple && files.length === maxFiles)

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles,
    maxSize,
    accept,
    multiple,
    disabled: isDisabled,
    onDrop: (acceptedFiles: UploaderFile[], rejectedFiles) => {
      if (files.length + acceptedFiles.length + rejectedFiles.length > maxFiles) {
        onExceedFileCount?.()
      } else if (rejectedFiles.some((file) => file.file.size > maxSize)) {
        onExceedFileSize?.()
      }

      const uniqueFiles = acceptedFiles.filter((item) => {
        return !files.find(
          (file) => typeof file !== "string" && file.name === item.name && file.lastModified === item.lastModified
        )
      })

      let newFiles
      if (!multiple) {
        newFiles = uniqueFiles
          .map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
          .slice(0, maxFiles)
      } else {
        newFiles = [
          ...files,
          ...uniqueFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          ),
        ].slice(0, maxFiles)
      }
      setFiles(newFiles)
      onChange(newFiles)
    },
  })

  const removeFile = (index: number) => {
    if (!multiple) {
      setFiles([])
      onChange([])
    } else {
      const newFiles = files.filter((_, i) => i !== index)
      setFiles(newFiles)
      onChange(newFiles)
    }
  }

  useEffect(() => {
    if (value?.length) {
      setFiles(value.filter(Boolean))
    }
  }, [value])

  return (
    <>
      <div
        {...getRootProps({
          ref,
          className: cx(
            "relative cursor-pointer flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-500/20 bg-gray-500/8 hover:opacity-75",
            {
              "p-10": multiple || files.length === 0,
              "px-0 py-[24%]": !multiple && files.length === 1,
              "cursor-not-allowed pointer-events-none": isDisabled,
            },
            className
          ),
          ...rest,
        })}
      >
        {!multiple && files.length === 1 && (
          <>
            <div className="absolute left-0 top-0 h-full w-full p-4">
              <div className="h-full w-full overflow-hidden rounded-lg align-bottom">
                <img
                  alt="preview"
                  src={typeof files?.[0] === "string" ? files?.[0] : files?.[0].preview}
                  className="h-auto w-full object-cover align-bottom"
                />
              </div>
            </div>
            <IconButton
              onClick={(event) => {
                event.stopPropagation()
                setFiles([])
                onChange([])
              }}
              className="absolute right-6 top-6 bg-gray-900/70 text-white hover:bg-gray-900/70"
              size="sm"
            >
              <XIcon />
            </IconButton>
          </>
        )}

        {(multiple || files.length < 1) && (
          <>
            <input {...getInputProps({ disabled: isDisabled })} />
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="rounded-full">
                <ArrowUpIcon className="h-8 w-8" />
              </div>
              <div className="flex flex-col gap-4 text-center">
                <Typography level="body3" as="h6" className="font-bold">
                  Drop or Select file
                </Typography>

                <Typography level="body4" as="p">
                  Drop files here or click<span className="mx-1 text-primary-500 underline">browse</span>thorough your
                  machine
                </Typography>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
})

Uploader.displayName = "Uploader"
