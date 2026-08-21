"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CaseStudyForm from "@/components/forms/CaseStudyForm";

export default function EditCaseStudyPage() {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const res = await axios.get(`/api/case-study/${id}`);
        setCaseStudy(res.data?.data);
      } catch (error) {
        console.error("Failed to fetch case study:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCaseStudy();
  }, [id]);

  if (loading) return <p className="text-center mt-s16">Loading...</p>;
  if (!caseStudy) return <p className="text-center mt-s16">Case study not found.</p>;

  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Edit Case Study</h1>
      <CaseStudyForm initialData={caseStudy} isEditing />
    </div>
  );
}