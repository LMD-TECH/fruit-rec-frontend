"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation d'un appel API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <AnimatePresence mode="wait">
      {!isSubmitted ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="border-2 py-6">
            <CardHeader className="space-y-3">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <KeyRound className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="space-y-1 text-center">
                <CardTitle className="text-2xl">Mot de passe oublié ?</CardTitle>
                <CardDescription>Pas de souci, nous vous enverrons les instructions de réinitialisation.</CardDescription>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse e-mail</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Entrez votre e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 py-4">
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi des instructions...
                    </>
                  ) : (
                    "Réinitialiser le mot de passe"
                  )}
                </Button>
                <Button variant="ghost" className="w-full" size="lg" asChild>
                  <Link href="/auth/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="border-2 py-6">
            <CardHeader className="space-y-3">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="space-y-1 text-center">
                <CardTitle className="text-2xl">Vérifiez votre e-mail</CardTitle>
                <CardDescription>Nous avons envoyé les instructions de réinitialisation à :</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <p className="font-medium">{email}</p>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Si vous ne voyez pas l'e-mail, vérifiez votre dossier spam ou {" "}
                  <button
                    className="text-primary underline-offset-4 hover:underline"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    cliquez ici pour renvoyer
                  </button>
                  .
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" size="lg" asChild>
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la connexion
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
