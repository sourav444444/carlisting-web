import { type NextRequest, NextResponse } from "next/server"
import { getServerCars, saveServerCars } from "@/lib/server-storage"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const updates = await request.json()
    const cars = await getServerCars()

    const index = cars.findIndex((car: any) => car.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    cars[index] = { ...cars[index], ...updates }
    await saveServerCars(cars)

    return NextResponse.json(cars[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const cars = await getServerCars()

    const filteredCars = cars.filter((car: any) => car.id !== id)
    if (filteredCars.length === cars.length) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    await saveServerCars(filteredCars)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 })
  }
}
