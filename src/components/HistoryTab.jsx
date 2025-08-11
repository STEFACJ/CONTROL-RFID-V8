import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  History, 
  Search, 
  Download, 
  Filter,
  Calendar,
  Clock,
  User,
  RefreshCw,
  FileText,
  Trash2
} from 'lucide-react'

const HistoryTab = () => {
  const [readings, setReadings] = useState([])
  const [filteredReadings, setFilteredReadings] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Carregar dados do localStorage
  useEffect(() => {
    loadReadings()
  }, [])

  // Filtrar leituras baseado na busca e data
  useEffect(() => {
    let filtered = readings

    if (searchTerm) {
      filtered = filtered.filter(reading =>
        reading.rfidCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (dateFilter) {
      // Corrigir problema de fuso horário ao comparar datas
      const filterDate = new Date(dateFilter + 'T00:00:00')
      const filterDateStr = filterDate.toLocaleDateString('pt-BR')
      filtered = filtered.filter(reading => {
        const readingDate = new Date(reading.timestamp)
        const readingDateStr = readingDate.toLocaleDateString('pt-BR')
        return readingDateStr === filterDateStr
      })
    }

    setFilteredReadings(filtered)
  }, [readings, searchTerm, dateFilter])

  const loadReadings = () => {
    setIsLoading(true)
    setTimeout(() => {
      const data = JSON.parse(localStorage.getItem('rfidReadings') || '[]')
      const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      setReadings(sortedData)
      setIsLoading(false)
    }, 500)
  }

  const clearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('rfidReadings')
      setReadings([])
      setFilteredReadings([])
    }
  }

  const exportToCSV = () => {
    if (filteredReadings.length === 0) {
      alert('Nenhum dado para exportar')
      return
    }

    const headers = ['Código RFID', 'Data', 'Hora', 'Status']
    const csvContent = [
      headers.join(','),
      ...filteredReadings.map(reading => [
        reading.rfidCode,
        new Date(reading.timestamp).toLocaleDateString('pt-BR'),
        new Date(reading.timestamp).toLocaleTimeString('pt-BR'),
        reading.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `historico_rfid_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400">Sucesso</Badge>
      case 'error':
        return <Badge variant="destructive">Erro</Badge>
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  const getReadingsByDate = () => {
    const grouped = {}
    filteredReadings.forEach(reading => {
      const date = new Date(reading.timestamp).toLocaleDateString('pt-BR')
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(reading)
    })
    return grouped
  }

  const groupedReadings = getReadingsByDate()

  return (
    <div className="space-y-6">
      {/* Título da Seção */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <History className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Histórico de Leituras</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={loadReadings}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            disabled={filteredReadings.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button
            onClick={clearHistory}
            variant="outline"
            size="sm"
            className="text-red-400 hover:text-red-300"
            disabled={readings.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="rfid-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Buscar por código RFID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Digite o código RFID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rfid-input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Filtrar por data
              </label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="rfid-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/20">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Leituras</p>
                <p className="text-2xl font-bold text-foreground">{readings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <User className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Filtradas</p>
                <p className="text-2xl font-bold text-foreground">{filteredReadings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-500/20">
                <Calendar className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dias com Registros</p>
                <p className="text-2xl font-bold text-foreground">{Object.keys(groupedReadings).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Leituras */}
      <Card className="rfid-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Registros</span>
            <Badge variant="secondary">{filteredReadings.length} itens</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-muted-foreground">Carregando histórico...</p>
            </div>
          ) : filteredReadings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma leitura encontrada</p>
              <p className="text-sm">
                {readings.length === 0 
                  ? 'Realize algumas leituras na aba "Leitura RFID"'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedReadings).map(([date, dayReadings]) => (
                <div key={date}>
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="font-medium text-foreground">{date}</h3>
                    <Badge variant="outline">{dayReadings.length} leituras</Badge>
                  </div>
                  <div className="space-y-2">
                    {dayReadings.map((reading) => {
                      const { time } = formatDateTime(reading.timestamp)
                      return (
                        <div
                          key={reading.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-primary/20">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-mono text-sm font-medium">
                                {reading.rfidCode}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ID: {reading.id}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-sm font-medium">{time}</p>
                              {getStatusBadge(reading.status)}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default HistoryTab

