"use client"

import * as React from "react"
import { Camera, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfileSettings() {
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
    <div className="space-y-6">
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Photo de profil</CardTitle>
          <CardDescription>Choisissez une photo de profil pour votre compte</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <form onSubmit={(e) => e.preventDefault()}>
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Mettez à jour vos informations personnelles et préférences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Entrez votre prénom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom de famille</Label>
                <Input id="lastName" placeholder="Entrez votre nom de famille" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Entrez votre email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input id="phone" type="tel" placeholder="Entrez votre numéro de téléphone" />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select defaultValue="UTC">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un fuseau horaire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                  <SelectItem value="EST">EST (GMT-5)</SelectItem>
                  <SelectItem value="PST">PST (GMT-8)</SelectItem>
                  <SelectItem value="IST">IST (GMT+5:30)</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" placeholder="Écrivez une courte bio sur vous" className="min-h-[100px]" />
            </div> */}
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline">Annuler</Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer 
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}