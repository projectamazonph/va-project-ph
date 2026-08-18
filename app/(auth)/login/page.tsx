import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-16">
      <Card className="w-full max-w-md p-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Account access</p>
        <h1 className="mt-3 text-3xl font-bold">Sign in to continue.</h1>
        <p className="mt-3 leading-7 text-muted">
          Use your email to receive a secure sign-in link. No password to remember.
        </p>
        <LoginForm configured={isSupabaseConfigured()} />
        <ButtonLink className="mt-6" href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </Card>
    </main>
  );
}
