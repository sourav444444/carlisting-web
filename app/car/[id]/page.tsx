"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  Fuel,
  Gauge,
  Settings,
  Star,
  Zap,
  Award,
  Phone,
  Mail,
  MapPin,
  Shield,
  Heart,
  Share2,
} from "lucide-react"
import { motion } from "framer-motion"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import CarImage from "@/components/ui/car-image"
import { getCars, type Car } from "@/lib/storage"
import { toast } from "@/hooks/use-toast"

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const carId = Number.parseInt(params.id as string)
    const cars = getCars()
    const foundCar = cars.find((c) => c.id === carId)

    if (foundCar) {
      setCar(foundCar)
      // Check if car is in favorites (localStorage)
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      setIsFavorite(favorites.includes(carId))
    }
    setLoading(false)
  }, [params.id])

  const toggleFavorite = () => {
    if (!car) return

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    let newFavorites

    if (isFavorite) {
      newFavorites = favorites.filter((id: number) => id !== car.id)
      toast({
        title: "💔 Removed from Favorites",
        description: "Car removed from your favorites list",
      })
    } else {
      newFavorites = [...favorites, car.id]
      toast({
        title: "❤️ Added to Favorites",
        description: "Car added to your favorites list",
      })
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const shareCard = () => {
    if (navigator.share) {
      navigator.share({
        title: car?.name,
        text: `Check out this amazing ${car?.name} for $${car?.price.toLocaleString()}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "🔗 Link Copied",
        description: "Car page link copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Car Not Found</h1>
            <p className="text-gray-600 mb-8">The car you're looking for doesn't exist.</p>
            <Link href="/">
              <Button className="btn-modern text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Collection
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const specifications = [
    { label: "Year", value: car.year, icon: Calendar },
    { label: "Mileage", value: car.mileage, icon: Gauge },
    { label: "Fuel Type", value: car.fuelType, icon: Fuel },
    { label: "Transmission", value: car.transmission, icon: Settings },
  ]

  const features = [
    "Premium Sound System",
    "Leather Interior",
    "Navigation System",
    "Backup Camera",
    "Bluetooth Connectivity",
    "Climate Control",
    "Keyless Entry",
    "Safety Features",
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <div className="container mx-auto px-4 py-24">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link
            href="/"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Collection
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Card className="card-modern border-0 overflow-hidden">
              <div className="relative">
                <CarImage src={car.image} alt={car.name} width={600} height={400} className="w-full h-96" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {car.featured && (
                    <Badge className="bg-emerald-500 text-white font-semibold neon-glow-green">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {car.badge && (
                    <Badge className="bg-blue-500 text-white font-semibold">
                      <Award className="w-3 h-3 mr-1" />
                      {car.badge}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full backdrop-blur-md transition-all ${
                      isFavorite
                        ? "bg-red-500 text-white"
                        : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={shareCard}
                    className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-emerald-500 backdrop-blur-md transition-all"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4">
                  <span className="text-3xl font-bold text-white neon-text-green">${car.price.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="space-y-6">
              {/* Title and Description */}
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4 neon-text-green">{car.name}</h1>
                <p className="text-lg text-gray-600 leading-relaxed">{car.description}</p>
              </div>

              {/* Specifications */}
              <Card className="card-modern border-0">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-emerald-100 rounded-full">
                          <spec.icon className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{spec.label}</p>
                          <p className="font-semibold text-gray-800">{spec.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="card-modern border-0">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Actions */}
              <div className="space-y-4">
                <Link href={`/enquiry?car=${encodeURIComponent(car.name)}&id=${car.id}`} className="w-full">
                  <Button className="btn-modern w-full text-white font-semibold py-4 text-lg">
                    <Zap className="mr-2 h-5 w-5" />
                    Enquire About This Car
                  </Button>
                </Link>

                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                  <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <MapPin className="mr-2 h-4 w-4" />
                    Visit
                  </Button>
                </div>
              </div>

              {/* Trust Indicators */}
              <Card className="card-modern border-0 bg-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500 rounded-full">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Trusted Dealer</h3>
                      <p className="text-gray-600">Verified quality • 30-day warranty • Secure transaction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Related Cars Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getCars()
              .filter((c) => c.id !== car.id)
              .slice(0, 3)
              .map((relatedCar) => (
                <Link key={relatedCar.id} href={`/car/${relatedCar.id}`}>
                  <Card className="card-modern border-0 overflow-hidden hover-scale cursor-pointer">
                    <div className="relative">
                      <CarImage
                        src={relatedCar.image}
                        alt={relatedCar.name}
                        width={300}
                        height={200}
                        className="w-full h-48"
                      />
                      <div className="absolute bottom-4 right-4">
                        <span className="text-lg font-bold text-white neon-text-green">
                          ${relatedCar.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">{relatedCar.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{relatedCar.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
