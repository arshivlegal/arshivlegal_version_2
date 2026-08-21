"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import Button from "../ui/Button";

export default function DailyContentList() {
  const [contents, setContents] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });
  const [deleting, setDeleting] = useState(false);

  const fetchContents = async (pageNum = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      const res = await axios.get(`/api/daily-content?page=${pageNum}&limit=15`);
      const result = Array.isArray(res.data?.data?.dailyContents) ? res.data.data.dailyContents : [];
      
      if (append) setContents((prev) => [...prev, ...result]);
      else setContents(result);

      setTotal(res.data?.data?.total || 0);
      setHasMore(pageNum < (res.data?.data?.totalPages || 1));
    } catch (err) {
      console.error("Failed to fetch contents:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setDeleting(true);
      await axios.delete(`/api/daily-content/${deleteModal.id}`);
      setDeleteModal({ open: false, id: null, title: "" });
      fetchContents(1, false);
    } catch (err) {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => { fetchContents(1, false); }, []);

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: "" })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Content"
        message={`Are you sure you want to delete "${deleteModal.title}"?`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s32 mx-auto">
        {contents.map((c) => (
          <Card
            key={c._id}
            title={c.title}
            thumbnail={c.thumbnail}
            description={c.description}
            createdAt={c.createdAt}
            onEdit={() => (window.location.href = `/dashboard/daily-content/edit/${c._id}`)}
            onDelete={() => setDeleteModal({ open: true, id: c._id, title: c.title })}
          />
        ))}
      </div>

      {contents.length > 0 && hasMore && (
        <div className="flex justify-center mt-12 mb-12">
          <Button onClick={() => { setPage(page + 1); fetchContents(page + 1, true); }} disabled={loadingMore} varient="ctaAcent">
            {loadingMore ? "Loading..." : `Load More (${contents.length} of ${total})`}
          </Button>
        </div>
      )}
    </>
  );
}