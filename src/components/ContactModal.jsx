"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  User,
  Phone,
  Briefcase,
  MessageSquare,
  Loader2,
  CheckCircle2,
  Send,
} from "lucide-react";
import axios from "axios"; // Ensure axios is installed, or use standard fetch

const SERVICES = [
  { value: "General Consultation", label: "General Consultation", color: "border-blue-500 bg-blue-50 text-blue-700", active: "ring-blue-500/30 border-blue-500" },
  { value: "IP & Trademarks", label: "IP & Trademarks", color: "border-amber-600 bg-amber-50 text-amber-700", active: "ring-amber-500/30 border-amber-600" },
  { value: "Corporate Law", label: "Corporate Law", color: "border-emerald-600 bg-emerald-50 text-emerald-700", active: "ring-emerald-500/30 border-emerald-600" },
  { value: "Disputes & Litigation", label: "Disputes & Litigation", color: "border-red-500 bg-red-50 text-red-700", active: "ring-red-500/30 border-red-500" },
];

export default function ContactModal({ isOpen, onClose }) {
  const [success, setSuccess] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      service: "",
      description: "",
    },
  });

  const selectedService = watch("service");

  if (!isOpen) return null;

  const handleClose = () => {
    setSuccess(false);
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    setIsSubmittingForm(true);
    
    try {
      // 🔥 Sends data to your Backend API silently
      await axios.post("/api/contact", {
        name: data.name.trim(),
        phone: data.phone,
        service: data.service,
        description: data.description.trim(),
      });

      // Show the Success Screen
      setSuccess(true);
      
      // Auto-close after 3.5 seconds
      setTimeout(() => handleClose(), 3500);
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-r24 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══ SUCCESS SCREEN ══ */}
        {success ? (
          <div className="p-s48 text-center py-16">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[var(--primary-main)] mb-2">
              Message Sent Successfully!
            </h3>
            <p className="text-gray-500 mb-8 max-w-[280px] mx-auto">
              Thank you for reaching out to Arshiv Legal. Our team will contact you shortly.
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[var(--primary-main)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ══ HEADER ══ */}
            <div className="bg-[var(--primary-main)] p-6 sm:p-8 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <X size={16} />
              </button>
              <p className="text-white/70 uppercase tracking-[0.2em] text-xs font-bold mb-1">
                Free Consultation
              </p>
              <h3 className="text-white font-bold text-2xl font-serif">
                Contact Arshiv Legal
              </h3>
            </div>

            {/* ══ FORM ══ */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
              
              {/* NAME */}
              <div>
                <label className="text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-xs font-bold">
                  <User size={12} /> Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[var(--primary-main)] focus:ring-2 focus:ring-[var(--primary-main)]/10"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              {/* PHONE */}
              <div>
                <label className="text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-xs font-bold">
                  <Phone size={12} /> Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full pl-14 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-[var(--primary-main)] focus:ring-2 focus:ring-[var(--primary-main)]/10"
                    {...register("phone", { 
                      required: "Phone is required",
                      pattern: { value: /^[6-9]\d{9}$/, message: "Valid 10-digit number required" }
                    })}
                    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, "")}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>

              {/* SERVICE */}
              <div>
                <label className="text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-xs font-bold">
                  <Briefcase size={12} /> Inquiry Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SERVICES.map((srv) => (
                    <label key={srv.value} className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedService === srv.value ? `${srv.active} bg-white` : "border-gray-100 bg-gray-50"}`}>
                      <input type="radio" value={srv.value} className="sr-only" {...register("service", { required: "Select a type" })} />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedService === srv.value ? "border-[var(--primary-main)]" : "border-gray-300"}`}>
                        {selectedService === srv.value && <div className="w-2 h-2 rounded-full bg-[var(--primary-main)]" />}
                      </div>
                      <span className={`text-sm font-semibold ${selectedService === srv.value ? "text-gray-900" : "text-gray-600"}`}>{srv.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-xs font-bold">
                  <MessageSquare size={12} /> Message <span className="text-gray-400 normal-case ml-1 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="Tell us about your legal requirement..."
                  rows={3}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 outline-none resize-none focus:border-[var(--primary-main)] focus:ring-2 focus:ring-[var(--primary-main)]/10"
                  {...register("description")}
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmittingForm}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--primary-main)] text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-70"
              >
                {isSubmittingForm ? (
                  <><Loader2 size={18} className="animate-spin" /> Sending...</>
                ) : (
                  <><Send size={18} /> Submit Request</>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}