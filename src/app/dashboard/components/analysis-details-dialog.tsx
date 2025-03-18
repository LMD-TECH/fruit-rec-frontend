"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Apple, Banana, Grape, ImageIcon, X, ZoomIn } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, ImageData } from "@/types/activity"

interface AnalysisDetailsProps {
    activity: Activity | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AnalysisDetailsDialog({ activity, open, onOpenChange }: AnalysisDetailsProps) {
    const [selectedImage, setSelectedImage] = React.useState<ImageData | null>(null)

    // Mock multiple images for the activity
    // const images = Array(activity?.nbre_total_img || 0)
    //     .fill(null)
    //     .map((_, i) => ({
    //         id: i,
    //         url: "/placeholder.svg",
    //         analysis: activity?.images.flatMap(i => i.results),
    //         timestamp: new Date(activity?.date_televersement || "").getTime() + i * 1000 * 60, // Add minutes for each image
    //     }))


    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="max-w-[100vw] max-h-[90vh] w-full h-full overflow-auto p-0 rounded-lg shadow-lg">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Détails de l'analyse</DialogTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{format(activity?.date_televersement || new Date(), "d MMMM yyyy")}</p>
                </DialogHeader>

                <div className="flex-1 grid md:grid-cols-[300px_1fr] divide-x">
                    <div className="p-4 border-b md:border-b-0">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Images téléversées</h3>
                            <ScrollArea className="h-[calc(80vh-180px)]">
                                <div className="grid gap-4 pr-4">
                                    {activity?.images.map((image, index) => (
                                        <div
                                            key={image.img_id}
                                            className={`
                        relative group rounded-lg overflow-hidden cursor-pointer
                        ${selectedImage?.img_id === image.img_id ? "ring-2 ring-primary" : ""}
                      `}
                                            onClick={() => setSelectedImage(image)}
                                        >
                                            <div className="aspect-video w-full bg-muted/30">
                                                <img
                                                    src={image.image_url || "/placeholder.svg"}
                                                    alt={`Téléversement ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ZoomIn className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>

                    <div className="p-6">
                        {selectedImage !== null ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImage.img_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="aspect-video rounded-lg overflow-hidden bg-muted/30">
                                        <img
                                            src={selectedImage.image_url || "/placeholder.svg"}
                                            alt={`Téléversement sélectionné ${1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold">Détails du téléversement</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {format(activity?.date_televersement || "", "HH:mm")}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">Fruits détectés :</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {selectedImage.results?.map((fruit: any, index: number) => (
                                                    <div key={index} className="flex items-center gap-2 rounded-md bg-muted/50 p-3">
                                                        {fruit.fruit_name === "Pommes" && <Apple className="h-4 w-4 text-primary" />}
                                                        {fruit.name === "Bananes" && <Banana className="h-4 w-4 text-primary" />}
                                                        {fruit.name === "Oranges" && <Grape className="h-4 w-4 text-primary" />}
                                                        {fruit.name === "Mangues" && <Apple className="h-4 w-4 text-primary" />}
                                                        <span className="text-sm font-medium">
                                                            {fruit.quantity} {fruit.fruit_name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">Résumé de l'analyse</h4>
                                            <div className="rounded-md bg-muted/30 p-4">
                                                <p className="text-sm">
                                                    Un total de {selectedImage.results.length} fruits
                                                    détectés dans cette image. L'analyse montre une diversité de fruits avec une bonne confiance de
                                                    détection.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                <div className="text-center">
                                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                                    <p>Sélectionnez une image pour voir les détails de l'analyse</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}