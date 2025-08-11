# ⚙️ Configuração Avançada - Sistema RFID

## 🎨 Personalização Visual

### Alterando Cores do Tema

Para modificar as cores preto/vermelho padrão:

1. **Edite o arquivo**: `src/App.css`
2. **Localize as variáveis CSS**:
   ```css
   :root {
     --primary: #dc2626;        /* Vermelho principal */
     --background: #0a0a0a;     /* Preto de fundo */
     --card: #1a1a1a;          /* Cinza escuro dos cards */
   }
   ```
3. **Substitua pelos códigos de cor desejados**
4. **Execute**: `npm run build`

### Personalizando Logo

1. **Substitua o ícone** no arquivo `src/App.jsx`
2. **Localize**: `<CreditCard className="h-8 w-8 text-primary" />`
3. **Troque por outro ícone** da biblioteca Lucide

## 🔧 Configurações de Sistema

### Intervalos de Tempo

Para alterar os limites de intervalo:

1. **Edite**: `src/components/DataProcessing.jsx`
2. **Localize as constantes**:
   ```javascript
   const MIN_INTERVAL = 25; // minutos
   const MAX_INTERVAL = 40; // minutos
   ```
3. **Altere os valores conforme necessário**

### Formato de Data/Hora

Para alterar formato brasileiro:

1. **Edite**: `src/components/` (vários arquivos)
2. **Localize**: `.toLocaleString('pt-BR')`
3. **Substitua por**: `.toLocaleString('en-US')` ou outro

## 🗄️ Configuração de Dados

### Estrutura do Banco Local

O sistema usa localStorage com estas chaves:

```javascript
// Leituras RFID
localStorage.getItem('rfidReadings')

// Funcionários cadastrados  
localStorage.getItem('employees')

// Configurações de sincronização
localStorage.getItem('syncConfig')
```

### Migração de Dados

Para migrar dados entre sistemas:

1. **Exporte backup** do sistema antigo
2. **Importe no novo sistema** via aba "Nuvem"
3. **Verifique integridade** dos dados

### Limpeza de Dados Antigos

Para remover dados antigos automaticamente:

1. **Edite**: `src/components/HistoryTab.jsx`
2. **Adicione função de limpeza automática**:
   ```javascript
   const cleanOldData = () => {
     const cutoffDate = new Date();
     cutoffDate.setDays(cutoffDate.getDate() - 90); // 90 dias
     // Implementar lógica de limpeza
   }
   ```

## 🌐 Integração com APIs

### Google Sheets API

Para integração real (não simulada):

1. **Obtenha credenciais** do Google Cloud Console
2. **Configure API Key** no arquivo de configuração
3. **Implemente autenticação OAuth2**

### APIs de RH

Para integrar com sistemas de RH:

1. **Crie endpoint** em `src/services/api.js`
2. **Configure autenticação** necessária
3. **Mapeie campos** entre sistemas

### Webhooks

Para notificações automáticas:

1. **Configure endpoint** de webhook
2. **Implemente envio** em eventos específicos
3. **Trate respostas** e erros

## 🔐 Configurações de Segurança

### Autenticação

Para adicionar login:

1. **Crie componente** de login
2. **Implemente verificação** de credenciais
3. **Proteja rotas** sensíveis

### Criptografia de Dados

Para criptografar dados locais:

1. **Instale biblioteca**: `npm install crypto-js`
2. **Implemente criptografia** no localStorage
3. **Configure chave** de criptografia

### Auditoria

Para log de ações:

1. **Crie sistema** de auditoria
2. **Registre ações** importantes
3. **Exporte logs** periodicamente

## 📊 Configuração de Relatórios

### Relatórios Personalizados

Para criar novos relatórios:

1. **Edite**: `src/components/ControlPanel.jsx`
2. **Adicione novos gráficos**:
   ```javascript
   import { LineChart, PieChart } from 'recharts'
   ```
3. **Configure dados** e visualização

### Exportação Avançada

Para formatos adicionais:

1. **Instale bibliotecas**:
   ```bash
   npm install xlsx jspdf
   ```
2. **Implemente exportadores** personalizados
3. **Adicione botões** na interface

### Agendamento de Relatórios

Para relatórios automáticos:

1. **Configure service worker**
2. **Implemente agendamento** local
3. **Envie relatórios** por email

## 🔌 Hardware RFID

### Configuração de Leitores

Para diferentes modelos de leitor:

1. **Identifique protocolo** do leitor
2. **Configure driver** apropriado
3. **Teste comunicação** serial/USB

### Leitores Suportados

- **USB HID**: Funciona como teclado
- **Serial**: Comunicação via porta serial
- **TCP/IP**: Leitores em rede
- **Bluetooth**: Leitores móveis

### Troubleshooting Hardware

Problemas comuns:

1. **Driver não instalado**: Instale driver do fabricante
2. **Porta ocupada**: Feche outros programas
3. **Configuração incorreta**: Verifique baudrate/paridade

## 🚀 Performance

### Otimização de Dados

Para grandes volumes:

1. **Implemente paginação** nas listas
2. **Use lazy loading** para componentes
3. **Configure cache** inteligente

### Otimização de Build

Para reduzir tamanho:

1. **Configure tree shaking**:
   ```javascript
   // vite.config.js
   export default {
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom']
           }
         }
       }
     }
   }
   ```

### Monitoramento

Para acompanhar performance:

1. **Use React DevTools**
2. **Monitore bundle size**
3. **Analise Core Web Vitals**

## 🌍 Internacionalização

### Múltiplos Idiomas

Para suporte a outros idiomas:

1. **Instale**: `npm install react-i18next`
2. **Configure arquivos** de tradução
3. **Implemente seletor** de idioma

### Formatos Regionais

Para diferentes regiões:

1. **Configure Intl.DateTimeFormat**
2. **Ajuste formatos** de número
3. **Adapte validações** de entrada

## 📱 PWA (Progressive Web App)

### Configuração Offline

Para funcionar offline:

1. **Configure service worker**
2. **Implemente cache** de recursos
3. **Sincronize dados** quando online

### Instalação Mobile

Para instalar como app:

1. **Configure manifest.json**
2. **Adicione ícones** apropriados
3. **Teste instalação** em dispositivos

## 🔄 Backup Automático

### Configuração de Backup

Para backup automático:

1. **Configure intervalo** de backup
2. **Implemente upload** para nuvem
3. **Monitore falhas** de backup

### Restauração Automática

Para recuperação de dados:

1. **Detecte perda** de dados
2. **Ofereça restauração** automática
3. **Valide integridade** dos dados

---

**Sistema de Controle de Funcionários RFID v1.0**
*Configuração Avançada - Janeiro 2025*

Para implementar essas configurações, conhecimento técnico em React/JavaScript é recomendado.

