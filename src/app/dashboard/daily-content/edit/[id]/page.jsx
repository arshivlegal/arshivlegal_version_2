"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import DailyContentForm from "@/components/forms/DailyContentForm";

export default function EditDailyContentPage() {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`/api/daily-content/${id}`)
        .then((res) => setContent(res.data?.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p className="text-center mt-s16">Loading...</p>;
  if (!content) return <p className="text-center mt-s16">Content not found.</p>;

  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Edit Content</h1>
      <DailyContentForm initialData={content} isEditing />
    </div>
  );
}