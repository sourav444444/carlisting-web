"use client"

import { motion } from "framer-motion"
import { Car, Users, Award, Shield, Heart, Target } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  const features = [
    {
      icon: Car,
      title: "Premium Selection",
      description: "Carefully curated collection of high-quality vehicles from trusted brands.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Professional automotive specialists with years of industry experience.",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Every vehicle undergoes thorough inspection and quality checks.",
    },
    {
      icon: Shield,
      title: "Trusted Service",
      description: "Transparent pricing and honest dealings with complete customer satisfaction.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Your needs and preferences are our top priority in every interaction.",
    },
    {
      icon: Target,
      title: "Perfect Match",
      description: "We help you find the ideal vehicle that fits your lifestyle and budget.",
    },
  ]

  const stats = [
    { number: "500+", label: "Happy Customers" },
    { number: "50+", label: "Premium Cars" },
    { number: "5+", label: "Years Experience" },
    { number: "24/7", label: "Customer Support" },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 neon-text-green">About AutoDeals</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We are passionate about connecting people with their perfect vehicles. Our mission is to make car buying
              simple, transparent, and enjoyable for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="card-modern border-0 p-6">
                  <CardContent className="p-0">
                    <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2 neon-text-green">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose AutoDeals?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine expertise, quality, and customer service to deliver an exceptional car buying experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="card-modern border-0 hover-scale h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 neon-glow-green">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-emerald-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="card-modern border-0">
                <CardContent className="p-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
                  <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                    <p className="mb-6">
                      Founded in 2019, AutoDeals began with a simple vision: to revolutionize the way people buy and
                      sell cars. We noticed that the traditional car buying process was often stressful, time-consuming,
                      and lacked transparency.
                    </p>
                    <p className="mb-6">
                      Our team of automotive enthusiasts and technology experts came together to create a platform that
                      puts customers first. We believe that buying a car should be an exciting experience, not a
                      daunting task.
                    </p>
                    <p className="mb-6">
                      Today, we're proud to have helped hundreds of customers find their perfect vehicles. Our
                      commitment to quality, transparency, and customer satisfaction remains at the heart of everything
                      we do.
                    </p>
                    <p>
                      Whether you're looking for your first car, upgrading to a luxury vehicle, or finding the perfect
                      family SUV, we're here to guide you every step of the way.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
