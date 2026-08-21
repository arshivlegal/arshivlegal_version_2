"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import CardVariant from "@/components/ui/preview";
import { dailyContentCreateSchema } from "@/validators/dailyContent.validator";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FileInput from "@/components/ui/FileInput";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { uploadFile } from "@/utils/uploadFile";
import { useRouter } from "next/navigation";

export default function DailyContentForm({ onSuccess, initialData = null, isEditing = false }) {
  const router = useRouter();

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.thumbnail || "");
  const [uploading, setUploading] = useState(false);
  const [topMessage, setTopMessage] = useState({ type: "", text: "" });

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(dailyContentCreateSchema),
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      platform: initialData?.platform || "Instagram",
      description: initialData?.description || "",
      externalLink: initialData?.externalLink || "",
      thumbnail: initialData?.thumbnail || "",
      thumbnailPublicId: initialData?.thumbnailPublicId || "",
    },
  });

  const watchedTitle = watch("title");
  const watchedDescription = watch("description");
  const watchedPlatform = watch("platform");

  const platforms = ["Instagram", "YouTube", "LinkedIn", "Twitter", "Website"];

  useEffect(() => {
    if (topMessage.type === "error" && previewUrl && topMessage.text.includes("Thumbnail")) {
      setTopMessage({ type: "", text: "" });
    }
  }, [previewUrl, topMessage]);

  const onSubmit = async (formData) => {
    setTopMessage({ type: "", text: "" });

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
        platform: formData.platform,
        description: formData.description,
        externalLink: formData.externalLink,
        thumbnail: uploadedImage?.url || previewUrl || formData.thumbnail,
        thumbnailPublicId: uploadedImage?.public_id || formData.thumbnailPublicId,
      };

      let res;
      if (isEditing && initialData?._id) {
        res = await axios.put(`/api/daily-content/${initialData._id}`, payload);
      } else {
        res = await axios.post(`/api/daily-content`, payload);
      }

      setTopMessage({ type: "success", text: res?.data?.message || "Successfully saved!" });
      setTimeout(() => router.push("/dashboard/daily-content"), 1000);

      if (!isEditing) {
        reset();
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
        <Input label="Post/Video Title *" name="title" register={register} placeholder="e.g. 3 Trademark Myths" error={errors.title} />
        <Select label="Platform *" name="platform" register={register} error={errors.platform} options={platforms.map(p => ({ label: p, value: p }))} />
      </div>

      <Input label="External Link (URL) *" name="externalLink" register={register} placeholder="https://instagram.com/..." error={errors.externalLink} />
      
      <Textarea label="Short Description / Caption *" name="description" register={register} placeholder="What is this post about?" error={errors.description} />

      <FileInput
        label="Thumbnail/Cover Image *"
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

      {previewUrl && (
        <div className="relative w-48 h-32 mt-s8 group">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-r8 border group-hover:opacity-70 transition" />
          <button type="button" onClick={() => { setThumbnailFile(null); setPreviewUrl(""); }} className="absolute -top-2 -right-2 bg-red-700 text-white rounded-full px-s8 shadow group-hover:scale-110 transition-transform hover:bg-red-800">✕</button>
        </div>
      )}

      {(previewUrl || watchedTitle || watchedDescription) && (
        <div className="flex justify-center mt-s24">
          <CardVariant title={watchedTitle || "Title Preview"} description={watchedDescription || "Description preview..."} image={previewUrl || "/placeholder.jpg"} variant="blog" />
        </div>
      )}

      {topMessage.text && (
        <div className={`p-s16 rounded-r8 text-small ${topMessage.type === "error" ? "bg-red-main/10 text-red-main" : "bg-green-100 text-primary-main"}`}>
          {topMessage.text}
        </div>
      )}

      <Button type="submit" disabled={uploading || isSubmitting} isLoading={uploading || isSubmitting}>
        {isSubmitting || uploading ? "Saving..." : (isEditing ? "Update Content" : "Publish Content")}
      </Button>
    </form>
  );
}