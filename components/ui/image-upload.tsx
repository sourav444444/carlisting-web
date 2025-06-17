"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void
  currentImage?: string
  className?: string
}

export default function ImageUpload({ onImageSelect, currentImage, className = "" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || "")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "❌ Invalid File Type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "❌ File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setPreview(imageUrl)
      onImageSelect(imageUrl)
      toast({
        title: "✅ Image Uploaded",
        description: "Image has been successfully uploaded",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeImage = () => {
    setPreview("")
    onImageSelect("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
          isDragging
            ? "border-emerald-500 bg-emerald-50"
            : preview
              ? "border-emerald-300 bg-emerald-25"
              : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="relative">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <Upload className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Car Image</h3>
            <p className="text-gray-600 mb-4">Drag and drop an image here, or click to select</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Choose Image
            </Button>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
      </div>

      {preview && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Image ready for upload</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          >
            Change Image
          </Button>
        </div>
      )}
    </div>
  )
}
