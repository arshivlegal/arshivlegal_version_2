import { NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import Contact from "@/models/Contact"; // Assuming you have a Contact model created

export async function POST(req) {
  try {
    await connectToDB();
    
    // Parse the data from the modal
    const body = await req.json();
    const { name, phone, service, description } = body;

    if (!name || !phone || !service) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Save it to MongoDB so it shows in your Dashboard
    const newContact = await Contact.create({
      name,
      phone,
      service,
      description: description || "No message provided.",
      status: "Unread", // Useful for your dashboard later
    });

    return NextResponse.json({ success: true, data: newContact }, { status: 201 });
    
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}