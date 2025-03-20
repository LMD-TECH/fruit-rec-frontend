"use client"

import type * as React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, ImagePlus, Loader2, Upload, X } from "lucide-react"

import { cn, handleRequest } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

type FileStatus = "idle" | "selected" | "uploading" | "success" | "error"

interface FileWithProgress {
    id: string
    file: File
    progress: number
    status: FileStatus
    analysis?: string
    previewUrl?: string
}

type ResponseAnalysis = {
    global_result: string;
    images: string[]
    result_data: {
        img_id: string;
        image_url: string;
        results: {
            quantity: string;
            fruit_name: string;
        }[]
    }[]
}

const analyzeImage = async (files: File[]): Promise<ResponseAnalysis | null> => {
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    const formData = new FormData()
    files.forEach((file) => {
        formData.append("files", file);
    });
    const result = await handleRequest<ResponseAnalysis>({ endpoint: "/api/activities/create-activity", method: "POST", contentType: "multipart/form-data", body: formData })

    // const fruitAnalyses = [
    //     "Détecté : 4 bananes et 2 pommes en bon état",
    //     "Trouvé : 3 oranges, 2 mangues et 1 ananas",
    //     "Identifié : 5 bananes mûres et 3 pommes vertes",
    //     "L'analyse montre : 2 mangues et 4 kiwis",
    //     "Détecté : 6 fraises fraîches et 2 citrons",
    // ];
    if (result?.statusCode !== 201) return null
    return result?.data
}

export function FileUploadForm() {
    const [files, setFiles] = useState<FileWithProgress[]>([])
    const [fileStatus, setFileStatus] = useState<FileStatus>("idle")
    const [description, setDescription] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const createPreviewUrl = useCallback((file: File): string | undefined => {
        if (typeof window === "undefined") return undefined
        try {
            return URL.createObjectURL(file)
        } catch (error) {
            console.error("Error creating preview URL:", error)
            return undefined
        }
    }, [])

    const revokePreviewUrl = useCallback((url?: string) => {
        if (typeof window === "undefined" || !url) return
        try {
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Error revoking preview URL:", error)
        }
    }, [])

    useEffect(() => {
        return () => {
            // Cleanup function to revoke URLs when component unmounts
            files.forEach((fileData) => {
                if (fileData.previewUrl) {
                    revokePreviewUrl(fileData.previewUrl)
                }
            })
        }
    }, [files, revokePreviewUrl])

    const addFiles = useCallback(
        (newFiles: File[]) => {
            const fileEntries = newFiles.map((file) => ({
                id: Math.random().toString(36).substring(7),
                file,
                progress: 0,
                status: "selected" as FileStatus,
                previewUrl: createPreviewUrl(file),
            }))
            setFiles((prev) => [...prev, ...fileEntries])
            setFileStatus("selected")
        },
        [createPreviewUrl],
    )

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        if (selectedFiles.length > 0) {
            addFiles(selectedFiles)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFiles = Array.from(e.dataTransfer.files)
        if (droppedFiles.length > 0) {
            addFiles(droppedFiles)
        }
    }

    const handleUpload = async () => {
        if (files.length === 0) return

        setFileStatus("uploading")

        const updatedFiles = [...files]
        // for (let i = 0; i < updatedFiles.length; i++) {
        //     const fileData = updatedFiles[i]
        //     if (fileData.status !== "success") {
        //         fileData.status = "uploading"

        //         for (let progress = 0; progress <= 100; progress += 10) {
        //             fileData.progress = progress
        //             setFiles([...updatedFiles])

        //             await new Promise((resolve) => setTimeout(resolve, 200))
        //         }

        //         if (fileData.file.type.startsWith("image/")) {
        //             const result = await analyzeImage(fileData.file)
        //             fileData.analysis = result?.global_result ?? "Error"
        //             fileData.previewUrl = result?.images[0];
        //         }

        //         fileData.status = "success"
        //         setFiles([...updatedFiles])
        //     }
        // }
        const filesData = updatedFiles.map(file => file.file)
        const result = await analyzeImage(filesData)
        setFileStatus("success")
        const les_resultats = result?.result_data
        const newUpdatedFiles = [...updatedFiles].map((file, index) => {
            file.previewUrl = les_resultats?.[index].image_url
            return file
        })
        // const analyses = files
        //     .filter((f) => f.analysis)
        //     .map((f) => f.analysis)
        //     .join("\n\n")

        // setDescription(analyses)
        setFiles(newUpdatedFiles)
        setDescription(result?.global_result || "Error")
    }

    const handleReset = useCallback(() => {
        files.forEach((fileData) => {
            if (fileData.previewUrl) {
                revokePreviewUrl(fileData.previewUrl)
            }
        })
        setFiles([])
        setFileStatus("idle")
        setDescription("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }, [files, revokePreviewUrl])

    const handleRemoveFile = useCallback(
        (id: string) => {
            setFiles((prev) => {
                const fileToRemove = prev.find((f) => f.id === id)
                if (fileToRemove?.previewUrl) {
                    revokePreviewUrl(fileToRemove.previewUrl)
                }
                const remaining = prev.filter((f) => f.id !== id)
                if (remaining.length === 0) {
                    setFileStatus("idle")
                }
                return remaining
            })
        },
        [revokePreviewUrl],
    )

    const handleSubmitDescription = () => {
        console.log(
            "Files:",
            files.map((f) => ({ name: f.file.name, analysis: f.analysis })),
        )
        console.log("Description:", description)

        setTimeout(() => {
            handleReset()
        }, 1000)
    }

    const renderPreview = (fileData: FileWithProgress, showPlaceholder: boolean = false) => {
        console.log("renderPreview", fileData.previewUrl)
        // if (showPlaceholder) {
        //     return (<img
        //         src="/placeholder.svg"
        //         alt='Image'
        //         className="w-full h-full object-cover"
        //     />)
        // }
        return (<img
            src={fileData.previewUrl || "/placeholder.svg"}
            alt={`Preview of ${fileData.file.name}`}
            className="w-full h-full object-cover"
        />)
    }

    return (
        <Card className="w-full overflow-hidden border-2 shadow-md transition-all duration-300">

            <CardHeader className=" bg-primary/10 border-b py-3 ">
                <h2 className="text-xl font-medium mt-0">Détection & description de fruit</h2>
                <p className="text-sm text-muted-foreground">Téléverse des images pour détecter et compter des fruits</p>
            </CardHeader>


            <CardContent className="p-6">
                <AnimatePresence mode="wait">
                    {fileStatus === "idle" || fileStatus === "selected" ? (
                        <motion.div
                            key="upload-area"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center",
                                    isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/30",
                                    fileStatus === "selected" ? "bg-secondary/10" : "",
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="p-4 bg-secondary/20 rounded-full">
                                        <ImagePlus className="h-10 w-10 text-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <p className="font-medium">Glisse & dépose tes fichiers ici.</p>
                                        <p className="text-sm text-muted-foreground">ou clique sur le bouton pour choisir</p>
                                    </div>

                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        multiple
                                    />

                                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="cursor-pointer mt-2">
                                        Choisis une ou plusieurs images
                                    </Button>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-6"
                                >
                                    <ScrollArea className="h-[300px] rounded-lg border bg-muted/30 p-4">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {files.map((fileData) => (
                                                <div
                                                    key={fileData.id}
                                                    className="relative group aspect-square rounded-lg overflow-hidden bg-muted/30"
                                                >
                                                    {renderPreview(fileData)}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"

                                                            className="h-8 w-8 cursor-pointer"
                                                            onClick={() => handleRemoveFile(fileData.id)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="mt-4 flex justify-end gap-2">
                                        <Button variant="outline" className="cursor-pointer" onClick={handleReset}>
                                            <X className="mr-2 h-4 w-4" />
                                            Annuler
                                        </Button>
                                        <Button className="cursor-pointer" onClick={handleUpload}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Soumettre
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : fileStatus === "uploading" ? (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="py-8"
                        >
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold">Upload en cours...</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Merci de patienter pendant que nous traitons tes images</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {files.map((fileData) => (
                                        <div key={fileData.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                                            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted/30">
                                                {renderPreview(fileData, true)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{fileData.file.name}</p>
                                                <div className="mt-2 h-2 rounded-full bg-muted/30 overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-300"
                                                        style={{ width: `${fileData.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="ml-2">
                                                <div className="relative flex items-center justify-center mb-4">
                                                    <svg className="w-24 h-24 rotate-90 transform">
                                                        <circle
                                                            className="text-muted/30"
                                                            strokeWidth="4"
                                                            stroke="currentColor"
                                                            fill="transparent"
                                                            r="38"
                                                            cx="48"
                                                            cy="48"
                                                        />
                                                        <circle
                                                            className="text-primary"
                                                            strokeWidth="4"
                                                            strokeDasharray={2 * Math.PI * 38}
                                                            strokeDashoffset={2 * Math.PI * 38 * (1 - fileData.progress / 100)}
                                                            strokeLinecap="round"
                                                            stroke="currentColor"
                                                            fill="transparent"
                                                            r="38"
                                                            cx="48"
                                                            cy="48"
                                                        />
                                                    </svg>
                                                    <div className="absolute flex flex-col items-center justify-center">
                                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                        <span className="text-sm font-medium mt-1">{Math.round(fileData.progress)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : fileStatus === "success" ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="py-4"
                        >
                            <div className="flex flex-col items-center justify-center gap-6 mb-8">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <CheckCircle2 className="h-12 w-12 text-primary" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold">Upload Terminé!</h3>
                                    <p className="text-muted-foreground mt-1">Nous avons détecté et compté les fruits dans vos images</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {files.map((fileData) => (
                                        <div key={fileData.id} className="aspect-square rounded-lg overflow-hidden bg-muted/30">
                                            {renderPreview(fileData, true)}

                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="analysis">Résultat après analyse:</Label>
                                    <div
                                        id="analysis"
                                        className="w-full min-h-32 p-3 rounded-md border bg-muted/30 font-mono text-sm whitespace-pre-wrap"
                                    >
                                        {description}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" className='cursor-pointer' onClick={handleReset}>
                                        Téléverser d'autre
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </CardContent>

            <CardFooter className="bg-muted/20 border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">Téléverse des images claires des fruits pour de meilleurs résultats de détection</p>
            </CardFooter>
        </Card>
    )
}

