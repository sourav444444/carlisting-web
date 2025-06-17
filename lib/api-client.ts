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

// Cars API
export const carsApi = {
  async getAll(): Promise<Car[]> {
    const response = await fetch("/api/cars", {
      cache: "no-store",
    })
    if (!response.ok) {
      throw new Error("Failed to fetch cars")
    }
    return response.json()
  },

  async create(car: Omit<Car, "id">): Promise<Car> {
    const response = await fetch("/api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    })
    if (!response.ok) {
      throw new Error("Failed to create car")
    }
    return response.json()
  },

  async update(id: number, updates: Partial<Car>): Promise<Car> {
    const response = await fetch(`/api/cars/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      throw new Error("Failed to update car")
    }
    return response.json()
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`/api/cars/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete car")
    }
  },
}

// Enquiries API
export const enquiriesApi = {
  async getAll(): Promise<Enquiry[]> {
    const response = await fetch("/api/enquiries", {
      cache: "no-store",
    })
    if (!response.ok) {
      throw new Error("Failed to fetch enquiries")
    }
    return response.json()
  },

  async create(enquiry: Omit<Enquiry, "id" | "submittedAt">): Promise<Enquiry> {
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enquiry),
    })
    if (!response.ok) {
      throw new Error("Failed to create enquiry")
    }
    return response.json()
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`/api/enquiries/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete enquiry")
    }
  },
}
