import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-24 text-center">
      <div className="container-site">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl">The page took a different flight</h1>
        <p className="mx-auto mt-4 max-w-md text-slate-600">
          The page you are looking for does not exist or has moved. Let's get
          you back on route.
        </p>
        <Link href="/" className="btn-blue mt-8">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
