import Tango from '../contents/Tango'

type Post = {
  id: string
  title: string
  slug: string
  description: string
  date: string
  tags: string[]
  image?: string
  icon?: string
  featured?: boolean
  component: React.FC
}

export const posts: Post[] = [
  {
    id: '0x1A1',
    title: "Building a Solver for LinkedIn's Tango Puzzle",
    slug: "tango-algo",
    description: "While playing Tango I wondered if I could write a solver for it. This post follows the actual process, including wrong turns, bugs, failed ideas, and the recursive backtracking solution that eventually worked.",
    date: "2026-05-29",
    tags: [
      "random-algo",
      "python",
      "algorithms",
      "backtracking",
      "puzzles",
      "tango",
      "recursion"
    ],
    image:
      '/cover.png',
    featured: true,
    component: Tango,
  }
] 