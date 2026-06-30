import Link from "next/link";
import Nav from "./Nav";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="main">
        <div className="container-narrow">
          <div style={{ textAlign: "center", marginBottom: "var(--s-7)" }}>
            <span className="label" style={{ display: "block", marginBottom: "var(--s-4)" }}>
              StyleSense
            </span>
            <h1 style={{ fontStyle: "italic", fontWeight: 300 }}>{title}</h1>
            <p style={{ marginTop: "var(--s-3)", fontSize: "1.0625rem", color: "var(--fg-muted)" }}>
              {subtitle}
            </p>
          </div>
          <div className="card" style={{ padding: "var(--s-7) var(--s-6)" }}>{children}</div>
          {footer && (
            <p style={{ textAlign: "center", marginTop: "var(--s-5)", fontSize: "0.875rem", color: "var(--fg-muted)" }}>
              {footer}
            </p>
          )}
        </div>
      </main>
    </>
  );
}