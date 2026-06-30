import Link from "next/link";

export default function Nav({ loggedIn = false }: { loggedIn?: boolean }) {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">stylesense</Link>
        <div className="nav-links">
          {loggedIn ? (
            <>
              <Link href="/wardrobe">Wardrobe</Link>
              <Link href="/suggest">Suggest</Link>
              <Link href="/generate">Generate</Link>
              <Link href="/api/auth/logout" className="nav-cta">Log out</Link>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/signup" className="nav-cta">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}