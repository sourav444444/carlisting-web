import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const CARS_FILE = path.join(DATA_DIR, "cars.json")
const ENQUIRIES_FILE = path.join(DATA_DIR, "enquiries.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Cars functions
export async function getServerCars() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(CARS_FILE, "utf8")
    return JSON.parse(data)
  } catch {
    // Return default cars if file doesn't exist
    const defaultCars = [
      {
        id: 1,
        name: "Tesla Model S Plaid",
        price: 89990,
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop&crop=center",
        description:
          "The fastest production sedan ever built with tri-motor all-wheel drive and 1,020 horsepower. Experience unparalleled acceleration and cutting-edge technology.",
        year: 2024,
        mileage: "396 miles range",
        fuelType: "Electric",
        transmission: "Single Speed",
        badge: "New",
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "BMW M3 Competition",
        price: 73000,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center",
        description:
          "High-performance luxury sedan with twin-turbo inline-6 engine delivering 503 horsepower. Perfect blend of comfort and track-ready performance.",
        year: 2024,
        mileage: "23 MPG",
        fuelType: "Gasoline",
        transmission: "Automatic",
        badge: "Performance",
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Audi Q7 Prestige",
        price: 68000,
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=center",
        description:
          "Luxury three-row SUV with quattro all-wheel drive, premium interior, and advanced driver assistance features. Perfect for families who demand luxury.",
        year: 2024,
        mileage: "25 MPG",
        fuelType: "Gasoline",
        transmission: "Automatic",
        badge: "Luxury",
        featured: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: "Mercedes-AMG GT 63 S",
        price: 159000,
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center",
        description:
          "4-door coupe with handcrafted AMG 4.0L V8 biturbo engine producing 630 horsepower. Ultimate expression of performance and luxury.",
        year: 2024,
        mileage: "20 MPG",
        fuelType: "Gasoline",
        transmission: "Automatic",
        badge: "Exclusive",
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 5,
        name: "Porsche 911 Turbo S",
        price: 207000,
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center",
        description:
          "Iconic sports car with twin-turbo flat-6 engine, all-wheel drive, and legendary handling. The pinnacle of sports car engineering.",
        year: 2024,
        mileage: "22 MPG",
        fuelType: "Gasoline",
        transmission: "PDK",
        badge: "Iconic",
        featured: false,
        createdAt: new Date().toISOString(),
      },
    ]
    await saveServerCars(defaultCars)
    return defaultCars
  }
}

export async function saveServerCars(cars: any[]) {
  await ensureDataDir()
  await fs.writeFile(CARS_FILE, JSON.stringify(cars, null, 2))
}

// Enquiries functions
export async function getServerEnquiries() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(ENQUIRIES_FILE, "utf8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function saveServerEnquiries(enquiries: any[]) {
  await ensureDataDir()
  await fs.writeFile(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2))
}
