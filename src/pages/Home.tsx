import { useNavigate } from 'react-router-dom'

const categories = [
  {
    label: 'Imagens',
    icon: '🖼️',
    conversions: [
      { from: 'JPG', to: 'PNG', route: '/jpg-to-png', description: 'Converta JPG para PNG', color: 'text-yellow-400', border: 'hover:border-yellow-500' },
      { from: 'PNG', to: 'JPG', route: '/png-to-jpg', description: 'Converta PNG para JPG', color: 'text-blue-400', border: 'hover:border-blue-500' },
    ]
  },
  {
    label: 'PDF',
    icon: '📄',
    conversions: [
      { from: 'PDF', to: 'JPG', route: '/pdf-to-jpg', description: 'Converta páginas do PDF em JPG', color: 'text-red-400', border: 'hover:border-red-500' },
      { from: 'PDF', to: 'PNG', route: '/pdf-to-png', description: 'Converta páginas do PDF em PNG', color: 'text-orange-400', border: 'hover:border-orange-500' },
      { from: 'Juntar', to: 'PDF', route: '/merge-pdf', description: 'Una vários PDFs em um só', color: 'text-purple-400', border: 'hover:border-purple-500' },
    ]
  },
  {
    label: 'Documentos',
    icon: '📝',
    conversions: [
      { from: 'DOCX', to: 'TXT', route: '/docx-to-txt', description: 'Extraia o texto do seu DOCX', color: 'text-cyan-400', border: 'hover:border-cyan-500' },
    ]
  },
  {
    label: 'Planilhas',
    icon: '📊',
    conversions: [
      { from: 'XLSX', to: 'CSV', route: '/xlsx-to-csv', description: 'Converta planilhas Excel para CSV', color: 'text-green-400', border: 'hover:border-green-500' },
    ]
  },
]

function Home() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Converta seus arquivos
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Selecione o tipo de conversão — rápido, gratuito e sem upload para servidores externos.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{cat.icon}</span>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                {cat.label}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cat.conversions.map((conv) => (
                <div
                  key={conv.route}
                  onClick={() => navigate(conv.route)}
                  className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${conv.border} hover:bg-gray-800 hover:scale-105`}
                >
                  <div className="mb-3">
                    <span className={`text-lg font-bold ${conv.color}`}>{conv.from}</span>
                    <span className="text-gray-500 mx-2">→</span>
                    <span className="text-lg font-bold text-white">{conv.to}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{conv.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home