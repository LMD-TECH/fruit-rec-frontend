
import { FileUploadForm } from "./components/file-upload-form"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-background to-secondary/20">
      <div className="w-full max-w-4xl">
        <FileUploadForm />
      </div>
    </main>
  )
}
