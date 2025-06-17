import { type NextRequest, NextResponse } from "next/server"
import { getEnquiries, saveEnquiry } from "@/lib/server-storage"

export async function GET() {
  try {
    const enquiries = getEnquiries()
    return NextResponse.json(enquiries)
  } catch (error) {
    console.error("Error fetching enquiries:", error)
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newEnquiry = saveEnquiry(body)
    return NextResponse.json(newEnquiry, { status: 201 })
  } catch (error) {
    console.error("Error creating enquiry:", error)
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 })
  }
}
