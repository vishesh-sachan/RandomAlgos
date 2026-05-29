import { Link } from 'react-router-dom'

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


interface PostCardProps {
  post: Post
}

function PostCard({ post }: PostCardProps) {
  return (
    <article
      className={`group border flex flex-col md:flex-row transition
      ${post.featured
          ? 'border-white'
          : 'border-[#f8f9fa] hover:border-white active:border-white'
        }`}
    >

      <div className="w-full md:w-1/3 aspect-video md:min-h-[220px] border-b md:border-b-0 md:border-r border-inherit overflow-hidden bg-black flex items-center justify-center">

        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 opacity-80 group-hover:opacity-100 group-active:opacity-100 transition duration-300"
          />
        ) : (
          <span className="material-symbols-outlined text-7xl text-gray-600 group-hover:text-white transition group-active:text-white">
            {post.icon}
          </span>
        )}

      </div>

      <div className="w-full md:w-2/3 p-5 flex flex-col justify-between">

        <div>

          <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
            <span>ID: {post.id}</span>
            <span>{post.date}</span>
          </div>

          <h2 className="text-2xl font-semibold group-hover:text-white transition group-active:text-white">
            {post.title}
          </h2>

          <p className="text-gray-400 mt-3 leading-7">
            {post.description}
          </p>

        </div>

        <div className="flex justify-between items-center mt-6">

          <div className="flex gap-2 flex-wrap">

            {post.tags.map((tag) => (
              <span
                key={tag}
                className="border border-gray-400 px-2 py-1 text-[10px]"
              >
                {tag}
              </span>
            ))}

          </div>

          <Link
            to={`/posts/${post.slug}`}
            className="border border-white px-4 py-2 flex items-center gap-1 hover:bg-white hover:text-black transition active:bg-white active:text-black">
            READ_MORE

            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>

        </div>

      </div>

    </article>
  )
}

export default PostCard