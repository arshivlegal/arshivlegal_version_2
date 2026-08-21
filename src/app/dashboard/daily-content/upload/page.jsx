"use client";
import DailyContentForm from "@/components/forms/DailyContentForm";

export default function CreateDailyContentPage() {
  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Upload Daily Content</h1>
      <DailyContentForm />
    </div>
  );
}