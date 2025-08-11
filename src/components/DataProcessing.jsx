import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Calendar,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

const DataProcessing = () => {
  const [processedData, setProcessedData] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    processData()
  }, [])

  const processData = () => {
    setIsProcessing(true)
    
    setTimeout(() => {
      const readings = JSON.parse(localStorage.getItem('rfidReadings') || '[]')
      const employees = JSON.parse(localStorage.getItem('employees') || '[]')
      
      // Agrupar leituras por funcionário e data
      const groupedData = {}
      
      readings.forEach(reading => {
        const date = new Date(reading.timestamp).toDateString()
        const key = `${reading.rfidCode}_${date}`
        
        if (!groupedData[key]) {
          groupedData[key] = {
            rfidCode: reading.rfidCode,
            date: date,
            readings: []
          }
        }
        
        groupedData[key].readings.push(reading)
      })

      // Processar cada grupo
      const processed = Object.values(groupedData).map(group => {
        const sortedReadings = group.readings.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        )
        
        const firstReading = sortedReadings[0]
        const lastReading = sortedReadings[sortedReadings.length - 1]
        
        // Encontrar dados do funcionário
        const employee = employees.find(emp => emp.rfidCode === group.rfidCode)
        
        // Calcular intervalo se houver mais de uma leitura
        let intervalMinutes = null
        let observations = []
        
        if (sortedReadings.length === 1) {
          observations.push({
            type: 'warning',
            message: 'Apenas 1 leitura no dia'
          })
        } else if (sortedReadings.length >= 2) {
          const firstTime = new Date(firstReading.timestamp)
          const lastTime = new Date(lastReading.timestamp)
          intervalMinutes = Math.round((lastTime - firstTime) / (1000 * 60))
          
          if (intervalMinutes < 25) {
            observations.push({
              type: 'error',
              message: `Intervalo muito curto: ${intervalMinutes} min (possível erro)`
            })
          } else if (intervalMinutes > 40) {
            observations.push({
              type: 'warning',
              message: `Intervalo longo: ${intervalMinutes} min`
            })
          } else {
            observations.push({
              type: 'success',
              message: `Intervalo normal: ${intervalMinutes} min`
            })
          }
        }

        return {
          rfidCode: group.rfidCode,
          employeeName: employee?.name || 'Funcionário não cadastrado',
          employeeRE: employee?.re || 'N/A',
          date: group.date,
          totalReadings: sortedReadings.length,
          firstReading: firstReading,
          lastReading: lastReading,
          intervalMinutes: intervalMinutes,
          observations: observations
        }
      })

      // Ordenar por data (mais recente primeiro)
      processed.sort((a, b) => new Date(b.date) - new Date(a.date))
      
      setProcessedData(processed)
      setLastUpdate(new Date())
      setIsProcessing(false)
    }, 1000)
  }

  const getObservationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getObservationBadge = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getIntervalTrend = (minutes) => {
    if (!minutes) return null
    if (minutes < 25) return <TrendingDown className="h-4 w-4 text-red-400" />
    if (minutes > 40) return <TrendingUp className="h-4 w-4 text-yellow-400" />
    return <CheckCircle className="h-4 w-4 text-green-400" />
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Estatísticas
  const stats = {
    totalRecords: processedData.length,
    withErrors: processedData.filter(item => 
      item.observations.some(obs => obs.type === 'error')
    ).length,
    withWarnings: processedData.filter(item => 
      item.observations.some(obs => obs.type === 'warning')
    ).length,
    normal: processedData.filter(item => 
      item.observations.every(obs => obs.type === 'success')
    ).length
  }

  return (
    <div className="space-y-6">
      {/* Título da Seção */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Tratamento de Dados</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={processData}
            variant="outline"
            size="sm"
            disabled={isProcessing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Processando...' : 'Reprocessar'}
          </Button>
          {lastUpdate && (
            <span className="text-sm text-muted-foreground">
              Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
            </span>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/20">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Registros</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Normais</p>
                <p className="text-2xl font-bold text-green-400">{stats.normal}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-yellow-500/20">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Com Avisos</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.withWarnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-red-500/20">
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Com Erros</p>
                <p className="text-2xl font-bold text-red-400">{stats.withErrors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Dados Processados */}
      <Card className="rfid-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Dados Processados</span>
            <Badge variant="secondary">{processedData.length} registros</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isProcessing ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-muted-foreground">Processando dados...</p>
            </div>
          ) : processedData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum dado para processar</p>
              <p className="text-sm">Realize algumas leituras para ver o tratamento de dados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {processedData.map((item, index) => (
                <div
                  key={`${item.rfidCode}_${item.date}`}
                  className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary/20">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {item.employeeName}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>RE: {item.employeeRE}</span>
                          <span>•</span>
                          <span className="font-mono">{item.rfidCode}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {item.totalReadings} leituras
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Primeira Leitura</p>
                      <p className="text-sm font-medium">
                        {formatTime(item.firstReading.timestamp)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Última Leitura</p>
                      <p className="text-sm font-medium">
                        {item.lastReading ? formatTime(item.lastReading.timestamp) : 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Intervalo</p>
                      <div className="flex items-center space-x-2">
                        {getIntervalTrend(item.intervalMinutes)}
                        <p className="text-sm font-medium">
                          {item.intervalMinutes ? `${item.intervalMinutes} min` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Observações:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.observations.map((obs, obsIndex) => (
                        <div
                          key={obsIndex}
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs border ${getObservationBadge(obs.type)}`}
                        >
                          {getObservationIcon(obs.type)}
                          <span>{obs.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre o Tratamento */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-blue-500/20">
              <Settings className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-400 mb-2">Como funciona o tratamento de dados</h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• <strong>Primeiro e último registro:</strong> Identifica entrada e saída do intervalo</li>
                <li>• <strong>Apenas 1 leitura:</strong> Funcionário pode ter esquecido de registrar saída</li>
                <li>• <strong>Intervalo &lt; 25 min:</strong> Possível erro de leitura ou intervalo muito curto</li>
                <li>• <strong>Intervalo &gt; 40 min:</strong> Intervalo mais longo que o padrão</li>
                <li>• <strong>Cruzamento com cadastro:</strong> Exibe nome e RE do funcionário</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DataProcessing

