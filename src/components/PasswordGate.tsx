import { useState, useEffect } from "react";

const SITE_PASSWORD = "auctionmentor2025";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("am_auth");
    if (stored === "true") setAuthenticated(true);
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem("am_auth", "true");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (loading) return null;
  if (authenticated) return <>{children}</>;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "48px 40px",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      }}>
        <div style={{
          fontSize: "32px",
          fontWeight: 700,
          color: "#fff",
          marginBottom: "8px",
          letterSpacing: "-0.5px",
        }}>
          Auction Mentor
        </div>
        <div style={{
          fontSize: "14px",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "32px",
        }}>
          Enter password to continue
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          placeholder="Password"
          autoFocus
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "10px",
            border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: "16px",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "16px",
            transition: "border-color 0.2s",
          }}
        />
        {error && (
          <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>
            Incorrect password
          </div>
        )}
        <button type="submit" style={{
          width: "100%",
          padding: "14px",
          borderRadius: "10px",
          border: "none",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}>
          Enter
        </button>
      </form>
    </div>
  );
}
