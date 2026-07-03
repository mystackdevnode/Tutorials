import { notFound } from "next/navigation";
import { getTutorial, getAllTutorials } from "@/lib/mdx";

export async function generateStaticParams() {
  const tutorials = await getAllTutorials();
  return tutorials.map((t) => ({ slug: t.slug }));
}

export default async function TutorialSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const tutorial = await getTutorial(slug);

  if (!tutorial) {
    notFound();
  }

  return (
    <article className="py-8 max-w-3xl mx-auto">
      <header className="mb-10 pb-10 border-b border-surface-variant">
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            {tutorial.frontmatter.difficulty}
          </span>
          <span className="text-secondary text-sm">
            {tutorial.frontmatter.estimatedMinutes} min read
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-6">
          {tutorial.frontmatter.title}
        </h1>
        <p className="text-xl text-secondary">
          {tutorial.frontmatter.description}
        </p>
      </header>
      
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-on-surface prose-p:text-secondary prose-a:text-primary hover:prose-a:text-primary/80 prose-code:text-on-surface prose-pre:bg-surface-variant">
        {tutorial.content}
      </div>
    </article>
  );
}
