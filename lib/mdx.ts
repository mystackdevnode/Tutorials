import { compileMDX } from 'next-mdx-remote/rsc'
import { readFile, readdir } from 'fs/promises'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content/tutorials')

export interface TutorialFrontmatter {
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  publishedAt: string
  estimatedMinutes: number
}

export async function getTutorial(slug: string) {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
    const source = await readFile(filePath, 'utf8')
    
    const { content, frontmatter } = await compileMDX<TutorialFrontmatter>({
      source,
      options: { parseFrontmatter: true }
    })
    
    return { content, frontmatter, slug }
  } catch (error) {
    return null
  }
}

export async function getAllTutorials() {
  try {
    const files = await readdir(CONTENT_DIR)
    const slugs = files.filter(f => f.endsWith('.mdx')).map(f => f.replace('.mdx', ''))
    const tutorials = await Promise.all(slugs.map(getTutorial))
    // Filter out nulls in case of read errors
    return tutorials.filter((t): t is NonNullable<typeof t> => t !== null)
  } catch (error) {
    console.error("Error reading tutorials directory", error)
    return []
  }
}
