"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ArticleForm from "@/components/forms/ArticleForm";

export default function EditArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`/api/article/${id}`)
        .then((res) => setArticle(res.data?.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p className="text-center mt-s16">Loading...</p>;
  if (!article) return <p className="text-center mt-s16">Article not found.</p>;

  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Edit Article</h1>
      <ArticleForm initialData={article} isEditing />
    </div>
  );
}