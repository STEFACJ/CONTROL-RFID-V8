import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import {
  CreditCard,
  History,
  Settings,
  Users,
  BarChart3,
  Wifi,
  WifiOff,
  Clock,
  AlertTriangle,
  Cloud,
  LogOut
} from 'lucide-react'
import './App.css'

// Componentes das abas
import RFIDReader from './components/RFIDReader'
import HistoryTab from './components/HistoryTab'
import DataProcessing from './components/DataProcessing'
import EmployeeRegistry from './components/EmployeeRegistry'
import ControlPanel from './components/ControlPanel'
import CloudSync from './components/CloudSync'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [activeTab, setActiveTab] = useState('rfid')
  const [isOnline, setIsOnline] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Inicializa o usuário admin se não existir
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (!users.find(u => u.username === 'admin')) {
      users.push({ username: 'admin', password: 'DEFCON4', role: 'admin' });
      localStorage.setItem('users', JSON.stringify(users));
    }

    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    } else {
      // Se não houver usuário logado, redireciona para a tela de login
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const connectionCheck = setInterval(() => {
      setIsOnline(Math.random() > 0.1)
    }, 5000)
    return () => clearInterval(connectionCheck)
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user)); // Salva o usuário logado no localStorage
    navigate('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    navigate('/login')
  }

  const tabs = [
    {
      id: 'rfid',
      label: 'Leitura RFID',
      icon: CreditCard,
      component: RFIDReader
    },
    {
      id: 'history',
      label: 'Histórico',
      icon: History,
      component: HistoryTab
    },
    {
      id: 'processing',
      label: 'Tratamento',
      icon: Settings,
      component: DataProcessing
    },
    {
      id: 'registry',
      label: 'Cadastro',
      icon: Users,
      component: EmployeeRegistry
    },
    {
      id: 'control',
      label: 'Painel',
      icon: BarChart3,
      component: ControlPanel
    },
    {
      id: 'cloud',
      label: 'Nuvem',
      icon: Cloud,
      component: CloudSync
    }
  ]

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <div className="min-h-screen rfid-container">
              {/* Header */}
              <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold text-foreground">
                          Controle de Funcionários
                        </h1>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Sistema RFID v1.0
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Status de Conexão */}
                      <div className="flex items-center space-x-2">
                        {isOnline ? (
                          <>
                            <div className="status-indicator status-online"></div>
                            <Wifi className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-500">Online</span>
                          </>
                        ) : (
                          <>
                            <div className="status-indicator status-offline"></div>
                            <WifiOff className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">Offline</span>
                          </>
                        )}
                      </div>
                      
                      {/* Horário Atual */}
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{currentTime.toLocaleString('pt-BR')}</span>
                      </div>
                      <Button variant="ghost" onClick={handleLogout} className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </header>

              {/* Navigation Tabs */}
              <nav className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                  <div className="flex space-x-1 py-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      const isActive = activeTab === tab.id
                      
                      return (
                        <Button
                          key={tab.id}
                          variant="ghost"
                          className={`
                            flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
                            ${isActive 
                              ? 'tab-active' 
                              : 'tab-inactive hover:tab-inactive'
                            }
                          `}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{tab.label}</span>
                        </Button>
                      )
                    })}
                    {currentUser && currentUser.role === 'admin' && (
                      <Button
                        variant="ghost"
                        className={`
                          flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
                          ${activeTab === 'admin' 
                            ? 'tab-active' 
                            : 'tab-inactive hover:tab-inactive'
                          }
                        `}
                        onClick={() => setActiveTab('admin')}
                      >
                        <Users className="h-4 w-4" />
                        <span className="font-medium">Admin</span>
                      </Button>
                    )}
                  </div>
                </div>
              </nav>

              {/* Main Content */}
              <main className="container mx-auto px-6 py-8">
                {!isOnline && (
                  <div className="mb-6">
                    <Card className="border-yellow-500/50 bg-yellow-500/10">
                      <CardContent className="flex items-center space-x-3 p-4">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-yellow-500 font-medium">
                            Conexão instável detectada
                          </p>
                          <p className="text-yellow-500/80 text-sm">
                            Alguns recursos podem estar limitados. Verificando conexão...
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Renderizar componente ativo */}
                <div className="animate-in fade-in-50 duration-300">
                  {activeTab === 'admin' && currentUser?.role === 'admin' ? (
                    <AdminDashboard />
                  ) : (
                    <Routes>
                      {tabs.map(tab => (
                        <Route key={tab.id} path={tab.id === 'rfid' ? '/' : `/${tab.id}`} element={<tab.component />} />
                      ))}
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                  )}
                </div>
              </main>

              {/* Footer */}
              <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-12">
                <div className="container mx-auto px-6 py-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>© 2025 Sistema de Controle de Funcionários. Todos os direitos reservados.</p>
                    <p>Desenvolvido com tecnologia RFID</p>
                  </div>
                </div>
              </footer>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App


