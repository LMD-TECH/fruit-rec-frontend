import { UserActivity } from "../components/user-activity"

export default function ActivityPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord des activités</h1>
          <p className="text-muted-foreground">Suivez vos analyses de détection de fruits et l'historique des téléversements d'images</p>
        </div>
        <UserActivity />

      </div>
    </main>

  )
}