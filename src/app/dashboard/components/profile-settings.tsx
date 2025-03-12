"use client";
import * as React from "react"
import { Camera, Loader2, Save } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useUser from "@/hooks/use-user"
import { _User, User_Shema } from "@/types/user.zod"
import { getFirstAndLastChar } from "@/lib/utils"
import { useCustomQuery } from "@/context/querycontext"
import { toast } from "sonner"
import { deleteCookie } from "@/services/cookies.action";

export function ProfileSettings() {
  const [isLoading, setIsLoading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { onMutate } = useCustomQuery()
  const user = useUser()
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(User_Shema),
    defaultValues: user as _User
  })

  React.useEffect(() => {
    if (user) {
      reset({
        prenom: user.prenom || "",
        nom_famille: user.nom_famille || "",
        email: user.email || "",
        numero_telephone: user.numero_telephone || "",
      })
    }
  }, [user, reset])

  const onSubmit = async (data: _User) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("nom_famille", data.nom_famille);
      formData.append("prenom", data.prenom);
      formData.append("numero_telephone", data.numero_telephone);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("photo_profile", fileInputRef.current.files[0]);
      } else {
        formData.append("photo_profile", user?.photo_profile || "");
      }

      const response = await onMutate<{ status_code: number, message: string, error?: string }>({ endpoint: `/api/auth/update-profile/`, body: formData, contentType: "multipart/form-data" });

      if (!response || response.status_code !== 200) {
        toast("Une erreur s'est produite lors du mise à jour de votre compte.", {
          style: { backgroundColor: "red", color: "white" },
          description: response?.error || "Une erreur s'est produite.'"
        })
        return
      }

      if (response.status_code === 200) {
        toast(response.message)
        await deleteCookie("auth_token")
        return
      }

      console.log("Profil mis à jour avec succès !");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


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
          <CardDescription>Choisissez une photo de profil</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={avatarUrl ?? user?.photo_profile} />
                <AvatarFallback>{getFirstAndLastChar(user)}</AvatarFallback>
              </Avatar>
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleAvatarClick}
              >
                <Camera className="h-6 w-6 text-white" />
              </div>
              <Input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Entrez votre prénom" {...register("prenom")} />
                <p className="text-red-500 text-sm">{errors.prenom?.message}</p>

              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom de famille</Label>
                <Input id="lastName" placeholder="Entrez votre nom de famille" {...register("nom_famille")} />
                {errors.nom_famille && <p className="text-red-500 text-sm">{errors.nom_famille.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" disabled type="email" placeholder="Entrez votre email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input id="phone" type="tel" placeholder="Entrez votre numéro de téléphone" {...register("numero_telephone")} />
              {errors.numero_telephone && <p className="text-red-500 text-sm">{errors.numero_telephone.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" type="reset">Annuler</Button>
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
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