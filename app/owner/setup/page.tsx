"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

// These are publishable project details, not a database secret.
// This setup route targets Michael's NEW project even while the live
// inventory dashboard still uses the old project until migration cutover.
const AUTH_URL = "https://unosqzlrigbwwnnpabar.supabase.co";
const PUBLISHABLE_KEY = "sb_publishable_jCF0lEHBiP7igZ7ta1iVTA_MAWVG0gS";

type SetupState = "checking" | "ready" | "saving" | "done" | "error";

export default function OwnerSetupPage() {
  const [state, setState] = useState<SetupState>("checking");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const query = new URLSearchParams(window.location.search);
      // Keep access tokens out of visible URLs, browser history, screenshots,
      // and any outgoing navigation from this page.
      window.history.replaceState(null, "", window.location.pathname);
      try {
        let accessToken = hash.get("access_token") || "";
        const error = hash.get("error_description") || query.get("error_description");
        if (error) throw new Error(error);

        const tokenHash = query.get("token_hash");
        const type = query.get("type");
        if (!accessToken && tokenHash && (type === "invite" || type === "recovery")) {
          const response = await fetch(AUTH_URL + "/auth/v1/verify", {
            method: "POST",
            headers: { apikey: PUBLISHABLE_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ token_hash: tokenHash, type }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.msg || result.error_description || result.message || "Link could not be verified.");
          accessToken = result.access_token;
        }
        if (!accessToken) throw new Error("This password link is missing or has expired. Ask Clemons Web Co. for a new invitation or password reset link.");

        const check = await fetch(AUTH_URL + "/auth/v1/user", {
          headers: { apikey: PUBLISHABLE_KEY, Authorization: "Bearer " + accessToken },
          cache: "no-store",
        });
        if (!check.ok) throw new Error("This password link is invalid or expired.");
        if (!cancelled) { setToken(accessToken); setState("ready"); }
      } catch (e) {
        if (!cancelled) { setMessage(e instanceof Error ? e.message : "Unable to verify the link."); setState("error"); }
      }
    }
    void verify();
    return () => { cancelled = true; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || state !== "ready") return;
    if (password.length < 8) { setMessage("Use at least 8 characters."); return; }
    if (password !== confirmation) { setMessage("Passwords do not match."); return; }
    setMessage("");
    setState("saving");
    try {
      const response = await fetch(AUTH_URL + "/auth/v1/user", {
        method: "PUT",
        headers: { apikey: PUBLISHABLE_KEY, Authorization: "Bearer " + token, "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg || result.error_description || result.message || "Could not set password.");
      setToken("");
      setPassword("");
      setConfirmation("");
      setState("done");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Please try again.");
      setState("ready");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f6f8f8", padding: "70px 18px", color: "#163941", fontFamily: "system-ui, sans-serif" }}>
      <section style={{ maxWidth: 470, margin: "0 auto", background: "white", borderRadius: 20, padding: 30, boxShadow: "0 12px 40px #183b4120" }}>
        <p style={{ color: "#168781", fontWeight: 700, letterSpacing: 2, fontSize: 12 }}>ARKANSAS CAMPER RENTALS</p>
        <h1 style={{ fontSize: 28, margin: "12px 0" }}>Set up Site Management access</h1>
        {state === "checking" && <p role="status">Verifying your secure link…</p>}
        {state === "error" && <p role="alert">{message}</p>}
        {state === "done" && <>
          <p role="status">Your new Site Management password has been saved successfully.</p>
          <p>We'll let you know when the new database connection is active. Until then, keep using your existing camper website login.</p>
        </>}
        {(state === "ready" || state === "saving") && <>
          <p>Choose the password you want to use when we complete your database migration.</p>
          <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
            <label style={{ display: "grid", gap: 6 }}>New password
              <input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: 12, border: "1px solid #aab8b7", borderRadius: 8 }} />
            </label>
            <label style={{ display: "grid", gap: 6 }}>Confirm password
              <input required minLength={8} type="password" autoComplete="new-password" value={confirmation} onChange={e => setConfirmation(e.target.value)} style={{ padding: 12, border: "1px solid #aab8b7", borderRadius: 8 }} />
            </label>
            {message && <p role="alert" style={{ color: "#b42318" }}>{message}</p>}
            <button disabled={state === "saving"} style={{ background: "#087e7b", color: "white", padding: 13, border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
              {state === "saving" ? "Saving securely…" : "Save password"}
            </button>
          </form>
        </>}
        <p style={{ marginTop: 28, fontSize: 13, color: "#57716e" }}>This page is for the owner account only. Never share your invitation link or password.</p>
        <Link href="/" style={{ color: "#087e7b" }}>Back to Arkansas Camper Rentals</Link>
      </section>
    </main>
  );
}
