"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserCircle, Calendar, Share2, CheckCircle2 } from "lucide-react";

export default function ArticleContentClient({ article, formattedDate, readTime }) {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/articles/${article.slug || article._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
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
    <main className="w-full min-h-screen bg-background pb-s64">
      {/* 
        Slightly narrowed the container from 5xl to 4xl. 
        This prevents the lines of text from getting too long on desktop. 
      */}
      <article className="max-w-5xl mx-auto px-s16 md:px-s24 pt-28 md:scroll-pt-64">
        
        {/* Back Link */}
        <Link 
          href="/articles" 
          className="inline-flex items-center gap-s8 caption font-medium text-secondary hover:text-accent-main transition-colors mb-s24 md:mb-s32"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* Category */}
        <div className="mb-s16">
          <span className="text-accent-main font-bold tracking-[0.15em] uppercase caption md:text-[0.875rem]">
            {article.category}
          </span>
        </div>

        {/* Title - Downgraded from h1 to h2 for a more refined, less aggressive size. Changed color to Navy. */}
        <h1 className="heading-h2 font-primary text-primary-main font-bold mb-s24 leading-tight">
          {article.title}
        </h1>

        {/* Excerpt - Removed h5, using standard text sizing */}
        <p className="body-default text-secondary mb-s32 md:text-[1.125rem] leading-relaxed max-w-3xl">
          {article.excerpt}
        </p>

        {/* Meta Bar - Better mobile responsiveness (stacks on small screens) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-secondary-main py-s16 mb-s40 gap-4">
          <div className="flex items-center gap-s16">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary-light rounded-full flex items-center justify-center text-secondary shrink-0">
              <UserCircle className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <p className="body-default font-semibold text-primary-main">{article.author}</p>
              <div className="flex items-center gap-s8 caption text-secondary mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
                <span className="px-1">•</span>
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
          
          {/* Share Button */}
          <button 
            onClick={handleShare}
            className="flex items-center gap-s8 p-s8 text-secondary hover:text-accent-main transition-colors rounded-full hover:bg-secondary-light shrink-0 w-fit"
            title="Share Article"
          >
            {showCopied ? (
              <span className="caption font-medium text-green-600 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5" /> Copied!
              </span>
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Thumbnail Image */}
        {article.thumbnail && (
          <div className="w-full rounded-r16 overflow-hidden mb-s40 md:mb-s48 shadow-sm">
            <img 
              src={article.thumbnail} 
              alt={article.title} 
              className="w-full h-auto max-h-[450px] object-cover" 
            />
          </div>
        )}

        {/* Article Body Content */}
        {/* Constrained to max-w-3xl to create the perfect reading width. Removed prose-lg and prose-xl to keep text size elegant. */}
       {/* Article Body Content */}
       {/* Article Body Content - Changed to <section> for stronger boundaries */}
        <section className="max-w-3xl mx-auto w-full block">
          <div 
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
            suppressHydrationWarning={true}
          />
        </section>

        {/* Author Footer Box - Changed to <aside> to protect against broken div tags from the CMS */}
        <aside className="max-w-3xl mx-auto mt-s48 md:mt-s64 p-s24 md:p-s32 bg-secondary-light/50 rounded-r16 border border-secondary-main">
          <h3 className="font-primary font-bold text-[1.25rem] text-primary-main mb-s8">
            About the Author
          </h3>
          <p className="body-default text-secondary">
            {article.author} is an expert in {article.category} law. This article is provided for informational purposes and does not constitute formal legal advice.
          </p>
        </aside>
        
      </article>
    </main>
  );
}