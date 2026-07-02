// Placeholder page — Module 11 (User & Authentication) owns real login.
// This exists only so middleware.ts has somewhere to redirect unauthenticated
// admin visitors to during development.
export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-bg text-text">
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <h1 className="font-display mb-2 text-lg font-bold">Sign in required</h1>
        <p className="text-sm text-text-dim">
          Real authentication is owned by Module 11. For local dev, set a{" "}
          <code className="mx-1 rounded bg-surface2 px-1.5 py-0.5 font-mono text-xs">stub_role=ADMIN</code>
          cookie to access <code className="font-mono text-xs">/admin</code>.
        </p>
      </div>
    </div>
  );
}
