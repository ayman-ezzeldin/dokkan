"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [phonePrimary, setPhonePrimary] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setPhoneError(null);
    setLoading(true);
    try {
      let hasError = false;
      if (!fullName.trim()) {
        setFullNameError("Full name is required");
        hasError = true;
      }
      const emailOk = /.+@.+\..+/.test(email);
      if (!emailOk) {
        setEmailError("Enter a valid email");
        hasError = true;
      }
      if (!password || password.length < 8) {
        setPasswordError("Password must be at least 8 characters");
        hasError = true;
      }
      if (!phonePrimary.trim()) {
        setPhoneError("Phone number is required");
        hasError = true;
      }
      if (hasError) {
        setLoading(false);
        return;
      }
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phonePrimary,
          email,
          password,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        let errorMessage = data?.error || "Signup failed";
        
        if (data?.message) {
          errorMessage = data.message;
        } else if (data?.details && Array.isArray(data.details)) {
          const validationErrors = data.details
            .map((d: any) => {
              const path = d.path || (Array.isArray(d.path) ? d.path.join(".") : "");
              return `${d.message}${path ? ` (${path})` : ""}`;
            })
            .join(", ");
          errorMessage = `${errorMessage}: ${validationErrors}`;
        }
        
        console.error("Signup error:", { status: res.status, data });
        throw new Error(errorMessage);
      }
      const next = params.get("next") || "/";
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: next,
      });
      if (result?.error) throw new Error(result.error || "Login failed");
      router.push(result?.url || next);
    } catch (err: any) {
      const errorMessage = err.message || "Signup failed";
      setError(errorMessage);
      console.error("Signup error details:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-800 text-sm font-medium">Error:</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <Input
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        {fullNameError && (
          <p className="text-xs text-red-600">{fullNameError}</p>
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <p className="text-xs text-red-600">{emailError}</p>}
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordError && (
          <p className="text-xs text-red-600">{passwordError}</p>
        )}
        <Input
          placeholder="Phone number"
          value={phonePrimary}
          onChange={(e) => setPhonePrimary(e.target.value)}
          required
        />
        {phoneError && <p className="text-xs text-red-600">{phoneError}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            signIn("google", { callbackUrl: params.get("next") || "/" })
          }
        >
          Continue with Google
        </Button>
      </form>
    </div>
  );
}
