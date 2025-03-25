"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { QueryClient, useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useCustomQuery } from "@/context/querycontext"
import { createCookies } from "@/services/cookies.action"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


type LoginUserResponse = {
    status: boolean,
    message: string,
    token?: string,
    status_code: number,
    error?: string
}


type PostLoginParams = {
    email: string,
    mot_de_passe: string
}

const queryClient = new QueryClient()

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    // const { toast } = useToast()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()
    const { onMutate } = useCustomQuery()

    const handleLogin = async (formData: FormData) => {

        const body: PostLoginParams = {
            email: formData.get('email') as string ?? "",
            mot_de_passe: formData.get('mot_de_passe') as string ?? ""
        }

        setIsLoading(true)
        const response = await onMutate<LoginUserResponse>({ body, endpoint: "/api/auth/login" })
        if (response && response.status_code === 200) {
            await createCookies("auth_token", response?.token || "")
            console.log(response)
            router.replace("/dashboard")
            toast(response.message)
        } else if (response && response.status_code === 403) {
            toast(response?.message || "Une erreur s'est produite !", {
                description: response?.error,
                style: {
                    backgroundColor: "red",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                },
                action: {
                    label: "Cliquez ici pour redemander le lien.",
                    onClick: () => router.replace("/auth/resend-email?email=" + body.email),
                },
            })
        } else {
            toast(response?.message || "Une erreur s'est produite !", {
                description: response?.error,
            })
        }
        setIsLoading(false)
    }


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="py-6">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Content de te revoir</CardTitle>
                    <CardDescription>
                        Saisis tes accès pour accéder à ton compte
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        await handleLogin(formData);
                    }}>
                        <div className="grid gap-6">

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Adresse mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        data-testid="email"
                                        name="email"
                                        placeholder="m@example.com"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Mot de passe</Label>
                                        <Link
                                            href="/auth/forgot-password"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Mot de passe oublié ?
                                        </Link>
                                    </div>
                                    <Input id="password" data-testid="password" name="mot_de_passe" type="password" required />
                                </div >
                                <Button className="cursor-pointer w-full" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Soumission...
                                        </>
                                    ) : (
                                        <>
                                            Soumettre
                                        </>
                                    )}
                                </Button>
                            </div >
                            <div className="text-center text-sm">
                                Tu n'es pas encore inscrit ? &nbsp;
                                <Link href="/auth/register" className="underline underline-offset-4">
                                    Crée ton compte
                                </Link>
                            </div>
                        </div >
                    </form >
                </CardContent >
            </Card >

        </div >
    )
}
