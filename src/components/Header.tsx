import Title from "./Title"

function Header() {
  return (
    <header className="flex flex-col gap-2">
      <Title title="&gt; ./about.sh" />
      <p className="text-gray-400">
        Executing initialization sequence...
      </p>
    </header>
  )
}

export default Header