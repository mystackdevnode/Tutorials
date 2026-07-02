export default async function TutorialSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <div>
      <h1>Tutorial: {slug}</h1>
    </div>
  )
}
