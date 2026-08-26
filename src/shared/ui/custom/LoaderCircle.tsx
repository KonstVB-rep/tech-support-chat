import { Loader2 } from "lucide-react"

const LoaderCircle = () => {
  return (
    <div className="flex justify-center p-8 text-muted-foreground text-xs">
      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
    </div>
  )
}

export default LoaderCircle
