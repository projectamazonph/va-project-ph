"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { EmailSchema } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";

type LoginFormProps = {
  configured: boolean;
};

export function LoginForm({ configured }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const parsed = EmailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: parsed.data.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/dashboard`,
      },
    });
    setIsLoading(false);

    if (signInError) {
      setError("We could not send the sign-in link. Please try again.");
      return;
    }

    setMessage("Check your email for a secure sign-in link.");
  }

  if (!configured) {
    return (
      <p className="rounded-md border border-sun-400/50 bg-sun-50 p-4 text-sm leading-6 text-ink" role="alert">
        Sign-in is not configured yet. Add the Supabase URL and publishable key to the local environment.
      </p>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="email">
          Email address
        </label>
        <input
          aria-describedby={error ? "login-error" : undefined}
          className="mt-2 min-h-11 w-full rounded-md border border-line bg-white px-3 text-base outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </div>
      {error ? (
        <p className="text-sm text-danger" id="login-error" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-success" role="status">
          {message}
        </p>
      ) : null}
      <Button disabled={isLoading} type="submit">
        {isLoading ? "Sending link…" : "Email me a sign-in link"}
      </Button>
    </form>
  );
}
