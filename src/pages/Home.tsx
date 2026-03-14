import { useNavigate } from 'react-router-dom'

const categories = [
  {
    label: 'Imagens',
    conversions: [
      { from: 'JPG', to: 'PNG', route: '/jpg-to-png', description: 'Converta JPG para PNG', icon: '🖼️', color: 'text-yellow-400', border: 'hover:border-yellow-500', bg: 'hover:bg-yellow-500/5' },
      { from: 'PNG', to: 'JPG', route: '/png-to-jpg', description: 'Converta PNG para JPG', icon: '🖼️', color: 'text-blue-400', border: 'hover:border-blue-500', bg: 'hover:bg-blue-500/5' },
    ]
  },
  {
    label: 'PDF',
    conversions: [
      { from: 'PDF', to: 'JPG', route: '/pdf-to-jpg', description: 'Converta páginas do PDF em JPG', icon: '📄', color: 'text-red-400', border: 'hover:border-red-500', bg: 'hover:bg-red-500/5' },
      { from: 'PDF', to: 'PNG', route: '/pdf-to-png', description: 'Converta páginas do PDF em PNG', icon: '📄', color: 'text-orange-400', border: 'hover:border-orange-500', bg: 'hover:bg-orange-500/5' },
      { from: 'Juntar', to: 'PDF', route: '/merge-pdf', description: 'Una vários PDFs em um só', icon: '📎', color: 'text-purple-400', border: 'hover:border-purple-500', bg: 'hover:bg-purple-500/5' },
      { from: 'PDF', to: 'DOCX', route: '/pdf-to-docx', description: 'Converta PDF para Word', icon: '📝', color: 'text-blue-300', border: 'hover:border-blue-300', bg: 'hover:bg-blue-300/5' },
      { from: 'PDF', to: 'XLSX', route: '/pdf-to-xlsx', description: 'Converta PDF para Excel', icon: '📊', color: 'text-green-300', border: 'hover:border-green-300', bg: 'hover:bg-green-300/5' },
    ]
  },
  {
    label: 'Documentos',
    conversions: [
      { from: 'DOCX', to: 'TXT', route: '/docx-to-txt', description: 'Extraia o texto do seu DOCX', icon: '📝', color: 'text-cyan-400', border: 'hover:border-cyan-500', bg: 'hover:bg-cyan-500/5' },
    ]
  },
  {
    label: 'Planilhas',
    conversions: [
      { from: 'XLSX', to: 'CSV', route: '/xlsx-to-csv', description: 'Converta planilhas Excel para CSV', icon: '📊', color: 'text-green-400', border: 'hover:border-green-500', bg: 'hover:bg-green-500/5' },
    ]
  },
]

const totalTools = categories.reduce((acc, cat) => acc + cat.conversions.length, 0)

function Home() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
          100% no navegador · sem upload
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Converta seus arquivos<br />
          <span className="text-blue-500">de forma simples</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
          {totalTools} ferramentas gratuitas para converter arquivos diretamente no seu navegador, sem enviar dados para servidores externos.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalTools}</div>
            <div className="text-xs text-gray-500 mt-1">Ferramentas</div>
          </div>
          <div className="w-px bg-gray-800"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">0MB</div>
            <div className="text-xs text-gray-500 mt-1">Upload externo</div>
          </div>
          <div className="w-px bg-gray-800"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">∞</div>
            <div className="text-xs text-gray-500 mt-1">Conversões</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-10">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {cat.label}
              </h2>
              <div className="flex-1 h-px bg-gray-800"></div>
              <span className="text-xs text-gray-600">{cat.conversions.length} {cat.conversions.length === 1 ? 'ferramenta' : 'ferramentas'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {cat.conversions.map((conv) => (
                <div
                  key={conv.route}
                  onClick={() => navigate(conv.route)}
                  className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${conv.border} ${conv.bg} hover:scale-105 group`}
                >
                  <div className="text-3xl mb-4">{conv.icon}</div>
                  <div className="mb-2">
                    <span className={`text-base font-bold ${conv.color}`}>{conv.from}</span>
                    <span className="text-gray-600 mx-2 text-sm">→</span>
                    <span className="text-base font-bold text-white">{conv.to}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{conv.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-gray-600">
          Marvert © 2024 · Processamento local no navegador
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {['React', 'TypeScript', 'Vite', 'Tailwind', 'PDF.js', 'SheetJS'].map((tech) => (
            <span key={tech} className="text-xs px-2 py-1 bg-gray-900 border border-gray-800 rounded text-gray-500">
              {tech}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Home