export interface Car {
  id: number
  name: string
  price: number
  image: string
  description: string
  year: number
  mileage: string
  fuelType: string
  transmission: string
  badge?: string
  featured?: boolean
  createdAt: string
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

// Car storage functions
export const getCars = (): Car[] => {
  if (typeof window === "undefined") return []
  const cars = localStorage.getItem("cars")
  if (!cars) {
    // Initialize with default cars using reliable image sources
    const defaultCars: Car[] = [
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
      {
        id: 6,
        name: "Range Rover Sport HSE",
        price: 85000,
        image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop&crop=center",
        description:
          "Luxury SUV combining off-road capability with on-road refinement. Features air suspension, premium leather, and advanced terrain response.",
        year: 2024,
        mileage: "24 MPG",
        fuelType: "Gasoline",
        transmission: "Automatic",
        badge: "Adventure",
        featured: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 7,
        name: "Lexus LC 500 Convertible",
        price: 102000,
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&crop=center",
        description:
          "Grand touring convertible with naturally aspirated 5.0L V8 engine. Stunning design meets exceptional craftsmanship and reliability.",
        year: 2024,
        mileage: "21 MPG",
        fuelType: "Gasoline",
        transmission: "Automatic",
        badge: "Elegant",
        featured: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 8,
        name: "Genesis GV70 3.5T Sport",
        price: 58000,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center",
        description:
          "Luxury compact SUV with twin-turbo V6 engine and premium amenities. Outstanding value in the luxury SUV segment.",
        year: 2024,
        mileage: "26 MPG",
        fuelType: "Gasoline",
        transmission: "Automatic",
        badge: "Value",
        featured: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 9,
        name: "Cadillac Escalade Premium",
        price: 95000,
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&crop=center",
        description:
          "Full-size luxury SUV with commanding presence, spacious interior, and advanced technology. The ultimate in American luxury.",
        year: 2024,
        mileage: "19 MPG",
        fuelType: "Gasoline",
        transmission: "Automatic",
        badge: "Premium",
        featured: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 10,
        name: "Ford Mustang Shelby GT500",
        price: 82000,
        image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=400&h=300&fit=crop&crop=center",
        description:
          "American muscle car with supercharged 5.2L V8 producing 760 horsepower. Track-focused performance with street car usability.",
        year: 2024,
        mileage: "18 MPG",
        fuelType: "Gasoline",
        transmission: "Manual",
        badge: "Muscle",
        featured: true,
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("cars", JSON.stringify(defaultCars))
    return defaultCars
  }
  return JSON.parse(cars)
}

export const saveCar = (car: Omit<Car, "id" | "createdAt">): Car => {
  const cars = getCars()
  const newCar: Car = {
    ...car,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  }
  cars.push(newCar)
  localStorage.setItem("cars", JSON.stringify(cars))
  return newCar
}

export const updateCar = (id: number, updates: Partial<Car>): Car | null => {
  const cars = getCars()
  const index = cars.findIndex((car) => car.id === id)
  if (index === -1) return null

  cars[index] = { ...cars[index], ...updates }
  localStorage.setItem("cars", JSON.stringify(cars))
  return cars[index]
}

export const deleteCar = (id: number): boolean => {
  const cars = getCars()
  const filteredCars = cars.filter((car) => car.id !== id)
  if (filteredCars.length === cars.length) return false

  localStorage.setItem("cars", JSON.stringify(filteredCars))
  return true
}

// Enquiry storage functions
export const getEnquiries = (): Enquiry[] => {
  if (typeof window === "undefined") return []
  const enquiries = localStorage.getItem("enquiries")
  return enquiries ? JSON.parse(enquiries) : []
}

export const saveEnquiry = (enquiry: Omit<Enquiry, "id" | "submittedAt">): Enquiry => {
  const enquiries = getEnquiries()
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: Date.now(),
    submittedAt: new Date().toISOString(),
  }
  enquiries.push(newEnquiry)
  localStorage.setItem("enquiries", JSON.stringify(enquiries))
  return newEnquiry
}

export const deleteEnquiry = (id: number): boolean => {
  const enquiries = getEnquiries()
  const filteredEnquiries = enquiries.filter((enquiry) => enquiry.id !== id)
  if (filteredEnquiries.length === enquiries.length) return false

  localStorage.setItem("enquiries", JSON.stringify(filteredEnquiries))
  return true
}
