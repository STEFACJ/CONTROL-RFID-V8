import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Search,
  User,
  CreditCard,
  Hash,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const EmployeeRegistry = () => {
  const [employees, setEmployees] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    re: '',
    rfidCode: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = () => {
    const data = JSON.parse(localStorage.getItem('employees') || '[]')
    setEmployees(data)
  }

  const saveEmployees = (employeeList) => {
    localStorage.setItem('employees', JSON.stringify(employeeList))
    setEmployees(employeeList)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.re.trim()) {
      newErrors.re = 'RE é obrigatório'
    } else if (!/^\d+$/.test(formData.re.trim())) {
      newErrors.re = 'RE deve conter apenas números'
    }

    if (!formData.rfidCode.trim()) {
      newErrors.rfidCode = 'Código RFID é obrigatório'
    }

    // Verificar duplicatas
    const existingEmployee = employees.find(emp => 
      emp.id !== editingId && (
        emp.re === formData.re.trim() || 
        emp.rfidCode.toUpperCase() === formData.rfidCode.trim().toUpperCase()
      )
    )

    if (existingEmployee) {
      if (existingEmployee.re === formData.re.trim()) {
        newErrors.re = 'RE já cadastrado'
      }
      if (existingEmployee.rfidCode.toUpperCase() === formData.rfidCode.trim().toUpperCase()) {
        newErrors.rfidCode = 'Código RFID já cadastrado'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const employeeData = {
      id: editingId || Date.now(),
      name: formData.name.trim(),
      re: formData.re.trim(),
      rfidCode: formData.rfidCode.trim().toUpperCase(),
      createdAt: editingId ? employees.find(emp => emp.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    let updatedEmployees
    if (editingId) {
      updatedEmployees = employees.map(emp => 
        emp.id === editingId ? employeeData : emp
      )
    } else {
      updatedEmployees = [...employees, employeeData]
    }

    saveEmployees(updatedEmployees)
    resetForm()
  }

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      re: employee.re,
      rfidCode: employee.rfidCode
    })
    setEditingId(employee.id)
    setIsEditing(true)
    setErrors({})
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      const updatedEmployees = employees.filter(emp => emp.id !== id)
      saveEmployees(updatedEmployees)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', re: '', rfidCode: '' })
    setEditingId(null)
    setIsEditing(false)
    setErrors({})
  }

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.re.includes(searchTerm) ||
    employee.rfidCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Título da Seção */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Cadastro de Funcionários</h2>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="rfid-button"
          disabled={isEditing}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      {/* Formulário de Cadastro/Edição */}
      {isEditing && (
        <Card className="rfid-card border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nome Completo *
                  </label>
                  <Input
                    type="text"
                    placeholder="Digite o nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`rfid-input ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Registro de Empregado (RE) *
                  </label>
                  <Input
                    type="text"
                    placeholder="Digite o RE"
                    value={formData.re}
                    onChange={(e) => setFormData({ ...formData, re: e.target.value })}
                    className={`rfid-input ${errors.re ? 'border-red-500' : ''}`}
                  />
                  {errors.re && (
                    <p className="text-xs text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.re}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Código RFID *
                  </label>
                  <Input
                    type="text"
                    placeholder="Digite ou escaneie o código RFID"
                    value={formData.rfidCode}
                    onChange={(e) => setFormData({ ...formData, rfidCode: e.target.value.toUpperCase() })}
                    className={`rfid-input font-mono ${errors.rfidCode ? 'border-red-500' : ''}`}
                  />
                  {errors.rfidCode && (
                    <p className="text-xs text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.rfidCode}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Button type="submit" className="rfid-button">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Atualizar' : 'Cadastrar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Busca */}
      <Card className="rfid-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome, RE ou código RFID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rfid-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Funcionários</p>
                <p className="text-2xl font-bold text-foreground">{employees.length}</p>
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
                <p className="text-sm text-muted-foreground">Filtrados</p>
                <p className="text-2xl font-bold text-foreground">{filteredEmployees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rfid-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-500/20">
                <CreditCard className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Códigos RFID</p>
                <p className="text-2xl font-bold text-foreground">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Funcionários */}
      <Card className="rfid-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Funcionários Cadastrados</span>
            <Badge variant="secondary">{filteredEmployees.length} funcionários</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>
                {employees.length === 0 
                  ? 'Nenhum funcionário cadastrado'
                  : 'Nenhum funcionário encontrado'
                }
              </p>
              <p className="text-sm">
                {employees.length === 0 
                  ? 'Clique em "Novo Funcionário" para começar'
                  : 'Tente ajustar os termos de busca'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-primary/20">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{employee.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Hash className="h-3 w-3" />
                          <span>RE: {employee.re}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="h-3 w-3" />
                          <span className="font-mono">{employee.rfidCode}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(employee)}
                      disabled={isEditing}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                      className="text-red-400 hover:text-red-300"
                      disabled={isEditing}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-blue-500/20">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-400 mb-2">Informações sobre o cadastro</h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• <strong>Nome:</strong> Nome completo do funcionário</li>
                <li>• <strong>RE:</strong> Registro de Empregado único (apenas números)</li>
                <li>• <strong>Código RFID:</strong> Código único do crachá (pode ser escaneado)</li>
                <li>• Os dados são usados para identificar funcionários nas leituras</li>
                <li>• Não é possível cadastrar RE ou RFID duplicados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmployeeRegistry

