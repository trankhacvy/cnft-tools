import { CreateTreeForm } from "@/components/create-tree-form"
import { Typography } from "@/components/ui/typography"

export default function HomePage() {
  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Create Merkle Tree
        </Typography>
      </div>
      <CreateTreeForm />
    </>
  )
}
