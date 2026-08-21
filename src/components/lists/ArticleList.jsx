"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import Button from "../ui/Button";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });
  const [deleting, setDeleting] = useState(false);

  const fetchArticles = async (pageNum = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      const res = await axios.get(`/api/article?page=${pageNum}&limit=15`);
      const result = Array.isArray(res.data?.data?.articles) ? res.data.data.articles : [];
      
      if (append) setArticles((prev) => [...prev, ...result]);
      else setArticles(result);

      setTotal(res.data?.data?.total || 0);
      setHasMore(pageNum < (res.data?.data?.totalPages || 1));
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setDeleting(true);
      await axios.delete(`/api/article/${deleteModal.id}`);
      setDeleteModal({ open: false, id: null, title: "" });
      fetchArticles(1, false);
    } catch (err) {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => { fetchArticles(1, false); }, []);

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: "" })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Article"
        message={`Are you sure you want to delete "${deleteModal.title}"?`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s32 mx-auto">
        {articles.map((a) => (
          <Card
            key={a._id}
            title={a.title}
            thumbnail={a.thumbnail}
            description={a.excerpt}
            createdAt={a.dateOfPublishing}
            onEdit={() => (window.location.href = `/dashboard/article/edit/${a._id}`)}
            onDelete={() => setDeleteModal({ open: true, id: a._id, title: a.title })}
          />
        ))}
      </div>

      {articles.length > 0 && hasMore && (
        <div className="flex justify-center mt-12 mb-12">
          <Button onClick={() => { setPage(page + 1); fetchArticles(page + 1, true); }} disabled={loadingMore} varient="ctaAcent">
            {loadingMore ? "Loading..." : `Load More (${articles.length} of ${total})`}
          </Button>
        </div>
      )}
    </>
  );
}