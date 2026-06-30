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
            <h1>{title}</h1>
            <p style={{ marginTop: "var(--s-3)", fontSize: "1.0625rem" }}>{subtitle}</p>
          </div>
          <div className="card card-featured">{children}</div>
          {footer && (
            <p style={{ textAlign: "center", marginTop: "var(--s-5)", fontSize: "0.9375rem" }}>
              {footer}
            </p>
          )}
        </div>
      </main>
    </>
  );
}