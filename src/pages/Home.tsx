import { useNavigate } from 'react-router-dom'

const conversions = [
  {
    from: 'PDF',
    to: 'JPG',
    route: '/pdf-to-jpg',
    icon: '📄',
    description: 'Converta páginas do PDF em imagens JPG',
    color: 'text-red-400',
    border: 'hover:border-red-500',
  },
  {
    from: 'JPG',
    to: 'PNG',
    route: '/jpg-to-png',
    icon: '🖼️',
    description: 'Converta imagens JPG para formato PNG',
    color: 'text-yellow-400',
    border: 'hover:border-yellow-500',
  },
  {
    from: 'PNG',
    to: 'JPG',
    route: '/png-to-jpg',
    icon: '🖼️',
    description: 'Converta imagens PNG para formato JPG',
    color: 'text-blue-400',
    border: 'hover:border-blue-500',
  },
  {
    from: 'XLSX',
    to: 'CSV',
    route: '/xlsx-to-csv',
    icon: '📊',
    description: 'Converta planilhas Excel para CSV',
    color: 'text-green-400',
    border: 'hover:border-green-500',
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {conversions.map((conv) => (
          <div
            key={conv.route}
            onClick={() => navigate(conv.route)}
            className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${conv.border} hover:bg-gray-800 hover:scale-105`}
          >
            <div className="text-4xl mb-4">{conv.icon}</div>
            <div className="mb-2">
              <span className={`text-lg font-bold ${conv.color}`}>{conv.from}</span>
              <span className="text-gray-500 mx-2">→</span>
              <span className="text-lg font-bold text-white">{conv.to}</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{conv.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home