import React, { useState } from "react";
import { useStore } from "../store/useStore";

export default function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const { login, authError, isLoggingIn } = useStore();

  const submit = (e) => {
    e.preventDefault();
    login(u, p);
  };

  return (
    <div id="login-page">
      <div className="login-wrap">
        <div className="login-brand">
          <div className="login-brand-name">
            Knowledge<em>BASE</em>®
          </div>
          <div className="login-brand-sub">
            PERSONAL KNOWLEDGE MANAGEMENT SYSTEM
          </div>
        </div>

        <div className="login-box">
          <div className="login-box-header">
            <span>🔒</span>
            User Authentication — Please Sign In
          </div>

          <div className="login-box-body">
            {authError && (
              <div className="login-error">
                <span>⚠</span> {authError}
              </div>
            )}

            <form onSubmit={submit}>
              <div className="login-field">
                <label>Username</label>
                <input
                  className="ei"
                  type="text"
                  value={u}
                  onChange={(e) => setU(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter username"
                />
              </div>
              <div className="login-field">
                <label>Password</label>
                <input
                  className="ei"
                  type="password"
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <div className="login-box-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoggingIn}
                  style={{ padding: "4px 20px" }}
                >
                  {isLoggingIn ? "Authenticating..." : "Login →"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="login-version">
          POWERED BY KNOWLEDGEBASE® v2.0 — APRIL 2026
        </div>
      </div>
    </div>
  );
}
