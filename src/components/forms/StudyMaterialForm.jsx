"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Input from "@/components/ui/Input";
import FileInput from "@/components/ui/FileInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { uploadFile } from "@/utils/uploadFile"; 
import { useRouter } from "next/navigation";

// 🔥 THE FIX: A frontend-specific schema that doesn't block submission waiting for Cloudinary URLs
const frontendSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide a short description"),
  dateOfPublishing: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
});

export default function StudyMaterialForm({ initialData = null, isEditing = false }) {
  const router = useRouter();
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const defaultDate = initialData?.dateOfPublishing 
    ? new Date(initialData.dateOfPublishing).toISOString().split('T')[0] 
    : new Date().toISOString().split("T")[0];

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(frontendSchema), // 🔥 Using the new lightweight schema
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      dateOfPublishing: defaultDate,
      category: initialData?.category || "Copyright",
    },
  });

  const onSubmit = async (formData) => {
    setMessage({ type: "", text: "" });

    if (!isEditing && !pdfFile) {
      setMessage({ type: "error", text: "Please select a PDF file to upload." });
      return;
    }

    try {
      setUploading(true);

      let payload = {
        title: formData.title,
        description: formData.description,
        dateOfPublishing: formData.dateOfPublishing,
        category: formData.category,
        // Carry over existing PDF data if editing, otherwise they will be populated below
        pdfUrl: initialData?.pdfUrl || "",
        pdfPublicId: initialData?.pdfPublicId || "",
      };

      // Upload to Cloudinary if a NEW file was selected
      if (pdfFile) {
        const uploadedPdf = await uploadFile(pdfFile);
        payload.pdfUrl = uploadedPdf.url;
        payload.pdfPublicId = uploadedPdf.public_id;
      }

      // Send to Backend
      if (isEditing) {
        await axios.put(`/api/study-material/${initialData._id}`, payload);
        setMessage({ type: "success", text: "Study material updated successfully!" });
      } else {
        await axios.post("/api/study-material", payload);
        setMessage({ type: "success", text: "Study material uploaded successfully!" });
      }
      
      setTimeout(() => router.push("/dashboard/study-material"), 1000);
      
      if (!isEditing) {
        reset();
        setPdfFile(null);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err?.response?.data?.message || "Upload failed. Make sure the file is a valid PDF." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-s24 bg-white p-s32 rounded-r16 shadow border border-text-secondary/10 mx-auto mb-10 w-full max-w-3xl">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-s24">
        <Input label="Document Title *" name="title" register={register} placeholder="e.g. Copyright Protection for Software" error={errors.title} />
        <Input label="Category *" name="category" register={register} placeholder="e.g. Copyright, Trademark" error={errors.category} />
      </div>

      <div className="grid grid-cols-1 gap-s24">
        <Input type="date" label="Publish Date *" name="dateOfPublishing" register={register} error={errors.dateOfPublishing} />
      </div>

      <Textarea label="Short Description *" name="description" register={register} placeholder="Understand how software is protected under copyright law..." error={errors.description} />

      <FileInput
        label={isEditing ? "Replace PDF Document (Leave blank to keep current)" : "Upload PDF Document *"}
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPdfFile(file);
        }}
        fileName={pdfFile?.name || (isEditing ? "Existing PDF is saved." : "")}
      />

      {message.text && (
        <div className={`p-s16 rounded-r8 text-small ${message.type === "error" ? "bg-red-main/10 text-red-main" : "bg-green-100 text-primary-main"}`}>
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={uploading || isSubmitting} isLoading={uploading || isSubmitting}>
        {uploading || isSubmitting ? "Saving..." : (isEditing ? "Update Material" : "Publish Material")}
      </Button>
    </form>
  );
}