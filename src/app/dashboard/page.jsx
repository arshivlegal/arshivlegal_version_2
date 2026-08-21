"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPageClient() {
  const router = useRouter();

  const [stats, setStats] = useState({
    blogCount: 0,
    caseStudyCount: 0,
    dailyContentCount: 0,
    articleCount: 0,
    studyMaterialCount: 0, // 🔥 Added Study Materials count
    contactsCount: 0,
    uploadCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const json = await res.json();
        setStats(json.data || {});
      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className=" flex flex-col gap-s32">
      <h1 className="page-title-h2">Dashboard Overview 📊</h1>
      <p className="body-default max-w-2xl text-secondary">
        Track your blogs, case studies, daily content, articles, study materials, & contacts at a glance.
      </p>

      {/* Stats Grid - Now perfectly balanced for 6 items (2 rows of 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s24">
        
        {/* Blogs */}
        <div onClick={() => router.push("/dashboard/blog")} className="bg-white p-s24 rounded-r16 shadow flex flex-col gap-s8 cursor-pointer hover:scale-[1.02] transition-transform">
          <h3 className="title-h4 text-primary-main">Blogs</h3>
          <p className="body-small text-secondary">Total Published</p>
          <span className="hero-h1 text-primary-main">{loading ? "…" : stats.blogCount}</span>
        </div>

        {/* Case Studies */}
        <div onClick={() => router.push("/dashboard/case-study")} className="bg-white p-s24 rounded-r16 shadow flex flex-col gap-s8 cursor-pointer hover:scale-[1.02] transition-transform">
          <h3 className="title-h4 text-primary-main">Case Studies</h3>
          <p className="body-small text-secondary">Total Uploaded</p>
          <span className="hero-h1 text-primary-main">{loading ? "…" : stats.caseStudyCount}</span>
        </div>

        {/* Daily Content */}
        <div onClick={() => router.push("/dashboard/daily-content")} className="bg-white p-s24 rounded-r16 shadow flex flex-col gap-s8 cursor-pointer hover:scale-[1.02] transition-transform">
          <h3 className="title-h4 text-primary-main">Daily Content</h3>
          <p className="body-small text-secondary">Social & News</p>
          <span className="hero-h1 text-primary-main">{loading ? "…" : stats.dailyContentCount}</span>
        </div>

        {/* Articles */}
        <div onClick={() => router.push("/dashboard/article")} className="bg-white p-s24 rounded-r16 shadow flex flex-col gap-s8 cursor-pointer hover:scale-[1.02] transition-transform border border-[var(--accent-main)]/20">
          <h3 className="title-h4 text-primary-main">Articles</h3>
          <p className="body-small text-secondary">Formal Publications</p>
          <span className="hero-h1 text-primary-main">{loading ? "…" : stats.articleCount}</span>
        </div>

        {/* 🔥 Knowledge Hub (Replaced Videos) */}
        <div onClick={() => router.push("/dashboard/study-material")} className="bg-white p-s24 rounded-r16 shadow flex flex-col gap-s8 cursor-pointer hover:scale-[1.02] transition-transform">
          <h3 className="title-h4 text-primary-main">Knowledge Hub</h3>
          <p className="body-small text-secondary">PDFs & Resources</p>
          <span className="hero-h1 text-primary-main">{loading ? "…" : stats.studyMaterialCount}</span>
        </div>

        {/* Contacts */}
        <div onClick={() => router.push("/dashboard/contact")} className="bg-white p-s24 rounded-r16 shadow flex flex-col gap-s8 cursor-pointer hover:scale-[1.02] transition-transform">
          <h3 className="title-h4 text-primary-main">Contacts</h3>
          <p className="body-small text-secondary">Total Submissions</p>
          <span className="hero-h1 text-primary-main">{loading ? "…" : stats.contactsCount}</span>
        </div>
      </div>

      {/* Total Uploads */}
      <div className="bg-secondary-light p-s24 rounded-r16 shadow flex flex-col gap-s8">
        <h3 className="title-h4 text-primary-main">Uploads</h3>
        <p className="body-small text-secondary">Total uploads across all modules</p>
        <span className="hero-h1 text-primary-main">{loading ? "…" : stats.uploadCount}</span>
      </div>
    </div>
  );
}