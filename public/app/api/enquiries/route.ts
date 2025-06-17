import { type NextRequest, NextResponse } from "next/server"
import { getServerEnquiries, saveServerEnquiries } from "@/lib/server-storage"

export async function GET() {
  try {
    const enquiries = await getServerEnquiries()
    return NextResponse.json(enquiries)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const enquiryData = await request.json()
    const enquiries = await getServerEnquiries()

    const newEnquiry = {
      ...enquiryData,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
    }

    enquiries.push(newEnquiry)
    await saveServerEnquiries(enquiries)

    return NextResponse.json(newEnquiry)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 })
  }
}
