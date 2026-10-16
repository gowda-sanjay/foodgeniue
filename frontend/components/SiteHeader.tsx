import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="text-xl font-semibold tracking-tight text-slate-100">
          FoodGenie AI
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-300">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/restaurants" className="transition hover:text-white">
            Restaurants
          </Link>
          <Link href="/checkout" className="rounded-full bg-sky-500 px-4 py-2 text-slate-950 transition hover:bg-sky-400">
            Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}
