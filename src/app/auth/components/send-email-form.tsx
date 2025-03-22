"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCustomQuery } from '@/context/querycontext'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

function sendEmailForm() {

    const [isLoading, setIsLoading] = useState(false)
    const router  =useRouter()
    const {onMutate} = useCustomQuery()

    const params = useSearchParams()
    const email = params.get("email") ?? ""

    const handleSendEmail = async () => {
        setIsLoading(true)
        const result = await onMutate<{"email"?: {to: string, is_sent: boolean, }, message?:string, status_code: number}>({endpoint: "/api/auth/send-validation-email?email="+email, body:{}})
        if(result?.status_code === 200 && result.email?.is_sent){
            toast("Success", {
                description: "Le mail a bie été envoyé.",
                style: {
                    backgroundColor: "red",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                },
                action: {
                    label: "Ouvrir Gmail.",
                    onClick: () => router.push("https://mail.google.com/mail/u/0/#inbox", {}),
                },
            })
        }
        setIsLoading(false)
    }

    return (
        <div>
            <div className="grid gap-2 mb-2">
                <Label>Renseigner votre email ici</Label>
                <Input id="email" name="email" type="email" value={email} required />
            </div >
            <Button className="cursor-pointer w-full" type="button" onClick={handleSendEmail} disabled={isLoading}>
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
        </div>
    )
}

export default sendEmailForm
