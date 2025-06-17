"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Trash2, Users, TrendingUp, Star, Zap, Edit, LogOut } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import LoginForm from "@/components/admin/login-form"
import ImageUpload from "@/components/ui/image-upload"
import { isAuthenticated, logout, getAuthUser } from "@/lib/auth"
import { carsApi, enquiriesApi, type Car, type Enquiry } from "@/lib/api-client"

const FloatingLabel = ({ label, value, focused }: { label: string; value: string; focused: boolean }) => (
  <span className={`floating-label ${value || focused ? "active" : ""}`}>{label}</span>
)

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cars, setCars] = useState<Car[]>([])
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [editingCar, setEditingCar] = useState<Car | null>(null)

  const [carForm, setCarForm] = useState({
    name: "",
    price: "",
    description: "",
    year: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    image: "",
    badge: "",
    featured: false,
  })

  useEffect(() => {
    const checkAuth = () => {
      setAuthenticated(isAuthenticated())
      setLoading(false)
    }

    checkAuth()

    if (isAuthenticated()) {
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    try {
      const [carsData, enquiriesData] = await Promise.all([carsApi.getAll(), enquiriesApi.getAll()])
      setCars(carsData)
      setEnquiries(enquiriesData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  const handleLogin = () => {
    setAuthenticated(true)
    fetchData()
  }

  const handleLogout = () => {
    logout()
    setAuthenticated(false)
    toast({
      title: "👋 Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  const handleCarFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setCarForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImageSelect = (imageUrl: string) => {
    setCarForm((prev) => ({ ...prev, image: imageUrl }))
  }

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingCar) {
        await carsApi.update(editingCar.id, {
          name: carForm.name,
          price: Number(carForm.price),
          description: carForm.description,
          year: Number(carForm.year),
          mileage: carForm.mileage,
          fuelType: carForm.fuelType,
          transmission: carForm.transmission,
          image: carForm.image,
          badge: carForm.badge,
          featured: carForm.featured,
        })

        await fetchData()
        toast({
          title: "🚀 Car Updated Successfully!",
          description: "The vehicle has been updated in your collection.",
        })
        setEditingCar(null)
      } else {
        await carsApi.create({
          name: carForm.name,
          price: Number(carForm.price),
          description: carForm.description,
          year: Number(carForm.year),
          mileage: carForm.mileage,
          fuelType: carForm.fuelType,
          transmission: carForm.transmission,
          image: carForm.image,
          badge: carForm.badge,
          featured: carForm.featured,
        })

        await fetchData()
        toast({
          title: "🚀 Car Added Successfully!",
          description: "The new vehicle has been added to your premium collection.",
        })
      }

      setCarForm({
        name: "",
        price: "",
        description: "",
        year: "",
        mileage: "",
        fuelType: "",
        transmission: "",
        image: "",
        badge: "",
        featured: false,
      })
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to save car. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCar = (car: Car) => {
    setEditingCar(car)
    setCarForm({
      name: car.name,
      price: car.price.toString(),
      description: car.description,
      year: car.year.toString(),
      mileage: car.mileage,
      fuelType: car.fuelType,
      transmission: car.transmission,
      image: car.image,
      badge: car.badge || "",
      featured: car.featured || false,
    })
  }

  const handleDeleteCar = async (id: number) => {
    try {
      await carsApi.delete(id)
      await fetchData()
      toast({
        title: "🗑️ Car Deleted",
        description: "The vehicle has been removed from your collection.",
      })
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to delete car. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEnquiry = async (id: number) => {
    try {
      await enquiriesApi.delete(id)
      await fetchData()
      toast({
        title: "🗑️ Enquiry Deleted",
        description: "The enquiry has been removed from your dashboard.",
      })
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to delete enquiry. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const stats = [
    { label: "Total Cars", value: cars.length, icon: Star, color: "from-emerald-400 to-green-500" },
    { label: "Total Enquiries", value: enquiries.length, icon: Users, color: "from-blue-400 to-blue-500" },
    {
      label: "This Month",
      value: enquiries.filter((e) => new Date(e.submittedAt).getMonth() === new Date().getMonth()).length,
      icon: TrendingUp,
      color: "from-purple-400 to-purple-500",
    },
    {
      label: "Featured Cars",
      value: cars.filter((car) => car.featured).length,
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    )
  }

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <div className="container mx-auto px-4 py-24">
        {/* Admin Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {getAuthUser()?.username}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="card-modern border-0 hover-scale">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} neon-glow-green`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Tabs defaultValue="add-car" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-md border border-gray-200">
              <TabsTrigger
                value="add-car"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-400 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                <Plus className="h-4 w-4" />
                <span>{editingCar ? "Edit Car" : "Add Car"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="manage-cars"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-400 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                <Star className="h-4 w-4" />
                <span>Manage Cars ({cars.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="enquiries"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-400 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                <Eye className="h-4 w-4" />
                <span>Enquiries ({enquiries.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Add Car Tab */}
            <TabsContent value="add-car">
              <Card className="card-modern border-0">
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 neon-glow-green">
                      {editingCar ? <Edit className="h-8 w-8 text-white" /> : <Plus className="h-8 w-8 text-white" />}
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-800">
                    {editingCar ? "Edit Vehicle" : "Add New Vehicle"}
                  </CardTitle>
                  {editingCar && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingCar(null)
                        setCarForm({
                          name: "",
                          price: "",
                          description: "",
                          year: "",
                          mileage: "",
                          fuelType: "",
                          transmission: "",
                          image: "",
                          badge: "",
                          featured: false,
                        })
                      }}
                      className="mt-4"
                    >
                      Cancel Edit
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <form onSubmit={handleAddCar} className="space-y-6">
                    {/* Image Upload */}
                    <ImageUpload onImageSelect={handleImageSelect} currentImage={carForm.image} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={carForm.name}
                          onChange={handleCarFormChange}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-4 input-modern rounded-lg placeholder-transparent"
                          placeholder="Car Name"
                        />
                        <FloatingLabel label="Car Name *" value={carForm.name} focused={focusedField === "name"} />
                      </div>

                      <div className="relative">
                        <input
                          id="price"
                          name="price"
                          type="number"
                          required
                          value={carForm.price}
                          onChange={handleCarFormChange}
                          onFocus={() => setFocusedField("price")}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-4 input-modern rounded-lg placeholder-transparent"
                          placeholder="Price"
                        />
                        <FloatingLabel label="Price ($) *" value={carForm.price} focused={focusedField === "price"} />
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        id="description"
                        name="description"
                        required
                        value={carForm.description}
                        onChange={handleCarFormChange}
                        onFocus={() => setFocusedField("description")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-4 input-modern rounded-lg resize-none"
                        placeholder="Describe the car's features, condition, and highlights..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { name: "year", label: "Year *", type: "number", placeholder: "2024" },
                        { name: "mileage", label: "Mileage *", type: "text", placeholder: "32 MPG" },
                        { name: "fuelType", label: "Fuel Type *", type: "text", placeholder: "Gasoline" },
                        { name: "transmission", label: "Transmission *", type: "text", placeholder: "Automatic" },
                      ].map((field) => (
                        <div key={field.name} className="relative">
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            required
                            value={carForm[field.name as keyof typeof carForm]}
                            onChange={handleCarFormChange}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-4 py-4 input-modern rounded-lg placeholder-transparent"
                            placeholder={field.placeholder}
                          />
                          <FloatingLabel
                            label={field.label}
                            value={carForm[field.name as keyof typeof carForm] as string}
                            focused={focusedField === field.name}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="relative">
                      <input
                        id="badge"
                        name="badge"
                        type="text"
                        value={carForm.badge}
                        onChange={handleCarFormChange}
                        onFocus={() => setFocusedField("badge")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-4 input-modern rounded-lg placeholder-transparent"
                        placeholder="Badge (e.g., New, Featured)"
                      />
                      <FloatingLabel
                        label="Badge (Optional)"
                        value={carForm.badge}
                        focused={focusedField === "badge"}
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        id="featured"
                        name="featured"
                        type="checkbox"
                        checked={carForm.featured}
                        onChange={handleCarFormChange}
                        className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="featured" className="text-gray-700 font-medium">
                        Mark as Featured Car
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="btn-modern w-full text-white font-semibold py-4 text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          {editingCar ? "Updating Vehicle..." : "Adding Vehicle..."}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {editingCar ? <Edit className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
                          {editingCar ? "Update Vehicle" : "Add Vehicle"}
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manage Cars Tab */}
            <TabsContent value="manage-cars">
              <Card className="card-modern border-0">
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 neon-glow-blue">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-800">Manage Cars</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  {cars.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-4 rounded-full bg-gray-100 w-fit mx-auto mb-4">
                        <Star className="h-12 w-12 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-lg">No cars added yet.</p>
                      <p className="text-gray-500">Add your first car to get started.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-200 hover:bg-gray-50">
                            <TableHead className="text-gray-700">Car Details</TableHead>
                            <TableHead className="text-gray-700">Price</TableHead>
                            <TableHead className="text-gray-700">Year</TableHead>
                            <TableHead className="text-gray-700">Status</TableHead>
                            <TableHead className="text-gray-700">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cars.map((car) => (
                            <TableRow key={car.id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={car.image || "/placeholder.svg"}
                                    alt={car.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-800">{car.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {car.fuelType} • {car.transmission}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="font-semibold text-emerald-600">${car.price.toLocaleString()}</p>
                              </TableCell>
                              <TableCell>
                                <p className="text-gray-700">{car.year}</p>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col space-y-1">
                                  {car.featured && (
                                    <Badge className="bg-emerald-100 text-emerald-700 w-fit">Featured</Badge>
                                  )}
                                  {car.badge && <Badge className="bg-blue-100 text-blue-700 w-fit">{car.badge}</Badge>}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(`/car/${car.id}`, "_blank")}
                                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditCar(car)}
                                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteCar(car.id)}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 border-red-200"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enquiries Tab */}
            <TabsContent value="enquiries">
              <Card className="card-modern border-0">
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 animate-pulse-glow">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-800">Customer Enquiries</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  {enquiries.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-4 rounded-full bg-gray-100 w-fit mx-auto mb-4">
                        <Users className="h-12 w-12 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-lg">No enquiries yet.</p>
                      <p className="text-gray-500">Customer enquiries will appear here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-200 hover:bg-gray-50">
                            <TableHead className="text-gray-700">Customer</TableHead>
                            <TableHead className="text-gray-700">Contact</TableHead>
                            <TableHead className="text-gray-700">Car Interest</TableHead>
                            <TableHead className="text-gray-700">Message</TableHead>
                            <TableHead className="text-gray-700">Date</TableHead>
                            <TableHead className="text-gray-700">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enquiries.map((enquiry) => (
                            <TableRow key={enquiry.id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                              <TableCell>
                                <div>
                                  <p className="font-medium text-gray-800">{enquiry.name}</p>
                                  <p className="text-sm text-gray-500">{enquiry.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-emerald-100 text-emerald-700">{enquiry.phone}</Badge>
                              </TableCell>
                              <TableCell>
                                <p className="font-medium text-gray-800">{enquiry.carName}</p>
                              </TableCell>
                              <TableCell>
                                <p className="max-w-xs truncate text-gray-600" title={enquiry.message}>
                                  {enquiry.message || "No message"}
                                </p>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-gray-500">{formatDate(enquiry.submittedAt)}</p>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteEnquiry(enquiry.id)}
                                  className="bg-red-100 hover:bg-red-200 text-red-600 border-red-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
