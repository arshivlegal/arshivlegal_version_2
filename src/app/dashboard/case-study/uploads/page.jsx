"use client";
import CaseStudyForm from "@/components/forms/CaseStudyForm";

export default function CreateCaseStudyPage() {
  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Create New Case Study</h1>
      <CaseStudyForm />
    </div>
  );
}