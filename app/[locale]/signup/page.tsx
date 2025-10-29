"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFirstNameError(null);
    setLastNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setPhoneError(null);
    setLoading(true);
    try {
      let hasError = false;
      if (!firstName.trim()) {
        setFirstNameError("First name is required");
        hasError = true;
      }
      if (!lastName.trim()) {
        setLastNameError("Last name is required");
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
      if (phoneNumber && phoneNumber.trim().length < 5) {
        setPhoneError("Phone number should be at least 5 characters");
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
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Signup failed");
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
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <Input
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {firstNameError && (
          <p className="text-xs text-red-600">{firstNameError}</p>
        )}
        <Input
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {lastNameError && (
          <p className="text-xs text-red-600">{lastNameError}</p>
        )}
        <Input
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {phoneError && <p className="text-xs text-red-600">{phoneError}</p>}
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
          {loading ? "Creating..." : "Sign up"}
        </Button>
      </form>
    </div>
  );
}
