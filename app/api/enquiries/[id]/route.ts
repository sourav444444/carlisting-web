import { type NextRequest, NextResponse } from "next/server"
import { deleteEnquiry } from "@/lib/server-storage"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const success = deleteEnquiry(id)

    if (!success) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting enquiry:", error)
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 })
  }
}
