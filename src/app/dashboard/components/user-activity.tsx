"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { format, subDays } from "date-fns"
import { BarChart3, ImageIcon, Apple, Banana, Grape, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnalysisDetailsDialog } from "./analysis-details-dialog"
import { handleRequest } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useCustomQuery } from "@/context/querycontext"
import { Activity, Historique } from "@/types/activity"

// Générateur de données fictives
const generateMockData = () => {
  const today = new Date()
  const activities = []

  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i)
    const uploads = Math.floor(Math.random() * 5)

    if (uploads > 0) {
      const fruits = [
        { name: "Pommes", count: Math.floor(Math.random() * 10) },
        { name: "Bananes", count: Math.floor(Math.random() * 8) },
        { name: "Oranges", count: Math.floor(Math.random() * 6) },
        { name: "Mangues", count: Math.floor(Math.random() * 4) },
      ].filter((fruit) => fruit.count > 0)

      activities.push({
        id: i,
        date,
        uploads,
        totalFruits: fruits.reduce((acc, curr) => acc + curr.count, 0),
        fruits,
      })
    }
  }

  return activities.sort((a, b) => b.date.getTime() - a.date.getTime())
}

const mockData = generateMockData()

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  description: string
}) => (
  <Card className="py-6">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-primary">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
)

const TimelineItem = ({
  activity,
  setSelectedActivity,
}: { activity: Historique; setSelectedActivity: React.Dispatch<React.SetStateAction<any>> }) => {

  const fruits = activity.images.flatMap(item => item.fruits);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex gap-4 pb-8 last:pb-0"
    >
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <ImageIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 w-px bg-border mt-2" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-medium">
              {activity.nbre_total_img} {activity.nbre_total_img === 1 ? "image téléversée" : "images téléversées"}
            </p>
            <p className="text-sm text-muted-foreground">{format(activity.date_televersement, "d MMMM yyyy")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedActivity(activity)}>
            Voir les détails
          </Button>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Fruits détectés :</div>
              <div className="grid grid-cols-2 gap-2">
                {fruits.map((fruit, index: number) => (
                  <div key={index} className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
                    {/* {fruit.fruit_name === "Pommes" && <Apple className="h-4 w-4 text-primary" />}
                    {fruit.fruit_name === "Bananes" && <Banana className="h-4 w-4 text-primary" />}
                    {fruit.fruit_name === "Oranges" && <Grape className="h-4 w-4 text-primary" />}
                    {fruit.fruit_name === "Mangues" && <Apple className="h-4 w-4 text-primary" />} */}
                    <Grape className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {fruit.quantity} {fruit.fruit_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>)
}

export function UserActivity() {
  const [timeRange, setTimeRange] = React.useState("30")
  const [selectedActivity, setSelectedActivity] = React.useState<Historique | null>(null)
  const { getData } = useCustomQuery()
  const { data: activity, isLoading, error } = useQuery<Activity>({ queryFn: () => getData({ endpoint: "/api/activities/activities" }) })

  let historiques: Historique[] = []
  if (activity) {
    historiques = activity.histories
  }

  const totalUploads = mockData.reduce((acc, curr) => acc + curr.uploads, 0)
  const totalFruits = mockData.reduce((acc, curr) => acc + curr.totalFruits, 0)
  const averageFruitsPerImage = (totalFruits / totalUploads).toFixed(1)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleCloseDialog = () => {
    setSelectedActivity(null)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total des images"
          value={activity?.stats.total_images ?? "Non trouvé !"}
          icon={ImageIcon}
          description="Images téléversées au cours des 30 derniers jours"
        />
        <StatCard
          title="Total des fruits détectés"
          value={activity?.stats.total_fruits ?? "Non trouvé !"}
          icon={Apple}
          description="Fruits identifiés sur toutes les images"
        />
        <StatCard
          title="Moyenne de fruits par image"
          value={activity?.stats.moyenne_fruits_images ?? "Non trouvé !"}
          icon={BarChart3}
          description="Nombre moyen de fruits détectés par image"
        />
      </div>

      <Card className="py-6">
        <CardHeader>
          <div className="flex items-center justify-between ">
            <CardTitle>Activités effectuées</CardTitle>
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 derniers jours</SelectItem>
                <SelectItem value="14">14 derniers jours</SelectItem>
                <SelectItem value="30">30 derniers jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-8">
            {historiques && historiques
              .filter((activity) => {
                const days = Number.parseInt(timeRange)
                return new Date(activity.date_televersement) >= subDays(new Date(), days)
              })
              .map((activity) => (
                <TimelineItem key={activity.id_historique} activity={activity} setSelectedActivity={setSelectedActivity} />
              ))}
          </div>
        </CardContent>
      </Card>
      {selectedActivity && (
        <AnalysisDetailsDialog activity={selectedActivity} open={!!selectedActivity} onOpenChange={handleCloseDialog} />
      )}
    </div>
  )
}