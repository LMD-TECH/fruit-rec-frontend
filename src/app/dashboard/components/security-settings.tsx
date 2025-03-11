"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { AlertCircle, Key, Loader2, Shield, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SecuritySettings() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [showChangePassword, setShowChangePassword] = React.useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Recommandation de sécurité</AlertTitle>
        <AlertDescription>
          Activez l'authentification à deux facteurs et utilisez un mot de passe fort pour mieux protéger votre compte.
        </AlertDescription>
      </Alert>

      <Card className="py-6">
        <CardHeader>
          <CardTitle>Mot de passe</CardTitle>
          <CardDescription>Changez votre mot de passe et gérez les paramètres de mot de passe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showChangePassword ? (
            <Button variant="outline" onClick={() => setShowChangePassword(true)}>
              <Key className="mr-2 h-4 w-4" />
              Changer le mot de passe
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input id="currentPassword" type="password" placeholder="Entrez votre mot de passe actuel" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input id="newPassword" type="password" placeholder="Entrez votre nouveau mot de passe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmez le nouveau mot de passe</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirmez votre nouveau mot de passe" />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setShowChangePassword(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    "Mettre à jour le mot de passe"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card className="py-6">
        <CardHeader>
          <CardTitle>Authentification à deux facteurs</CardTitle>
          <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Authentification à deux facteurs</div>
              <div className="text-sm text-muted-foreground">Sécurisez votre compte avec 2FA</div>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>

          {twoFactorEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 pt-4"
            >
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Application d'authentification</p>
                  <p className="text-sm text-muted-foreground">
                    Utilisez une application d'authentification comme Google Authenticator ou Authy
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Configurer l'authentificateur
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Sessions actives</CardTitle>
          <CardDescription>Gérez vos sessions actives et déconnectez-vous des autres appareils</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border divide-y">
            <div className="flex items-start gap-4 p-4">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Session actuelle</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Active</span>
                </div>
                <p className="text-sm text-muted-foreground">Dernière activité : À l'instant</p>
                <p className="text-xs text-muted-foreground">Chrome sur MacOS • Paris, France</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Application mobile</p>
                  <Button variant="ghost" size="sm" className="h-7">
                    Se déconnecter
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Dernière activité : Il y a 2 heures</p>
                <p className="text-xs text-muted-foreground">iPhone 13 • New York, USA</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Se déconnecter de tous les appareils
          </Button>
        </CardFooter>
      </Card> */}
    </div>
  )
}