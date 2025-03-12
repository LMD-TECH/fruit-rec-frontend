"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useCustomQuery } from "@/context/querycontext"
import { toast } from "sonner"

interface PasswordStrength {
  score: number
  feedback: string
}

function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0
  let feedback = ""

  if (password.length >= 8) score += 25
  if (password.match(/[A-Z]/)) score += 25
  if (password.match(/[0-9]/)) score += 25
  if (password.match(/[^A-Za-z0-9]/)) score += 25

  if (score <= 25) {
    feedback = "Mot de passe faible"
  } else if (score <= 50) {
    feedback = "Mot de passe modéré"
  } else if (score <= 75) {
    feedback = "Mot de passe fort"
  } else {
    feedback = "Mot de passe très fort"
  }

  return { score, feedback }
}

function getStrengthColor(score: number): string {
  if (score <= 25) return "text-destructive"
  if (score <= 50) return "text-yellow-500"
  if (score <= 75) return "text-primary"
  return "text-green-500"
}

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const { onMutate } = useCustomQuery()
  const params = useSearchParams()
  const token = params.get("token")
  const router = useRouter()

  const passwordStrength = checkPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast("Les mots de passe ne correspondent pas.", { style: { backgroundColor: "red", color: "white" } })
      return
    }

    setIsLoading(true)
    const response = await onMutate<{ status: boolean, status_code: number }>({ endpoint: `/api/auth/reset-password/${token}`, body: { new_password: password } })

    if (response && response.status_code === 200) {
      toast("Votre mot de passe a bien été reinitialisé.")
      setIsSubmitted(true)
      router.push("/auth/login")
    } else {
      toast("Une erreur s'est produite lors de la reinitilisation du compte.", { style: { backgroundColor: "red", color: "white" } })
    }

    setIsLoading(false)

  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  if (isSubmitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-2 py-6">
          <CardHeader className="space-y-3">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="rounded-full bg-primary/10 p-4"
              >
                <ShieldCheck className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
            <div className="space-y-1 text-center">
              <CardTitle className="text-2xl">Mot de passe réinitialisé !</CardTitle>
              <CardDescription>Votre mot de passe a été réinitialisé avec succès. Redirection vers la page de connexion...</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 py-6">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl">Réinitialiser le mot de passe</CardTitle>
            <CardDescription>Choisissez un nouveau mot de passe pour votre compte</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-2">
                    <Progress value={passwordStrength.score} className="h-1" />
                    <p className={`text-xs ${getStrengthColor(passwordStrength.score)}`}>{passwordStrength.feedback}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 py-6">
            <Button type="submit" className="w-full cursor-pointer" size="lg" disabled={isLoading || password !== confirmPassword}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Réinitialisation en cours...
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
  )
}