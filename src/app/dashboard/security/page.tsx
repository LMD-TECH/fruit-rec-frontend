import { SecuritySettings } from "../components/security-settings"

export default function SecurityPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Paramètres de sécurité</h1>
          <p className="text-muted-foreground">Gérez la sécurité et l'authentification de votre compte</p>
        </div>
        <SecuritySettings />
      </div>
    </main>

  )
}