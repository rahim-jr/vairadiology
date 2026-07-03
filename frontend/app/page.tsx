"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/shared/Icons";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo12345");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/tasks");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login. Create the demo user from the backend README first.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="logo" style={{ marginBottom: 28 }}>
            <span className="logo-mark" />
            <span>VAI Workbench</span>
          </div>
          <span className="eyebrow">
            <Icon name="spark" size={16} /> Clinical productivity, beautifully
            organized
          </span>
          <h1>
            <span className="gradient-text">Please let me into the app!</span>
          </h1>
          <p>
            A cinematic two-in-one workspace for date-driven Kanban planning and
            responsive polygon annotation. Manage the day, upload images, and
            preserve every decision in the backend.
          </p>
          <div className="stats-grid" aria-label="Application highlights">
            <div className="stat-card">
              <div className="stat-value">3</div>
              <div className="stat-label">Kanban lanes</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                <Icon name="calendar" size={28} />
              </div>
              <div className="stat-label">Daily task boards</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">SVG</div>
              <div className="stat-label">Precise annotations</div>
            </div>
          </div>
        </div>
        <form className="card login-card form" onSubmit={handleSubmit}>
          <div style={{ position: "relative" }}>
            <span className="eyebrow">
              <Icon name="lock" size={16} /> Secure entry
            </span>
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "2rem",
                letterSpacing: "-0.06em",
              }}
            >
              Welcome back
            </h2>
            <p className="helper">
              Use a Django user email/username and password. Demo defaults are
              prefilled for speed.
            </p>
          </div>
          {error ? <div className="error">{error}</div> : null}
          <label className="field">
            Email
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="field">
            Password
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          <button className="btn" disabled={isLoading} type="submit">
            {isLoading ? "Entering workspace…" : "Login to workspace"}
          </button>
          <div className="notice">
            Tip: start the Django server on port 8000 before logging in.
          </div>
        </form>
      </section>
    </main>
  );
}
