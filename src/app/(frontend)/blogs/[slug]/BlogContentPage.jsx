"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import Image from "next/image";

export default function BlogContentPage({ blog }) {
  const router = useRouter();
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/blogs/${blog._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description || blog.title,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  return (
    <main className="w-full min-h-screen bg-background mt-18 pb-24">
      {/* ===== HEADER SECTION ===== */}
      <div className="max-w-5xl mx-auto flex flex-col gap-4 px-4 sm:px-6 md:px-12 lg:px-0 py-s32">
        
        {/* Back Button */}
        <button
          onClick={() => router.push("/blogs")}
          className="inline-flex items-center gap-2 text-accent-main hover:text-accent-dark transition-colors group hover:underline hover:cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blogs
        </button>

        {/* Title */}
        <h1 className="hero-h1 text-primary-main break-words">
          {blog.title}
        </h1>

        {/* Description Box */}
        {blog.description && (
          <div className="my-s8 p-s16 sm:p-s20 md:p-s24 bg-secondary-main/30 border-l-4 border-accent-main rounded-r8">
            <p className="text-secondary text-sm sm:text-base leading-relaxed">
              {blog.description}
            </p>
          </div>
        )}

        {/* Category + Meta */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          {/* Category */}
          {blog.category && (
            <div className="body-default px-s12 py-s6 sm:px-s16 sm:py-s8 text-main text-sm sm:text-base">
              <span className="text-accent-main font-semibold">Category: </span>
              {blog.category}
            </div>
          )}

          {/* Date + Share */}
          <div className="flex items-center gap-s16 sm:gap-s24 text-sm sm:text-base">
            <div className="flex items-center gap-s6">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-s8 text-accent-main hover:text-accent-dark hover:scale-105 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span className="body-small">{showCopied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== DIVIDER ===== */}
      <div className="h-[1px] max-w-5xl mx-auto bg-accent-main/40 rounded-full"></div>

      {/* ===== CONTENT SECTION ===== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0 py-s24">
        
        {/* Thumbnail */}
        {blog.thumbnail && (
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            width={1200}
            height={800}
            className="w-full aspect-video object-cover rounded-xl shadow-xl mb-12"
          />
        )}

        {/* Blog Content (TinyMCE Rich Text) - 🔥 FIXED STYLING AND HYDRATION */}
        <section
          className="rich-text-content animate-fadeIn py-s24"
          dangerouslySetInnerHTML={{ __html: blog.content }}
          suppressHydrationWarning={true}
        />

        {/* Footer Note */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="h-[1px] bg-accent-main/40 rounded-full"></div>
          <div className="py-s24 max-w-xl mx-auto text-center">
            <p className="body-small text-secondary text-sm sm:text-base leading-relaxed mt-6">
              Understanding develops through shared ideas. This content aims to simplify without losing depth. Learning is always a work in progress.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}