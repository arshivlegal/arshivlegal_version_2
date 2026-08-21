"use client";
import BlogForm from "@/components/forms/BlogForm";

export default function CreateBlogPage() {
  return (
    <div className="flex flex-col gap-s24">
      <h1 className="page-title-h2">Create New Blog</h1>
      {/* Notice we don't pass 'initialData' or 'isEditing' here! */}
      <BlogForm />
    </div>
  );
}