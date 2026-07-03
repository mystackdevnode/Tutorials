import Link from "next/link";
import { getAllTutorials } from "@/lib/mdx";

export default async function TutorialsPage() {
  const tutorials = await getAllTutorials();

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8 text-primary">Tutorials</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((tutorial) => (
          <Link 
            key={tutorial.slug}
            href={`/tutorials/${tutorial.slug}`}
            className="block p-6 rounded-md-lg border border-surface-variant bg-surface hover:bg-surface-variant transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-on-surface">
                {tutorial.frontmatter.title}
              </h2>
              <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {tutorial.frontmatter.difficulty}
              </span>
            </div>
            <p className="text-secondary mb-4 line-clamp-2">
              {tutorial.frontmatter.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {tutorial.frontmatter.tags.map(tag => (
                <span key={tag} className="text-xs text-secondary bg-surface-variant px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
