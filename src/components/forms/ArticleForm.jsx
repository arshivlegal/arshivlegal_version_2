"use client";

import React, { useState, useRef, useCallback, memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import CardVariant from "@/components/ui/preview";
import { articleCreateSchema } from "@/validators/article.validator";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FileInput from "@/components/ui/FileInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import RichEditor from "@/components/RichEditor";
import { uploadFile } from "@/utils/uploadFile";
import { useRouter } from "next/navigation";

const MemoizedRichEditor = memo(RichEditor);

const cleanHtml = (html) => {
  if (!html) return "";
  let cleaned = html
    .replace(/<div>/g, "<p>")
    .replace(/<\/div>/g, "</p>")
    .replace(/<p><br><\/p>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned;
};

const isHtmlContentEmpty = (html) => {
  if (!html) return true;
  const text = html.replace(/<[^>]+>/g, "").trim();
  return text.length === 0;
};

export default function ArticleForm({ onSuccess, initialData = null, isEditing = false }) {
  const router = useRouter();

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.thumbnail || "");
  const [uploading, setUploading] = useState(false);
  const [topMessage, setTopMessage] = useState({ type: "", text: "" });

  const editorRef = useRef(initialData?.content || "");

  // Default to today's date
  const defaultDate = initialData?.dateOfPublishing 
    ? new Date(initialData.dateOfPublishing).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(articleCreateSchema),
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      author: initialData?.author || "Saksham Pandey",
      dateOfPublishing: defaultDate,
      category: initialData?.category || "IP Law",
      excerpt: initialData?.excerpt || "",
      thumbnail: initialData?.thumbnail || "",
      thumbnailPublicId: initialData?.thumbnailPublicId || "",
    },
  });

  const watchedTitle = watch("title");
  const watchedExcerpt = watch("excerpt");

  const categories = ["IP Law", "Technology Law", "Corporate", "Litigation", "Legal Tech", "General"];

  useEffect(() => {
    if (topMessage.type === "error") {
      const cleaned = cleanHtml(editorRef.current);
      if (cleaned.length > 0 && topMessage.text.includes("Content")) setTopMessage({ type: "", text: "" });
      if (previewUrl && topMessage.text.includes("Thumbnail")) setTopMessage({ type: "", text: "" });
    }
  }, [editorRef.current, previewUrl, topMessage]);

  const handleEditorChange = useCallback((value) => {
    editorRef.current = cleanHtml(value);
  }, []);

  const onSubmit = async (formData) => {
    setTopMessage({ type: "", text: "" });
    let cleanedContent = cleanHtml(editorRef.current);

    if (!cleanedContent || isHtmlContentEmpty(cleanedContent)) {
      setTopMessage({ type: "error", text: "Article content is required." });
      return;
    }

    if (!isEditing && !thumbnailFile && !previewUrl) {
      setTopMessage({ type: "error", text: "Thumbnail image is required." });
      return;
    }

    try {
      setUploading(true);

      let uploadedImage = null;
      if (thumbnailFile) {
        uploadedImage = await uploadFile(thumbnailFile);
      }

      const payload = {
        title: formData.title,
        author: formData.author,
        dateOfPublishing: formData.dateOfPublishing,
        category: formData.category,
        excerpt: formData.excerpt,
        content: cleanedContent,
        thumbnail: uploadedImage?.url || previewUrl || formData.thumbnail,
        thumbnailPublicId: uploadedImage?.public_id || formData.thumbnailPublicId,
      };

      let res;
      if (isEditing && initialData?._id) {
        res = await axios.put(`/api/article/${initialData._id}`, payload);
      } else {
        res = await axios.post(`/api/article`, payload);
      }

      setTopMessage({ type: "success", text: res?.data?.message || "Article published!" });
      setTimeout(() => router.push("/dashboard/article"), 1000);

      if (!isEditing) {
        reset();
        editorRef.current = "";
        setPreviewUrl("");
        setThumbnailFile(null);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setTopMessage({ type: "error", text: err?.response?.data?.message || "Something went wrong." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-s24 bg-white p-s32 rounded-r16 shadow border border-text-secondary/10 mx-auto mb-10 w-full max-w-5xl">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-s24">
        <Input label="Article Title *" name="title" register={register} placeholder="Enter formal title" error={errors.title} />
        <Input label="Author Name *" name="author" register={register} placeholder="Author's full name" error={errors.author} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-s24">
        <Input type="date" label="Publication Date *" name="dateOfPublishing" register={register} error={errors.dateOfPublishing} />
        <Select label="Category *" name="category" register={register} error={errors.category} options={categories.map(c => ({ label: c, value: c }))} />
      </div>

      <Textarea label="Short Excerpt *" name="excerpt" register={register} placeholder="Brief abstract for the grid view..." error={errors.excerpt} />

      <div>
        <label className="text-default">Full Article Content <span className="text-red-main">*</span></label>
        <MemoizedRichEditor value={editorRef.current} onChange={handleEditorChange} />
      </div>

      <FileInput label="Cover Image *" accept="image/*" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) { setThumbnailFile(file); setPreviewUrl(URL.createObjectURL(file)); }
      }} fileName={thumbnailFile?.name} />

      {previewUrl && (
        <div className="relative w-48 h-32 mt-s8 group">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-r8 border group-hover:opacity-70 transition" />
          <button type="button" onClick={() => { setThumbnailFile(null); setPreviewUrl(""); }} className="absolute -top-2 -right-2 bg-red-700 text-white rounded-full px-s8 shadow group-hover:scale-110 transition-transform hover:bg-red-800">✕</button>
        </div>
      )}

      {(previewUrl || watchedTitle || watchedExcerpt) && (
        <div className="flex justify-center mt-s24">
          <CardVariant title={watchedTitle || "Article Preview"} description={watchedExcerpt || "Abstract preview..."} image={previewUrl || "/placeholder.jpg"} variant="blog" />
        </div>
      )}

      {topMessage.text && (
        <div className={`p-s16 rounded-r8 text-small ${topMessage.type === "error" ? "bg-red-main/10 text-red-main" : "bg-green-100 text-primary-main"}`}>
          {topMessage.text}
        </div>
      )}

      <Button type="submit" disabled={uploading || isSubmitting} isLoading={uploading || isSubmitting}>
        {isSubmitting || uploading ? "Saving..." : (isEditing ? "Update Article" : "Publish Article")}
      </Button>
    </form>
  );
}