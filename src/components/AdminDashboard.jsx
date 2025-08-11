import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  BarChart3, 
  Download, 
  RefreshCw,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileSpreadsheet,
  Database
} from 'lucide-react';
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
} from 'recharts';

function AdminDashboard() {
  const [allUsersData, setAllUsersData] = useState([]);
  const [consolidatedData, setConsolidatedData] = useState({
    totalReadings: 0,
    totalEmployees: 0,
    averageInterval: 0,
    longBreaks: [],
    dailyStats: [],
    employeeStats: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    loadAllUsersData();
  }, []);

  const loadAllUsersData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Simular carregamento de dados de todos os usuários
      const readings = JSON.parse(localStorage.getItem('rfidReadings') || '[]');
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Processar dados consolidados
      const processed = processConsolidatedData(readings, employees, users);
      setConsolidatedData(processed);
      setAllUsersData({ readings, employees, users });
      setIsLoading(false);
    }, 1000);
  };

  const processConsolidatedData = (readings, employees, users) => {
    // Agrupar leituras por funcionário e data
    const groupedData = {};
    
    readings.forEach(reading => {
      const date = new Date(reading.timestamp).toDateString();
      const key = `${reading.rfidCode}_${date}`;
      
      if (!groupedData[key]) {
        groupedData[key] = {
          rfidCode: reading.rfidCode,
          date: date,
          readings: []
        };
      }
      
      groupedData[key].readings.push(reading);
    });

    // Processar intervalos
    const processedIntervals = Object.values(groupedData).map(group => {
      const sortedReadings = group.readings.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
      
      const employee = employees.find(emp => emp.rfidCode === group.rfidCode);
      
      let intervalMinutes = null;
      if (sortedReadings.length >= 2) {
        const firstTime = new Date(sortedReadings[0].timestamp);
        const lastTime = new Date(sortedReadings[sortedReadings.length - 1].timestamp);
        intervalMinutes = Math.round((lastTime - firstTime) / (1000 * 60));
      }
      
      return {
        rfidCode: group.rfidCode,
        employeeName: employee?.name || 'Funcionário não cadastrado',
        date: group.date,
        intervalMinutes: intervalMinutes,
        readingsCount: sortedReadings.length
      };
    }).filter(item => item.intervalMinutes !== null);

    // Funcionários com intervalo > 40 minutos
    const longBreaks = processedIntervals
      .filter(item => item.intervalMinutes > 40)
      .sort((a, b) => b.intervalMinutes - a.intervalMinutes);

    // Estatísticas por funcionário
    const employeeStats = employees.map(employee => {
      const employeeIntervals = processedIntervals.filter(item => item.rfidCode === employee.rfidCode);
      const totalIntervals = employeeIntervals.length;
      const avgInterval = totalIntervals > 0 
        ? Math.round(employeeIntervals.reduce((sum, item) => sum + item.intervalMinutes, 0) / totalIntervals)
        : 0;
      const longBreaksCount = employeeIntervals.filter(item => item.intervalMinutes > 40).length;
      
      return {
        name: employee.name,
        rfidCode: employee.rfidCode,
        totalIntervals,
        avgInterval,
        longBreaksCount,
        compliance: longBreaksCount === 0 ? 'Excelente' : longBreaksCount <= 2 ? 'Bom' : 'Atenção'
      };
    });

    // Estatísticas diárias (últimos 30 dias)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();

    const dailyStats = last30Days.map(dateStr => {
      const dayData = processedIntervals.filter(item => item.date === dateStr);
      return {
        date: new Date(dateStr).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        total: dayData.length,
        longBreaks: dayData.filter(item => item.intervalMinutes > 40).length,
        normalBreaks: dayData.filter(item => item.intervalMinutes >= 25 && item.intervalMinutes <= 40).length
      };
    });

    return {
      totalReadings: readings.length,
      totalEmployees: employees.length,
      averageInterval: processedIntervals.length > 0 
        ? Math.round(processedIntervals.reduce((sum, item) => sum + item.intervalMinutes, 0) / processedIntervals.length)
        : 0,
      longBreaks,
      dailyStats: dailyStats.slice(-14), // Últimos 14 dias para melhor visualização
      employeeStats
    };
  };

  const exportConsolidatedReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      generatedBy: 'admin',
      summary: {
        totalReadings: consolidatedData.totalReadings,
        totalEmployees: consolidatedData.totalEmployees,
        averageInterval: consolidatedData.averageInterval,
        longBreaksCount: consolidatedData.longBreaks.length
      },
      employeeStats: consolidatedData.employeeStats,
      longBreaks: consolidatedData.longBreaks,
      dailyStats: consolidatedData.dailyStats,
      rawData: allUsersData
    };

    const jsonString = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_consolidado_admin_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const headers = ['Funcionário', 'RFID', 'Total Intervalos', 'Média (min)', 'Intervalos Longos', 'Status'];
    const csvContent = [
      headers.join(','),
      ...consolidatedData.employeeStats.map(emp => [
        emp.name,
        emp.rfidCode,
        emp.totalIntervals,
        emp.avgInterval,
        emp.longBreaksCount,
        emp.compliance
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_funcionarios_admin_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getComplianceColor = (compliance) => {
    switch (compliance) {
      case 'Excelente':
        return 'bg-green-500/20 text-green-400';
      case 'Bom':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Atenção':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Título da Seção */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Painel Administrativo</h2>
          <Badge variant="secondary" className="bg-red-500/20 text-red-400">ADMIN</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={loadAllUsersData}
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
            onClick={exportConsolidatedReport}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Relatório Completo
          </Button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Leituras</p>
                <p className="text-2xl font-bold text-foreground">{consolidatedData.totalReadings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-500/20">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Funcionários</p>
                <p className="text-2xl font-bold text-blue-400">{consolidatedData.totalEmployees}</p>
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
                <p className="text-sm text-muted-foreground">Média Geral</p>
                <p className="text-2xl font-bold text-green-400">{consolidatedData.averageInterval}min</p>
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
                <p className="text-2xl font-bold text-red-400">{consolidatedData.longBreaks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas por Funcionário */}
      <Card className="rfid-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Desempenho por Funcionário</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consolidatedData.employeeStats.map((employee, index) => (
              <div
                key={employee.rfidCode}
                className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.rfidCode}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Intervalos</p>
                    <p className="font-bold text-foreground">{employee.totalIntervals}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Média</p>
                    <p className="font-bold text-foreground">{employee.avgInterval}min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Longos</p>
                    <p className="font-bold text-red-400">{employee.longBreaksCount}</p>
                  </div>
                  <Badge className={getComplianceColor(employee.compliance)}>
                    {employee.compliance}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Tendência */}
      <Card className="rfid-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Tendência dos Últimos 14 Dias</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consolidatedData.dailyStats}>
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
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Total de Intervalos"
                />
                <Line 
                  type="monotone" 
                  dataKey="longBreaks" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Intervalos Longos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre Funcionalidades Admin */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-blue-500/20">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-400 mb-2">Funcionalidades Administrativas</h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• <strong>Visão Consolidada:</strong> Dados de todos os funcionários em um só lugar</li>
                <li>• <strong>Análise de Desempenho:</strong> Métricas individuais e comparativas</li>
                <li>• <strong>Relatórios Avançados:</strong> Exportação completa em JSON e Excel</li>
                <li>• <strong>Monitoramento:</strong> Identificação de padrões e tendências</li>
                <li>• <strong>Compliance:</strong> Classificação automática de conformidade</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;

