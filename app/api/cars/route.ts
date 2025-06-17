import { type NextRequest, NextResponse } from "next/server"
import { getCars, saveCar } from "@/lib/server-storage"

export async function GET() {
  try {
    const cars = getCars()
    return NextResponse.json(cars)
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newCar = saveCar(body)
    return NextResponse.json(newCar, { status: 201 })
  } catch (error) {
    console.error("Error creating car:", error)
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 })
  }
}
