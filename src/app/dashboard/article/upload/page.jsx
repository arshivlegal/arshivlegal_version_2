"use client";
import ArticleForm from "@/components/forms/ArticleForm";

export default function CreateArticlePage() {
  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Upload Article</h1>
      <ArticleForm />
    </div>
  );
}