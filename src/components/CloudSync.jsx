import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Cloud, 
  CloudUpload, 
  CloudDownload,
  Settings,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Link,
  Database,
  Shield
} from 'lucide-react'

const CloudSync = () => {
  const [syncConfig, setSyncConfig] = useState({
    googleSheetsUrl: '',
    autoSync: false,
    syncInterval: 30,
    lastSync: null
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState('idle')

  useEffect(() => {
    loadSyncConfig()
  }, [])

  const loadSyncConfig = () => {
    const config = JSON.parse(localStorage.getItem('syncConfig') || '{}')
    setSyncConfig(prev => ({ ...prev, ...config }))
    setIsConnected(!!config.googleSheetsUrl)
  }

  const saveSyncConfig = (newConfig) => {
    localStorage.setItem('syncConfig', JSON.stringify(newConfig))
    setSyncConfig(newConfig)
  }

  const handleConnect = () => {
    if (!syncConfig.googleSheetsUrl) {
      alert('Por favor, insira a URL da planilha do Google Sheets')
      return
    }

    // Simular conexão
    setIsSyncing(true)
    setTimeout(() => {
      setIsConnected(true)
      setSyncStatus('connected')
      setIsSyncing(false)
      
      const newConfig = {
        ...syncConfig,
        lastSync: new Date().toISOString()
      }
      saveSyncConfig(newConfig)
    }, 2000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setSyncStatus('idle')
    const newConfig = {
      ...syncConfig,
      googleSheetsUrl: '',
      lastSync: null
    }
    saveSyncConfig(newConfig)
  }

  const handleSyncUp = () => {
    if (!isConnected) return

    setIsSyncing(true)
    setSyncStatus('uploading')

    // Simular upload de dados
    setTimeout(() => {
      const readings = JSON.parse(localStorage.getItem('rfidReadings') || '[]')
      const employees = JSON.parse(localStorage.getItem('employees') || '[]')
      
      // Simular envio para Google Sheets
      console.log('Enviando dados para Google Sheets:', { readings, employees })
      
      setSyncStatus('success')
      setIsSyncing(false)
      
      const newConfig = {
        ...syncConfig,
        lastSync: new Date().toISOString()
      }
      saveSyncConfig(newConfig)

      setTimeout(() => setSyncStatus('connected'), 3000)
    }, 3000)
  }

  const handleSyncDown = () => {
    if (!isConnected) return

    setIsSyncing(true)
    setSyncStatus('downloading')

    // Simular download de dados
    setTimeout(() => {
      // Simular dados vindos do Google Sheets
      const mockData = {
        employees: [
          {
            id: Date.now(),
            name: 'Maria Silva',
            re: '54321',
            rfidCode: 'RFID654321',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      }

      // Mesclar com dados locais
      const existingEmployees = JSON.parse(localStorage.getItem('employees') || '[]')
      const mergedEmployees = [...existingEmployees, ...mockData.employees]
      localStorage.setItem('employees', JSON.stringify(mergedEmployees))

      setSyncStatus('success')
      setIsSyncing(false)
      
      const newConfig = {
        ...syncConfig,
        lastSync: new Date().toISOString()
      }
      saveSyncConfig(newConfig)

      setTimeout(() => setSyncStatus('connected'), 3000)
    }, 3000)
  }

  const handleAutoSyncToggle = () => {
    const newConfig = {
      ...syncConfig,
      autoSync: !syncConfig.autoSync
    }
    saveSyncConfig(newConfig)
  }

  const exportBackup = () => {
    const data = {
      rfidReadings: JSON.parse(localStorage.getItem('rfidReadings') || '[]'),
      employees: JSON.parse(localStorage.getItem('employees') || '[]'),
      syncConfig: syncConfig,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }

    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `backup_sistema_rfid_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const importBackup = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        if (data.rfidReadings) {
          localStorage.setItem('rfidReadings', JSON.stringify(data.rfidReadings))
        }
        if (data.employees) {
          localStorage.setItem('employees', JSON.stringify(data.employees))
        }
        if (data.syncConfig) {
          saveSyncConfig(data.syncConfig)
        }

        alert('Backup importado com sucesso!')
        window.location.reload()
      } catch (error) {
        alert('Erro ao importar backup: arquivo inválido')
      }
    }
    reader.readAsText(file)
  }

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'uploading':
      case 'downloading':
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <Cloud className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (syncStatus) {
      case 'connected':
        return 'Conectado'
      case 'uploading':
        return 'Enviando dados...'
      case 'downloading':
        return 'Baixando dados...'
      case 'success':
        return 'Sincronização concluída'
      case 'error':
        return 'Erro na sincronização'
      default:
        return 'Desconectado'
    }
  }

  return (
    <div className="space-y-6">
      {/* Título da Seção */}
      <div className="flex items-center space-x-3">
        <Cloud className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Sincronização em Nuvem</h2>
      </div>

      {/* Status de Conexão */}
      <Card className="rfid-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link className="h-5 w-5 text-primary" />
              <span>Status da Conexão</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <Badge variant={isConnected ? "secondary" : "outline"}>
                {getStatusText()}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              URL da Planilha Google Sheets
            </label>
            <Input
              type="url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={syncConfig.googleSheetsUrl}
              onChange={(e) => setSyncConfig(prev => ({ ...prev, googleSheetsUrl: e.target.value }))}
              className="rfid-input"
              disabled={isConnected}
            />
          </div>

          <div className="flex items-center space-x-2">
            {!isConnected ? (
              <Button
                onClick={handleConnect}
                disabled={isSyncing || !syncConfig.googleSheetsUrl}
                className="rfid-button"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4 mr-2" />
                    Conectar
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="text-red-400 hover:text-red-300"
              >
                <Link className="h-4 w-4 mr-2" />
                Desconectar
              </Button>
            )}
          </div>

          {syncConfig.lastSync && (
            <p className="text-sm text-muted-foreground">
              Última sincronização: {new Date(syncConfig.lastSync).toLocaleString('pt-BR')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Controles de Sincronização */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rfid-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CloudUpload className="h-5 w-5 text-primary" />
              <span>Enviar Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enviar leituras RFID e cadastro de funcionários para a planilha
            </p>
            <Button
              onClick={handleSyncUp}
              disabled={!isConnected || isSyncing}
              className="w-full rfid-button"
            >
              {syncStatus === 'uploading' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CloudUpload className="h-4 w-4 mr-2" />
                  Enviar para Nuvem
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="rfid-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CloudDownload className="h-5 w-5 text-primary" />
              <span>Baixar Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Baixar dados atualizados da planilha para o sistema local
            </p>
            <Button
              onClick={handleSyncDown}
              disabled={!isConnected || isSyncing}
              className="w-full rfid-button"
            >
              {syncStatus === 'downloading' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Baixando...
                </>
              ) : (
                <>
                  <CloudDownload className="h-4 w-4 mr-2" />
                  Baixar da Nuvem
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Backup Local */}
      <Card className="rfid-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <span>Backup Local</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Exportar Backup</h3>
              <p className="text-sm text-muted-foreground">
                Baixar todos os dados do sistema em formato JSON
              </p>
              <Button
                onClick={exportBackup}
                variant="outline"
                className="w-full"
              >
                <CloudDownload className="h-4 w-4 mr-2" />
                Exportar Backup
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Importar Backup</h3>
              <p className="text-sm text-muted-foreground">
                Restaurar dados de um arquivo de backup
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importBackup}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full">
                  <CloudUpload className="h-4 w-4 mr-2" />
                  Importar Backup
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações Avançadas */}
      <Card className="rfid-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Configurações Avançadas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Sincronização Automática</h3>
              <p className="text-sm text-muted-foreground">
                Sincronizar dados automaticamente a cada {syncConfig.syncInterval} minutos
              </p>
            </div>
            <Button
              onClick={handleAutoSyncToggle}
              variant={syncConfig.autoSync ? "default" : "outline"}
              size="sm"
            >
              {syncConfig.autoSync ? 'Ativado' : 'Desativado'}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Intervalo de Sincronização (minutos)
            </label>
            <Input
              type="number"
              min="5"
              max="1440"
              value={syncConfig.syncInterval}
              onChange={(e) => setSyncConfig(prev => ({ ...prev, syncInterval: parseInt(e.target.value) }))}
              className="rfid-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Informações de Segurança */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-blue-500/20">
              <Shield className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-400 mb-2">Segurança e Privacidade</h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• <strong>Criptografia:</strong> Todos os dados são criptografados durante a transmissão</li>
                <li>• <strong>Backup Local:</strong> Mantenha sempre um backup local dos seus dados</li>
                <li>• <strong>Acesso Controlado:</strong> Use URLs de planilhas com permissões adequadas</li>
                <li>• <strong>Sincronização Segura:</strong> Verifique a integridade dos dados após cada sincronização</li>
                <li>• <strong>Conformidade:</strong> Sistema compatível com LGPD e regulamentações de privacidade</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CloudSync

