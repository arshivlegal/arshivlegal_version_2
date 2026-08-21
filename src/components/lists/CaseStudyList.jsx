"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import Button from "../ui/Button";

export default function CaseStudyList() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    title: "",
  });
  const [deleting, setDeleting] = useState(false);

  const limit = 15;

  const fetchCaseStudies = async (pageNum = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);

      const res = await axios.get(`/api/case-study?page=${pageNum}&limit=${limit}`);

      const result = Array.isArray(res.data?.data?.caseStudies)
        ? res.data.data.caseStudies
        : [];

      const totalItems = res.data?.data?.total || 0;
      const totalPages = res.data?.data?.totalPages || 1;

      if (append) {
        setCaseStudies((prev) => [...prev, ...result]);
      } else {
        setCaseStudies(result);
      }

      setTotal(totalItems);
      setHasMore(pageNum < totalPages);
      setError("");
    } catch (err) {
      console.error("❌ Failed to fetch case studies:", err);
      setError("Failed to load case studies. Please try again later.");
      if (!append) setCaseStudies([]);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCaseStudies(nextPage, true);
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setDeleting(true);
      await axios.delete(`/api/case-study/${deleteModal.id}`);

      setDeleteModal({ open: false, id: null, title: "" });
      setPage(1);
      fetchCaseStudies(1, false);
    } catch (err) {
      console.error("❌ Failed to delete case study:", err);
      alert("Failed to delete case study. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies(1, false);
  }, []);

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: "" })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Case Study"
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
      />

      {error && (
        <div className="text-center text-red-500 my-8">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s32 mx-auto">
        {caseStudies.map((c) => (
          <Card
            key={c._id}
            title={c.title}
            // Mapping Case Study fields to your existing Card component props!
            thumbnail={c.heroImage} 
            description={c.overview}
            createdAt={c.dateOfJudgment} 
            onEdit={() => (window.location.href = `/dashboard/case-study/edit/${c._id}`)}
            onDelete={() =>
              setDeleteModal({ open: true, id: c._id, title: c.title })
            }
          />
        ))}
      </div>

      {caseStudies.length > 0 && hasMore && (
        <div className="flex justify-center mt-12 mb-12">
          <Button onClick={handleLoadMore} disabled={loadingMore} varient={"ctaAcent"}>
            {loadingMore ? "Loading..." : `Load More (${caseStudies.length} of ${total})`}
          </Button>
        </div>
      )}

      {!hasMore && caseStudies.length > 0 && (
        <div className="text-center mt-8 text-gray-500">
          All case studies loaded ({caseStudies.length} of {total})
        </div>
      )}
    </>
  );
}