function Header() {
  return (
    <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚡</span>
        <span className="text-xl font-bold tracking-tight">
          Mar<span className="text-blue-500">vert</span>
        </span>
      </div>
      <span className="text-xs text-gray-500 border border-gray-700 px-3 py-1 rounded-full">
        v1.0.0
      </span>
    </header>
  )
}

export default Header