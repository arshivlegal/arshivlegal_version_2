"use client";
import StudyMaterialForm from "@/components/forms/StudyMaterialForm";

export default function CreateStudyMaterialPage() {
  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Upload PDF Resource</h1>
      <StudyMaterialForm />
    </div>
  );
}