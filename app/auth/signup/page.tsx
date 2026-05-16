"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role: "client" },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6 text-3xl">
            ✓
          </div>
          <h2 className="font-display font-800 text-2xl mb-3">Check your email!</h2>
          <p className="text-text-secondary mb-6">
            We sent a confirmation link to <strong className="text-text-primary">{email}</strong>.
            Click it to activate your account, then come back to start your project.
          </p>
          <Link href="/auth/login" className="btn-primary inline-flex">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6">
      <div className="absolute inset-0">
        <div className="orb w-96 h-96 top-0 right-0 opacity-20"
          style={{ background: "radial-gradient(circle, #FF3D6B 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex items-center gap-3 justify-center mb-10">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-display font-800 text-white text-sm">W</div>
          <span className="font-display font-700 text-xl">W-Agency</span>
        </Link>

        <div className="glass border border-border-subtle rounded-2xl p-8">
          <h1 className="font-display font-800 text-2xl mb-2">Create your account</h1>
          <p className="text-text-secondary text-sm mb-8">Free to join — get a quote in minutes</p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Ahmed Hassan"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Min 6 characters"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-2"
            >
              {loading ? <span className="spinner" /> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent hover:text-accent-light transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
