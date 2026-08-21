"use client";

import React, { useState, useRef, useCallback, memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import CardVariant from "@/components/ui/preview";
import { caseStudyCreateSchema } from "@/validators/caseStudy.validator";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FileInput from "@/components/ui/FileInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import RichEditor from "@/components/RichEditor";
import { uploadFile } from "@/utils/uploadFile";
import { useRouter } from "next/navigation";

const MemoizedRichEditor = memo(RichEditor);

// Clean HTML (Fixes styling consistency)
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

// Check for empty HTML
const isHtmlContentEmpty = (html) => {
  if (!html) return true;
  const text = html.replace(/<[^>]+>/g, "").trim();
  return text.length === 0;
};

export default function CaseStudyForm({ 
  onSuccess, 
  initialData = null, 
  isEditing = false 
}) {
  const router = useRouter();

  // Cloudinary Image State
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.heroImage || "");
  const [uploading, setUploading] = useState(false);
  const [topMessage, setTopMessage] = useState({ type: "", text: "" });

  // Editor is handled outside React Hook Form for performance
  const editorRef = useRef(initialData?.content || "");

  // Format date for the input field (YYYY-MM-DD)
  const defaultDate = initialData?.dateOfJudgment 
    ? new Date(initialData.dateOfJudgment).toISOString().split('T')[0] 
    : "";

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(caseStudyCreateSchema),
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      court: initialData?.court || "",
      dateOfJudgment: defaultDate,
      overview: initialData?.overview || "",
      category: initialData?.category || "Trademark",
      keyTakeaway: initialData?.keyTakeaway || "",
      heroImage: initialData?.heroImage || "",
      heroImagePublicId: initialData?.heroImagePublicId || "",
    },
  });

  // Watch for Live Preview
  const watchedTitle = watch("title");
  const watchedOverview = watch("overview");

 const categories = [
    "Trademark",
    "Patent",
    "Copyright",
    "Industrial Design",
    "Geographical Indications",
    "Trade Secrets",
  ];

  // Clear messages when content is fixed
  useEffect(() => {
    if (topMessage.type === "error") {
      const cleaned = cleanHtml(editorRef.current);
      if (cleaned.length > 0 && topMessage.text.includes("Content")) {
        setTopMessage({ type: "", text: "" });
      }
      if (previewUrl && topMessage.text.includes("Hero image")) {
        setTopMessage({ type: "", text: "" });
      }
    }
  }, [editorRef.current, previewUrl, topMessage]);

  const handleEditorChange = useCallback((value) => {
    editorRef.current = cleanHtml(value);
  }, []);

  // Form Submit Handler
  const onSubmit = async (formData) => {
    setTopMessage({ type: "", text: "" });
    let cleanedContent = cleanHtml(editorRef.current);

    // Validate Content
    if (!cleanedContent || isHtmlContentEmpty(cleanedContent)) {
      setTopMessage({ type: "error", text: "Full judgment content is required." });
      return;
    }

    // Validate Image
    if (!isEditing && !thumbnailFile && !previewUrl) {
      setTopMessage({ type: "error", text: "Hero image is required." });
      return;
    }

    try {
      setUploading(true);

      // 🔥 YOUR EXACT CLOUDINARY LOGIC
      let uploadedImage = null;
      if (thumbnailFile) {
        uploadedImage = await uploadFile(thumbnailFile);
      }

      // Construct payload for the API
      const payload = {
        title: formData.title,
        court: formData.court,
        dateOfJudgment: formData.dateOfJudgment,
        overview: formData.overview || "",
        keyTakeaway: formData.keyTakeaway || "",
        content: cleanedContent,
        category: formData.category,
        heroImage: uploadedImage?.url || previewUrl || formData.heroImage,
        heroImagePublicId: uploadedImage?.public_id || formData.heroImagePublicId,
      };

      let res;
      if (isEditing && initialData?._id) {
        res = await axios.put(`/api/case-study/${initialData._id}`, payload);
      } else {
        res = await axios.post(`/api/case-study`, payload);
      }

      const msg = res?.data?.message || (isEditing ? "Case Study updated!" : "Case Study published!");
      setTopMessage({ type: "success", text: msg });

      setTimeout(() => {
        router.push("/dashboard/case-study");
      }, 1000);

      if (!isEditing) {
        reset();
        editorRef.current = "";
        setPreviewUrl("");
        setThumbnailFile(null);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      const backendMessage = err?.response?.data?.message || err?.response?.data?.error || err.message || "Something went wrong.";
      setTopMessage({ type: "error", text: backendMessage });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-s24 bg-white p-s32 rounded-r16 shadow border border-text-secondary/10 mx-auto mb-10 w-full max-w-5xl">
      
      {/* Title & Court Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-s24">
        <Input label="Case Title *" name="title" register={register} placeholder="e.g. Yahoo! Inc. v. Akash Arora" error={errors.title} />
        <Input label="Court / Jurisdiction *" name="court" register={register} placeholder="e.g. Delhi High Court" error={errors.court} />
      </div>

      {/* Date & Category Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-s24">
        <Input type="date" label="Date of Judgment *" name="dateOfJudgment" register={register} error={errors.dateOfJudgment} />
        <Select label="Category *" name="category" register={register} error={errors.category} options={categories.map((c) => ({ label: c, value: c }))} />
      </div>

      {/* Text Areas */}
      <Textarea label="Short Overview (For Grid) *" name="overview" register={register} placeholder="Brief summary of the case..." error={errors.overview} />
      <Textarea label="Key Takeaway *" name="keyTakeaway" register={register} placeholder="Why does this case matter?" error={errors.keyTakeaway} />

      {/* Rich Editor */}
      <div>
        <label className="text-default">Full Judgment Content <span className="text-red-main">*</span></label>
        <MemoizedRichEditor value={editorRef.current} onChange={handleEditorChange} />
      </div>

      {/* Cloudinary Hero Image Upload */}
      <FileInput
        label="Hero Image *"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setThumbnailFile(file);
            setPreviewUrl(URL.createObjectURL(file));
          }
        }}
        fileName={thumbnailFile?.name}
      />

      {/* Image Preview Window */}
      {previewUrl && (
        <div className="relative w-48 h-32 mt-s8 group">
          <img src={previewUrl} alt="Hero Preview" className="w-full h-full object-cover rounded-r8 border group-hover:opacity-70 transition" />
          <button
            type="button"
            onClick={() => {
              setThumbnailFile(null);
              setPreviewUrl("");
            }}
            className="absolute -top-2 -right-2 bg-red-700 text-white rounded-full px-s8 shadow group-hover:scale-110 transition-transform hover:bg-red-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Live Card Preview */}
      {(previewUrl || watchedTitle || watchedOverview) && (
        <div className="flex justify-center mt-s24">
          <CardVariant
            title={watchedTitle || "Case Study Preview"}
            description={watchedOverview || "Case study overview preview..."}
            image={previewUrl || "/placeholder.jpg"}
            variant="blog" // Reusing your existing variant for the preview card
          />
        </div>
      )}

      {/* Top Message Banner */}
      {topMessage.text && (
        <div className={`p-s16 rounded-r8 text-small ${topMessage.type === "error" ? "bg-red-main/10 text-red-main border border-red-main/20" : "bg-green-100 text-primary-main border border-primary-main/20"}`}>
          {topMessage.text}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={uploading || isSubmitting} isLoading={uploading || isSubmitting}>
        {isSubmitting || uploading ? (isEditing ? "Updating..." : "Publishing...") : (isEditing ? "Update Case Study" : "Publish Case Study")}
      </Button>
    </form>
  );
}