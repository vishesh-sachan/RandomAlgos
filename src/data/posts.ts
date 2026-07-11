import Tango from '../contents/Tango'
import Queens from '../contents/Queens'

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
    id: '0x1A2',
    title: "Queens Algo: Building a Solver One Wrong Turn at a Time",
    slug: "queens-algo",
    description:
      "How I built a solver for LinkedIn's Queens puzzle by experimenting with representations, discovering bugs, and gradually shaping a recursive backtracking algorithm. Not the most optimized solution—just the journey that got me there.",
    date: "2026-07-10",
    tags: [
      "algorithms",
      "backtracking",
      "recursion",
      "queens",
      "linkedin-games",
      "problem-solving",
      "python",
      "visualization"
    ],
    image:
      '/queens/queens-cover.png',
    component: Queens,
  },
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
  },
  
] 