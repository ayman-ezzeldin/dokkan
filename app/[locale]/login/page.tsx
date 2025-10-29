"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setPasswordError(null);
    setLoading(true);
    try {
      let hasError = false;
      const emailOk = /.+@.+\..+/.test(email);
      if (!emailOk) {
        setEmailError("Enter a valid email");
        hasError = true;
      }
      if (!password) {
        setPasswordError("Password is required");
        hasError = true;
      }
      if (hasError) {
        setLoading(false);
        return;
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
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
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
        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
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
