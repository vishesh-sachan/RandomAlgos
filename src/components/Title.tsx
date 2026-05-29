function Title({ title }: { title: string }) {
  return (
    <h1 className="text-3xl md:text-4xl font-bold">
      {title}
    </h1>
  )
}

export default Title