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

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
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
                    <form>
                        <div className="grid gap-6">

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Adresse mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
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
                                    <Input id="password" type="password" required />
                                </div>
                                <Button asChild type="submit" className="w-full text-white cursor-pointer bg-[#2E7D32]">
                                    <Link href='/dashboard'>Soumettre</Link>
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Tu n'es pas encore inscrit ? &nbsp;
                                <Link href="/auth/register" className="underline underline-offset-4">
                                    Crée ton compte
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

        </div>
    )
}
