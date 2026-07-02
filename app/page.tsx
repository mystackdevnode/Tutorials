import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-primary mb-6">
        Welcome to Tutorial Platform
      </h1>
      <p className="text-xl text-secondary max-w-2xl mb-12">
        A modern, high-performance platform for learning Next.js, built with App Router, TypeScript, and Google Stitch design tokens.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/tutorials"
          className="bg-primary text-on-primary px-6 py-3 rounded-md-xl font-medium hover:opacity-90 transition-opacity"
        >
          Explore Tutorials
        </Link>
        <Link 
          href="/dashboard"
          className="bg-surface-variant text-on-surface px-6 py-3 rounded-md-xl font-medium hover:bg-opacity-80 transition-colors"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
