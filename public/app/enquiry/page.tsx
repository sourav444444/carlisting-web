"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { enquiriesApi } from "@/lib/api-client"

const FloatingLabel = ({ label, value, focused }: { label: string; value: string; focused: boolean }) => (
  <span className={`floating-label ${value || focused ? "active" : ""}`}>{label}</span>
)

export default function EnquiryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const carName = searchParams.get("car") || ""
  const carId = searchParams.get("id") || ""

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    carName: carName,
    carId: carId,
  })

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  })

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      carName: carName,
      carId: carId,
    }))
  }, [carName, carId])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    // Validates phone with country code format: +1234567890 or +1 234 567 8900 or +1-234-567-8900
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    const cleanPhone = phone.replace(/[\s-]/g, "")
    return phoneRegex.test(cleanPhone)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user starts typing
    if (name === "email" && errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }))
    }
    if (name === "phone" && errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email
    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
      toast({
        title: "❌ Invalid Email",
        description: "Please enter a valid email address (e.g., user@example.com)",
        variant: "destructive",
      })
      return
    }

    // Validate phone
    if (!validatePhone(formData.phone)) {
      setErrors((prev) => ({ ...prev, phone: "Please enter a valid phone number with country code" }))
      toast({
        title: "❌ Invalid Phone Number",
        description: "Please enter a valid phone number with country code (e.g., +1234567890)",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await enquiriesApi.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        carName: formData.carName,
        carId: formData.carId,
      })

      toast({
        title: "🚀 Enquiry Submitted Successfully!",
        description: "We'll contact you within 24 hours with exclusive details.",
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        carName: carName,
        carId: carId,
      })

      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to submit enquiry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto">
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

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Card className="card-modern border-0 overflow-hidden">
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 neon-glow-green">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Vehicle Enquiry</CardTitle>
                {carName && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-morphism rounded-lg p-4 mt-4"
                  >
                    <p className="text-gray-600 mb-2">Enquiring about:</p>
                    <p className="text-xl font-bold text-emerald-600">{carName}</p>
                  </motion.div>
                )}
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-4 input-modern rounded-lg placeholder-transparent"
                        placeholder="Full Name"
                      />
                      <FloatingLabel label="Full Name *" value={formData.name} focused={focusedField === "name"} />
                    </motion.div>

                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-4 input-modern rounded-lg placeholder-transparent ${
                          errors.email ? "border-red-500 focus:border-red-500" : ""
                        }`}
                        placeholder="Email Address"
                      />
                      <FloatingLabel
                        label="Email Address * (e.g., user@example.com)"
                        value={formData.email}
                        focused={focusedField === "email"}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </motion.div>
                  </div>

                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-4 input-modern rounded-lg placeholder-transparent ${
                        errors.phone ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      placeholder="Phone Number"
                    />
                    <FloatingLabel
                      label="Phone Number * (e.g., +1234567890)"
                      value={formData.phone}
                      focused={focusedField === "phone"}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </motion.div>

                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <input
                      id="carName"
                      name="carName"
                      type="text"
                      value={formData.carName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 input-modern rounded-lg bg-gray-50 cursor-not-allowed"
                      readOnly
                    />
                    <FloatingLabel label="Vehicle of Interest" value={formData.carName} focused={true} />
                  </motion.div>

                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-4 input-modern rounded-lg resize-none"
                      placeholder="Tell us about your requirements, preferred contact time, or any questions..."
                      rows={4}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Button
                      type="submit"
                      className="btn-modern w-full text-white font-semibold py-4 text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="mr-2 h-5 w-5" />
                          Submit Enquiry
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
