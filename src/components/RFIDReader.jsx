import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  CreditCard, 
  Scan, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Calendar
} from 'lucide-react'

const RFIDReader = () => {
  const [rfidCode, setRfidCode] = useState('')
  const [isReading, setIsReading] = useState(false)
  const [lastReading, setLastReading] = useState(null)
  const [recentReadings, setRecentReadings] = useState([])
  const inputRef = useRef(null)

  // Simular leitura automática de RFID
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Simular leitura quando Enter é pressionado
      if (event.key === 'Enter' && rfidCode.trim()) {
        handleRFIDRead()
      }
    }

    document.addEventListener('keypress', handleKeyPress)
    return () => document.removeEventListener('keypress', handleKeyPress)
  }, [rfidCode])

  // Focar no input automaticamente
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleRFIDRead = () => {
    if (!rfidCode.trim()) return

    setIsReading(true)
    
    // Simular tempo de processamento
    setTimeout(() => {
      const newReading = {
        id: Date.now(),
        rfidCode: rfidCode.trim(),
        timestamp: new Date(),
        status: 'success'
      }

      setLastReading(newReading)
      setRecentReadings(prev => [newReading, ...prev.slice(0, 4)])
      setRfidCode('')
      setIsReading(false)

      // Salvar no localStorage (simulando banco de dados)
      const existingData = JSON.parse(localStorage.getItem('rfidReadings') || '[]')
      existingData.push(newReading)
      localStorage.setItem('rfidReadings', JSON.stringify(existingData))

      // Focar novamente no input
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 1000)
  }

  const handleManualInput = (value) => {
    setRfidCode(value.toUpperCase())
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Título da Seção */}
      <div className="flex items-center space-x-3">
        <CreditCard className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Leitura de Crachás RFID</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel de Leitura */}
        <Card className="rfid-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Scan className="h-5 w-5 text-primary" />
              <span>Leitor RFID</span>
              <Badge variant={isReading ? "destructive" : "secondary"}>
                {isReading ? "Processando..." : "Pronto"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Código RFID
              </label>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Aproxime o crachá ou digite o código..."
                value={rfidCode}
                onChange={(e) => handleManualInput(e.target.value)}
                className="rfid-input text-lg font-mono"
                disabled={isReading}
              />
            </div>

            <Button
              onClick={handleRFIDRead}
              disabled={!rfidCode.trim() || isReading}
              className="w-full rfid-button"
            >
              {isReading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Registrar Leitura
                </>
              )}
            </Button>

            {/* Status da última leitura */}
            {lastReading && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Leitura realizada com sucesso!</span>
                </div>
                <div className="mt-2 text-sm text-green-300">
                  <p>Código: <span className="font-mono">{lastReading.rfidCode}</span></p>
                  <p>Horário: {formatTime(lastReading.timestamp)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leituras Recentes */}
        <Card className="rfid-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Leituras Recentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentReadings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma leitura realizada ainda</p>
                <p className="text-sm">As leituras aparecerão aqui em tempo real</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReadings.map((reading) => (
                  <div
                    key={reading.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50"
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
                          {formatDate(reading.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatTime(reading.timestamp)}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Sucesso
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instruções */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-blue-500/20">
              <CreditCard className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-400 mb-2">Como usar o leitor RFID</h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Aproxime o crachá do leitor ou digite o código manualmente</li>
                <li>• Pressione Enter ou clique em "Registrar Leitura"</li>
                <li>• O sistema registrará automaticamente a data e hora</li>
                <li>• As leituras são salvas em tempo real no histórico</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RFIDReader

