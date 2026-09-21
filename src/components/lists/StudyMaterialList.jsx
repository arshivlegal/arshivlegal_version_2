"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import Button from "../ui/Button";
import { FileText, Edit, Trash2, Copy, CheckCircle2 } from "lucide-react"; // 🔥 Added Copy and CheckCircle2 icons

export default function StudyMaterialList() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });
  const [deleting, setDeleting] = useState(false);
  
  // 🔥 New state to track which PDF link was just copied
  const [copiedId, setCopiedId] = useState(null);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`/api/study-material`);
      setMaterials(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch study materials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setDeleting(true);
      await axios.delete(`/api/study-material/${deleteModal.id}`);
      setDeleteModal({ open: false, id: null, title: "" });
      fetchMaterials(); // Refresh list
    } catch (err) {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

 // 🔥 Pass the title and the ID to the function now
  const handleCopyLink = (url, title, id) => {
    if (!url) return;
    
    // Pass BOTH the file URL and the Title into the search parameters
    const viewableUrl = `${window.location.origin}/pdf-viewer?file=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    
    navigator.clipboard.writeText(viewableUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  useEffect(() => { fetchMaterials(); }, []);

  if (loading) return <p>Loading resources...</p>;

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: "" })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Resource"
        message={`Are you sure you want to delete "${deleteModal.title}"? This will permanently remove the PDF from storage.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s24">
        {materials.map((m) => (
          <div key={m._id} className="bg-white p-s24 rounded-r16 shadow border border-gray-100 flex flex-col gap-s16">
            <div className="flex items-start gap-3">
              <FileText className="w-8 h-8 text-[var(--accent-main)] shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-2">{m.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{m.category} • {new Date(m.dateOfPublishing).toLocaleDateString()}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">{m.description}</p>
            
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              
              {/* 1. Edit Button */}
              <Button as="link" href={`/dashboard/study-material/edit/${m._id}`} variant="outliner" className="flex-1 justify-center text-sm">
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              
              {/* 2. 🔥 CORRECTED Copy Button (Passes url, title, AND id correctly) */}
              <button
                onClick={() => handleCopyLink(m.pdfUrl, m.title, m._id)}
                className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Copy PDF Link"
              >
                {copiedId === m._id ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {/* 3. 🔥 RESTORED Delete Button */}
              <button 
                onClick={() => setDeleteModal({ open: true, id: m._id, title: m.title })}
                className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
            </div>
          </div>
        ))}
      </div>
    </>
  );
}