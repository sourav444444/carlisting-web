import { type NextRequest, NextResponse } from "next/server"
import { getServerCars, saveServerCars } from "@/lib/server-storage"

export async function GET() {
  try {
    const cars = await getServerCars()
    return NextResponse.json(cars)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const carData = await request.json()
    const cars = await getServerCars()

    const newCar = {
      ...carData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }

    cars.push(newCar)
    await saveServerCars(cars)

    return NextResponse.json(newCar)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 })
  }
}
