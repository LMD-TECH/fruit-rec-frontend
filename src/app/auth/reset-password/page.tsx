import { ResetPasswordForm } from "../components/reset-password-form"

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="w-full max-w-md">
                <ResetPasswordForm />
            </div>
        </main>
    )
}

