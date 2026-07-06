import { StitchVerticalFeed } from "@/components/StitchVerticalFeed";
import { getTutorial } from "@/lib/mdx";
import { notFound } from "next/navigation";

export default async function FeedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tutorial = await getTutorial(slug);

  if (!tutorial) {
    notFound();
  }

  return (
    <StitchVerticalFeed 
      title={tutorial.frontmatter.title} 
      description={tutorial.frontmatter.description} 
      content={tutorial.content} 
    />
  );
}
