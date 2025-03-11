'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import React from "react"
import { Camera, Loader2, Save, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RegisterForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [isLoading, setIsLoading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [avatarUrl, setAvatarUrl] = React.useState("/placeholder-user.jpg")

    const handleSave = async () => {
        setIsLoading(true)
        // Simuler un appel API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsLoading(false)
    }
    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setAvatarUrl(url)
        }
    }
    return (
        <div >
            <form onSubmit={(e) => e.preventDefault()}>
                <Card className="py-6  ">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Création de ton compte</CardTitle>
                        <CardDescription>
                            Remplis les informations ci-dessous pour créer ton compte.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                                    <AvatarImage src={avatarUrl} />
                                    <AvatarFallback>LG</AvatarFallback>
                                </Avatar>
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={handleAvatarClick}
                                >
                                    <Camera className="h-6 w-6 text-white" />
                                </div>
                                <Input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium">Téléverser une nouvelle photo</h3>
                                <p className="text-sm text-muted-foreground">JPG, GIF ou PNG. Taille maximale de 2 Mo.</p>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Nom de famille</Label>
                                <Input id="lastName" placeholder="Entrez votre nom de famille" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input id="firstName" placeholder="Entrez votre prénom" />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Entrez votre email" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Numéro de téléphone</Label>
                                <Input id="phone" type="tel" placeholder="Entrez votre numéro de téléphone" />
                            </div>

                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input id="password" type="password" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirmation le mot de passe</Label>
                                <Input id="confirm-password" type="password" required />
                            </div>

                        </div>




                        <Button className="cursor-pointer w-full" onClick={handleSave} disabled={isLoading}>
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

                    </CardContent>
                    <div className="text-center text-sm">
                        Tu es déjà inscrit ? &nbsp;
                        <Link href="/auth/login" className="underline underline-offset-4">
                            Connecte toi
                        </Link>
                    </div>
                </Card>
            </form>
        </div>
    )
}
