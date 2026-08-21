import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import mongoose from "mongoose";

export async function DELETE(req, context) {
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}