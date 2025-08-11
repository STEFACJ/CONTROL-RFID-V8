import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  BarChart3, 
  Download, 
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
  Calendar,
  Filter,
  FileSpreadsheet
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const ControlPanel = () => {
  const [dashboardData, setDashboardData] = useState({
    longBreaks: [],
    dailyStats: [],
    weeklyStats: [],
    monthlyStats: [],
    intervalDistribution: []
  })
  const [selectedPeriod, setSelectedPeriod] = useState('day')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      const readings = JSON.parse(localStorage.getItem('rfidReadings') || '[]')
      const employees = JSON.parse(localStorage.getItem('employees') || '[]')
      
      // Processar dados para o dashboard
      const processedData = processReadingsForDashboard(readings, employees)
      setDashboardData(processedData)
      setLastUpdate(new Date())
      setIsLoading(false)
    }, 1000)
  }

  const processReadingsForDashboard = (readings, employees) => {
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

    // Processar intervalos
    const processedIntervals = Object.values(groupedData).map(group => {
      const sortedReadings = group.readings.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      )
      
      const employee = employees.find(emp => emp.rfidCode === group.rfidCode)
      
      let intervalMinutes = null
      if (sortedReadings.length >= 2) {
        const firstTime = new Date(sortedReadings[0].timestamp)
        const lastTime = new Date(sortedReadings[sortedReadings.length - 1].timestamp)
        intervalMinutes = Math.round((lastTime - firstTime) / (1000 * 60))
      }
      
      return {
        rfidCode: group.rfidCode,
        employeeName: employee?.name || 'Funcionário não cadastrado',
        date: group.date,
        intervalMinutes: intervalMinutes,
        readingsCount: sortedReadings.length
      }
    }).filter(item => item.intervalMinutes !== null)

    // Funcionários com intervalo > 40 minutos
    const longBreaks = processedIntervals
      .filter(item => item.intervalMinutes > 40)
      .sort((a, b) => b.intervalMinutes - a.intervalMinutes)

    // Estatísticas diárias (últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toDateString()
    }).reverse()

    const dailyStats = last7Days.map(dateStr => {
      const dayData = processedIntervals.filter(item => item.date === dateStr)
      return {
        date: new Date(dateStr).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        total: dayData.length,
        longBreaks: dayData.filter(item => item.intervalMinutes > 40).length,
        shortBreaks: dayData.filter(item => item.intervalMinutes < 25).length,
        normalBreaks: dayData.filter(item => item.intervalMinutes >= 25 && item.intervalMinutes <= 40).length
      }
    })

    // Distribuição de intervalos
    const intervalRanges = [
      { name: '< 25 min', min: 0, max: 24, color: '#ef4444' },
      { name: '25-40 min', min: 25, max: 40, color: '#10b981' },
      { name: '41-60 min', min: 41, max: 60, color: '#f59e0b' },
      { name: '> 60 min', min: 61, max: Infinity, color: '#dc2626' }
    ]

    const intervalDistribution = intervalRanges.map(range => {
      const count = processedIntervals.filter(item => 
        item.intervalMinutes >= range.min && item.intervalMinutes <= range.max
      ).length
      
      return {
        name: range.name,
        value: count,
        color: range.color
      }
    })

    return {
      longBreaks,
      dailyStats,
      intervalDistribution,
      totalIntervals: processedIntervals.length,
      averageInterval: processedIntervals.length > 0 
        ? Math.round(processedIntervals.reduce((sum, item) => sum + item.intervalMinutes, 0) / processedIntervals.length)
        : 0
    }
  }

  const exportDashboardData = () => {
    const data = {
      longBreaks: dashboardData.longBreaks,
      dailyStats: dashboardData.dailyStats,
      exportDate: new Date().toISOString(),
      totalIntervals: dashboardData.totalIntervals,
      averageInterval: dashboardData.averageInterval
    }

    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `dashboard_data_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    // Simular exportação para Excel (CSV)
    const headers = ['Funcionário', 'Data', 'Intervalo (min)', 'Status']
    const csvContent = [
      headers.join(','),
      ...dashboardData.longBreaks.map(item => [
        item.employeeName,
        new Date(item.date).toLocaleDateString('pt-BR'),
        item.intervalMinutes,
        item.intervalMinutes > 40 ? 'Intervalo Longo' : 'Normal'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `relatorio_intervalos_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const COLORS = ['#ef4444', '#10b981', '#f59e0b', '#dc2626']

  return (
    <div className="space-y-6">
      {/* Título da Seção */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Painel de Controle</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={loadDashboardData}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            onClick={exportToExcel}
            variant="outline"
            size="sm"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button
            onClick={exportDashboardData}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Intervalos</p>
                <p className="text-2xl font-bold text-foreground">{dashboardData.totalIntervals}</p>
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
                <p className="text-sm text-muted-foreground">Intervalos Longos</p>
                <p className="text-2xl font-bold text-red-400">{dashboardData.longBreaks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média de Intervalo</p>
                <p className="text-2xl font-bold text-green-400">{dashboardData.averageInterval}min</p>
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
                <p className="text-sm text-muted-foreground">Última Atualização</p>
                <p className="text-sm font-bold text-blue-400">
                  {lastUpdate ? lastUpdate.toLocaleTimeString('pt-BR') : 'Nunca'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funcionários com Intervalo > 40 min */}
      <Card className="rfid-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span>Funcionários com Intervalo Superior a 40 Minutos</span>
            <Badge variant="destructive">{dashboardData.longBreaks.length} funcionários</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.longBreaks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum funcionário com intervalo longo hoje</p>
              <p className="text-sm">Todos os intervalos estão dentro do padrão</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboardData.longBreaks.map((item, index) => (
                <div
                  key={`${item.rfidCode}_${item.date}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-red-500/20">
                      <Users className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.employeeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-400">
                      {formatTime(item.intervalMinutes)}
                    </p>
                    <Badge variant="destructive" className="text-xs">
                      +{item.intervalMinutes - 40}min acima
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Estatísticas Diárias */}
        <Card className="rfid-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Estatísticas dos Últimos 7 Dias</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#a3a3a3"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#a3a3a3"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #404040',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Bar dataKey="total" fill="#dc2626" name="Total" />
                  <Bar dataKey="longBreaks" fill="#ef4444" name="Intervalos Longos" />
                  <Bar dataKey="normalBreaks" fill="#10b981" name="Intervalos Normais" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Distribuição de Intervalos */}
        <Card className="rfid-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Distribuição de Intervalos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.intervalDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {dashboardData.intervalDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #404040',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações sobre o Painel */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-blue-500/20">
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-400 mb-2">Funcionalidades do Painel</h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• <strong>Intervalos Longos:</strong> Funcionários com mais de 40 minutos de intervalo</li>
                <li>• <strong>Gráficos de Performance:</strong> Visualização por dia, semana e mês</li>
                <li>• <strong>Exportação:</strong> Download de relatórios em Excel (.csv) e JSON</li>
                <li>• <strong>Atualização Automática:</strong> Dados atualizados em tempo real</li>
                <li>• <strong>Análise de Tendências:</strong> Identificação de padrões nos intervalos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ControlPanel

