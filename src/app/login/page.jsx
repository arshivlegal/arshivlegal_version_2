"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/components/ui/Button"; // Adjust path if needed
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/auth/login", { password });
      router.push("/dashboard");
      router.refresh(); // Forces the middleware to recognize the new cookie
    } catch (err) {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-primary-main/10 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-primary-main" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Please enter the master password to access the CMS dashboard.
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-main/20 outline-none transition-all"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? "Verifying..." : "Unlock Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}