"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import StudyMaterialForm from "@/components/forms/StudyMaterialForm";

export default function EditStudyMaterialPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`/api/study-material/${id}`)
        .then((res) => setData(res.data?.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p className="text-center mt-s16">Loading...</p>;
  if (!data) return <p className="text-center mt-s16">Resource not found.</p>;

  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Edit PDF Resource</h1>
      <StudyMaterialForm initialData={data} isEditing />
    </div>
  );
}