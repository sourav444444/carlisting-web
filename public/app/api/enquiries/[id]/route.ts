import { type NextRequest, NextResponse } from "next/server"
import { getServerEnquiries, saveServerEnquiries } from "@/lib/server-storage"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const enquiries = await getServerEnquiries()

    const filteredEnquiries = enquiries.filter((enquiry: any) => enquiry.id !== id)
    if (filteredEnquiries.length === enquiries.length) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    await saveServerEnquiries(filteredEnquiries)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 })
  }
}
