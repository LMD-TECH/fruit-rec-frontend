import { Apple, GalleryVerticalEnd } from "lucide-react"

import SendEmailForm from './../components/send-email-form';
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <Apple className="size-8 text-primary" />
                    <span className="text-2xl font-light" >Fruit Recongnition</span>
                </a>
                <Suspense>
                    <SendEmailForm />
                </Suspense>
            </div>
        </div>
    )
}
