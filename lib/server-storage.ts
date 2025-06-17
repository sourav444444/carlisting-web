import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const CARS_FILE = path.join(DATA_DIR, "cars.json")
const ENQUIRIES_FILE = path.join(DATA_DIR, "enquiries.json")

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export interface Car {
  id: number
  name: string
  price: number
  description: string
  year: number
  mileage: string
  fuelType: string
  transmission: string
  image: string
  badge?: string
  featured?: boolean
}

export interface Enquiry {
  id: number
  name: string
  email: string
  phone: string
  message: string
  carName: string
  carId: string
  submittedAt: string
}

// Default cars data
const defaultCars: Car[] = [
  {
    id: 1,
    name: "Tesla Model S Plaid",
    price: 129990,
    description:
      "Experience the pinnacle of electric performance with ludicrous acceleration and cutting-edge autopilot technology.",
    year: 2024,
    mileage: "405 miles range",
    fuelType: "Electric",
    transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    badge: "New",
    featured: true,
  },
  {
    id: 2,
    name: "BMW M4 Competition",
    price: 74900,
    description: "Pure driving dynamics meet luxury in this track-bred performance coupe with twin-turbo power.",
    year: 2024,
    mileage: "23 MPG",
    fuelType: "Gasoline",
    transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    badge: "Sport",
    featured: true,
  },
  {
    id: 3,
    name: "Porsche 911 Turbo S",
    price: 207000,
    description: "The ultimate expression of 911 performance with all-wheel drive and breathtaking acceleration.",
    year: 2024,
    mileage: "20 MPG",
    fuelType: "Gasoline",
    transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    badge: "Premium",
    featured: true,
  },
  {
    id: 4,
    name: "Mercedes-AMG GT 63 S",
    price: 159000,
    description: "Four-door coupe combining AMG performance with luxury comfort and advanced technology.",
    year: 2024,
    mileage: "21 MPG",
    fuelType: "Gasoline",
    transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
    badge: "Luxury",
  },
  {
    id: 5,
    name: "Audi RS e-tron GT",
    price: 142400,
    description: "Electric grand tourer delivering stunning performance with sustainable luxury and innovative design.",
    year: 2024,
    mileage: "238 miles range",
    fuelType: "Electric",
    transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    badge: "Electric",
  },
  {
    id: 6,
    name: "Lamborghini Huracán EVO",
    price: 248295,
    description: "Italian supercar excellence with naturally aspirated V10 power and track-focused dynamics.",
    year: 2024,
    mileage: "18 MPG",
    fuelType: "Gasoline",
    transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
    badge: "Supercar",
  },
]

// Cars functions
export function getCars(): Car[] {
  try {
    if (!fs.existsSync(CARS_FILE)) {
      // Initialize with default cars
      fs.writeFileSync(CARS_FILE, JSON.stringify(defaultCars, null, 2))
      return defaultCars
    }
    const data = fs.readFileSync(CARS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading cars:", error)
    return defaultCars
  }
}

export function saveCar(car: Omit<Car, "id">): Car {
  const cars = getCars()
  const newCar = {
    ...car,
    id: cars.length > 0 ? Math.max(...cars.map((c) => c.id)) + 1 : 1,
  }
  cars.push(newCar)
  fs.writeFileSync(CARS_FILE, JSON.stringify(cars, null, 2))
  return newCar
}

export function updateCar(id: number, updates: Partial<Car>): Car | null {
  const cars = getCars()
  const index = cars.findIndex((c) => c.id === id)
  if (index === -1) return null

  cars[index] = { ...cars[index], ...updates }
  fs.writeFileSync(CARS_FILE, JSON.stringify(cars, null, 2))
  return cars[index]
}

export function deleteCar(id: number): boolean {
  const cars = getCars()
  const filteredCars = cars.filter((c) => c.id !== id)
  if (filteredCars.length === cars.length) return false

  fs.writeFileSync(CARS_FILE, JSON.stringify(filteredCars, null, 2))
  return true
}

// Enquiries functions
export function getEnquiries(): Enquiry[] {
  try {
    if (!fs.existsSync(ENQUIRIES_FILE)) {
      fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2))
      return []
    }
    const data = fs.readFileSync(ENQUIRIES_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading enquiries:", error)
    return []
  }
}

export function saveEnquiry(enquiry: Omit<Enquiry, "id" | "submittedAt">): Enquiry {
  const enquiries = getEnquiries()
  const newEnquiry = {
    ...enquiry,
    id: enquiries.length > 0 ? Math.max(...enquiries.map((e) => e.id)) + 1 : 1,
    submittedAt: new Date().toISOString(),
  }
  enquiries.push(newEnquiry)
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2))
  return newEnquiry
}

export function deleteEnquiry(id: number): boolean {
  const enquiries = getEnquiries()
  const filteredEnquiries = enquiries.filter((e) => e.id !== id)
  if (filteredEnquiries.length === enquiries.length) return false

  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(filteredEnquiries, null, 2))
  return true
}

// Export aliases for API compatibility
export const getServerCars = getCars
export const saveServerCars = (cars: Car[]) => {
  fs.writeFileSync(CARS_FILE, JSON.stringify(cars, null, 2))
}
export const getServerEnquiries = getEnquiries
export const saveServerEnquiries = (enquiries: Enquiry[]) => {
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2))
}
