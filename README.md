# Sistema de Controle de Funcionários - RFID

## 📋 Descrição

Sistema web profissional para controle e monitoramento de horários de intervalo dos colaboradores através da leitura de crachás RFID. Desenvolvido com interface elegante em cores preto e vermelho, oferece funcionalidades completas de gestão, análise e relatórios.

## ✨ Características Principais

- **Interface Moderna**: Design elegante com tema preto e vermelho
- **Leitura RFID**: Captura em tempo real de códigos RFID
- **Gestão Completa**: Cadastro de funcionários e histórico de leituras
- **Análise Inteligente**: Tratamento automático de dados com identificação de padrões
- **Painel de Controle**: Gráficos e estatísticas em tempo real
- **Sincronização em Nuvem**: Integração com Google Sheets e backup automático
- **Responsivo**: Compatível com desktop e dispositivos móveis

## 🚀 Funcionalidades

### 1. Leitura RFID
- Interface para captura de códigos RFID
- Registro automático de data e hora
- Exibição em tempo real das leituras
- Histórico de leituras recentes
- Suporte a entrada manual e automática

### 2. Histórico de Leituras
- Visualização completa de todas as leituras
- Filtros por código RFID e data
- Estatísticas de uso
- Exportação para CSV
- Agrupamento por data

### 3. Tratamento de Dados
- Identificação automática do primeiro e último registro do dia
- Detecção de funcionários com apenas 1 leitura
- Alertas para intervalos menores que 25 minutos
- Observações automáticas para intervalos longos
- Cruzamento com dados de cadastro

### 4. Cadastro de Funcionários
- Formulário completo com nome, RE e código RFID
- Validação de dados e prevenção de duplicatas
- Busca e filtros
- Edição e exclusão de registros
- Integração com sistema de leituras

### 5. Painel de Controle
- Funcionários com intervalo superior a 40 minutos
- Gráficos de performance por período
- Estatísticas em tempo real
- Distribuição de intervalos
- Exportação de relatórios

### 6. Sincronização em Nuvem
- Integração com Google Sheets
- Backup automático de dados
- Sincronização bidirecional
- Exportação/importação de backups
- Configurações avançadas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Armazenamento**: LocalStorage (com backup em nuvem)
- **Animações**: Framer Motion

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Passos para instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd controle-funcionarios
```

2. **Instale as dependências**
```bash
npm install
# ou
pnpm install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
pnpm run dev
```

4. **Acesse a aplicação**
```
http://localhost:5173
```

### Build para produção

```bash
npm run build
# ou
pnpm run build
```

## 📱 Como Usar

### Configuração Inicial

1. **Cadastre os funcionários**
   - Acesse a aba "Cadastro"
   - Clique em "Novo Funcionário"
   - Preencha nome, RE e código RFID
   - Salve o cadastro

2. **Configure a sincronização (opcional)**
   - Acesse a aba "Nuvem"
   - Insira a URL da planilha Google Sheets
   - Configure sincronização automática

### Operação Diária

1. **Registrar leituras**
   - Na aba "Leitura RFID"
   - Aproxime o crachá ou digite o código
   - Pressione Enter ou clique em "Registrar Leitura"

2. **Monitorar dados**
   - Aba "Histórico": visualizar todas as leituras
   - Aba "Tratamento": analisar padrões e observações
   - Aba "Painel": acompanhar estatísticas e gráficos

3. **Gerar relatórios**
   - Use os botões de exportação em cada aba
   - Formatos disponíveis: CSV, JSON, Excel

## 🔧 Configurações

### Parâmetros do Sistema

- **Intervalo mínimo**: 25 minutos (configurável)
- **Intervalo máximo padrão**: 40 minutos
- **Sincronização automática**: Configurável por intervalo
- **Backup automático**: Ativado por padrão

### Observações Automáticas

- ⚠️ **Apenas 1 leitura**: Funcionário pode ter esquecido de registrar saída
- ❌ **Intervalo < 25 min**: Possível erro de leitura
- ⚠️ **Intervalo > 40 min**: Intervalo mais longo que o padrão
- ✅ **Intervalo normal**: Entre 25-40 minutos

## 🔒 Segurança e Privacidade

- **Dados Locais**: Armazenamento seguro no navegador
- **Backup Criptografado**: Proteção durante transmissão
- **Conformidade LGPD**: Respeita regulamentações de privacidade
- **Acesso Controlado**: Permissões adequadas para planilhas

## 📊 Estrutura de Dados

### Leitura RFID
```json
{
  "id": "timestamp",
  "rfidCode": "RFID123456",
  "timestamp": "2025-01-01T10:30:00.000Z",
  "status": "success"
}
```

### Funcionário
```json
{
  "id": "unique_id",
  "name": "João Silva Santos",
  "re": "12345",
  "rfidCode": "RFID123456",
  "createdAt": "2025-01-01T08:00:00.000Z",
  "updatedAt": "2025-01-01T08:00:00.000Z"
}
```

## 🚨 Solução de Problemas

### Problemas Comuns

1. **Leitura não registrada**
   - Verifique se o código RFID está correto
   - Confirme se há conexão com o sistema
   - Tente registrar manualmente

2. **Funcionário não encontrado**
   - Verifique se o funcionário está cadastrado
   - Confirme se o código RFID está correto
   - Atualize o cadastro se necessário

3. **Sincronização falhou**
   - Verifique a URL da planilha
   - Confirme as permissões de acesso
   - Teste a conexão com a internet

### Logs e Depuração

- Abra o console do navegador (F12)
- Verifique mensagens de erro
- Analise o localStorage para dados salvos

## 📈 Roadmap

### Próximas Funcionalidades

- [ ] Integração com APIs de RH
- [ ] Notificações push
- [ ] Relatórios avançados
- [ ] Dashboard executivo
- [ ] App mobile nativo
- [ ] Integração com sistemas de ponto

### Melhorias Planejadas

- [ ] Performance otimizada
- [ ] Mais opções de exportação
- [ ] Temas personalizáveis
- [ ] Multi-idioma
- [ ] Auditoria completa

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:

- **Email**: suporte@sistema-rfid.com
- **Documentação**: [docs.sistema-rfid.com](https://docs.sistema-rfid.com)
- **Issues**: Use o sistema de issues do GitHub

## 🏆 Créditos

Desenvolvido com ❤️ pela equipe de desenvolvimento.

**Tecnologias e bibliotecas utilizadas:**
- React Team
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Recharts
- Vite

---

**Sistema de Controle de Funcionários v1.0** - Todos os direitos reservados © 2025

