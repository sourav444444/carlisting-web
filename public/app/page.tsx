"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fuel, Gauge, Calendar, Star, Zap, Award, ArrowRight, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import CarImage from "@/components/ui/car-image"
import { carsApi, type Car } from "@/lib/api-client"

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const fetchedCars = await carsApi.getAll()
        setCars(fetchedCars)
      } catch (error) {
        console.error("Failed to fetch cars:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  const featuredCars = cars.filter((car) => car.featured)

  useEffect(() => {
    if (featuredCars.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredCars.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [featuredCars.length])

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

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50" />

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-emerald-200 rounded-full animate-float opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                <span className="neon-text-green">Find Your Perfect Car</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover premium vehicles with modern technology and exceptional performance. Your dream car awaits.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-modern text-white font-semibold px-8 py-4 text-lg">
                  <Zap className="mr-2 h-5 w-5" />
                  Explore Collection
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg"
                >
                  <Star className="mr-2 h-5 w-5" />
                  Featured Cars
                </Button>
              </div>
            </motion.div>

            {/* Right - Featured Car Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex justify-center"
            >
              {featuredCars.length > 0 ? (
                <div className="w-full max-w-md">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="card-modern border-0 overflow-hidden hover-scale">
                        <div className="relative">
                          <CarImage
                            src={featuredCars[currentSlide]?.image || ""}
                            alt={featuredCars[currentSlide]?.name || "Featured Car"}
                            width={400}
                            height={250}
                            className="w-full h-48"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                          {/* Featured Badge */}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-emerald-500 text-white font-semibold neon-glow-green">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          </div>

                          {/* Price */}
                          <div className="absolute bottom-4 right-4">
                            <span className="text-xl font-bold text-white neon-text-green">
                              ${featuredCars[currentSlide]?.price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{featuredCars[currentSlide]?.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{featuredCars[currentSlide]?.description}</p>

                          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-emerald-500" />
                              <span className="text-gray-600">{featuredCars[currentSlide]?.year}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Fuel className="h-4 w-4 text-green-500" />
                              <span className="text-gray-600">{featuredCars[currentSlide]?.fuelType}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Link href={`/car/${featuredCars[currentSlide]?.id}`} className="w-full">
                              <Button
                                variant="outline"
                                className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            </Link>
                            <Link
                              href={`/enquiry?car=${encodeURIComponent(featuredCars[currentSlide]?.name || "")}&id=${featuredCars[currentSlide]?.id}`}
                              className="w-full"
                            >
                              <Button className="btn-modern w-full text-white font-semibold">
                                <Zap className="mr-2 h-4 w-4" />
                                Enquire
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatePresence>

                  {/* Carousel Indicators */}
                  {featuredCars.length > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                      {featuredCars.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentSlide ? "bg-emerald-500 w-6" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-md">
                  <Card className="card-modern border-0 p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Featured Cars</h3>
                    <p className="text-gray-600">Featured cars will appear here once added by admin.</p>
                  </Card>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Car Listings */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 neon-text-green">Premium Collection</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover extraordinary vehicles that redefine performance and luxury
            </p>
          </motion.div>

          {cars.length === 0 ? (
            <div className="text-center py-12">
              <div className="card-modern rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Cars Available</h3>
                <p className="text-gray-600 mb-4">Cars will appear here once added by admin.</p>
                <Link href="/admin">
                  <Button className="btn-modern text-white">
                    Go to Admin Panel
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="card-modern border-0 overflow-hidden hover-scale">
                    <CardHeader className="p-0 relative">
                      <div className="relative overflow-hidden">
                        <CarImage
                          src={car.image}
                          alt={car.name}
                          width={400}
                          height={300}
                          className="w-full h-48 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                        {/* Badge */}
                        {car.badge && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-emerald-500 text-white font-semibold neon-glow-green">
                              <Award className="w-3 h-3 mr-1" />
                              {car.badge}
                            </Badge>
                          </div>
                        )}

                        {/* Price overlay */}
                        <div className="absolute bottom-4 right-4">
                          <span className="text-2xl font-bold text-white neon-text-green">
                            ${car.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <CardTitle className="text-xl mb-3 text-gray-800 group-hover:text-emerald-600 transition-colors">
                        {car.name}
                      </CardTitle>
                      <p className="text-gray-600 mb-4 line-clamp-2">{car.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm text-gray-600">{car.year}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Gauge className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{car.mileage}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Fuel className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">{car.fuelType}</span>
                        </div>
                        <Badge variant="secondary" className="w-fit bg-gray-100 text-gray-700">
                          {car.transmission}
                        </Badge>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <Link href={`/car/${car.id}`} className="w-full">
                          <Button
                            variant="outline"
                            className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/enquiry?car=${encodeURIComponent(car.name)}&id=${car.id}`} className="w-full">
                          <Button className="btn-modern w-full text-white font-semibold">
                            <Zap className="mr-2 h-4 w-4" />
                            Enquire
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
