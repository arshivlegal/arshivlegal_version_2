import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import ContactClient from "./ContactClient";

export const dynamic = "force-dynamic"; // Ensures you always see the latest messages instantly

export default async function ContactsDashboardPage() {
  await dbConnect();
  
  // Fetch all contacts from newest to oldest
  const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();

  // Format the data so it safely passes to the client component
  const formattedContacts = contacts.map((c) => ({
    _id: c._id.toString(),
    name: c.name,
    phone: c.phone,
    service: c.service,
    description: c.description || "No message provided.",
    status: c.status || "Unread",
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--primary-main)] mb-2 font-serif">
          Inquiries & Contacts
        </h1>
        <p className="text-gray-500">
          Manage all messages received from the website contact form.
        </p>
      </div>
      
      <ContactClient initialData={formattedContacts} />
    </div>
  );
}