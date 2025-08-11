# 🚀 Guia de Instalação - Sistema de Controle de Funcionários RFID

## 📋 Pré-requisitos

Antes de instalar o sistema, certifique-se de ter:

- **Node.js 18+** instalado ([Download aqui](https://nodejs.org/))
- **npm** (vem com Node.js) ou **pnpm** 
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para instalação inicial)

## 📦 Conteúdo do Pacote

```
sistema-controle-funcionarios-completo/
├── src/                          # Código fonte da aplicação
├── public/                       # Arquivos públicos
├── dist/                         # Versão compilada (pronta para produção)
├── node_modules/                 # Dependências (se incluídas)
├── package.json                  # Configurações do projeto
├── README.md                     # Documentação técnica
├── MANUAL_USUARIO.md            # Manual do usuário
├── INSTALACAO.md                # Este arquivo
└── vite.config.js               # Configurações do build
```

## 🛠️ Instalação Passo a Passo

### Opção 1: Execução Rápida (Recomendada)

Se a pasta `dist/` estiver incluída, você pode executar diretamente:

1. **Abra o terminal/prompt** na pasta do sistema
2. **Execute o servidor local**:
   ```bash
   npx serve dist
   ```
3. **Acesse no navegador**: `http://localhost:3000`

### Opção 2: Instalação Completa

Para desenvolvimento ou customização:

1. **Abra o terminal/prompt** na pasta do sistema

2. **Instale as dependências**:
   ```bash
   npm install
   ```
   *Aguarde a instalação (pode demorar alguns minutos)*

3. **Execute em modo desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**: `http://localhost:5173`

### Opção 3: Build para Produção

Para criar uma versão otimizada:

1. **Instale as dependências** (se não fez ainda):
   ```bash
   npm install
   ```

2. **Gere o build de produção**:
   ```bash
   npm run build
   ```

3. **Execute a versão de produção**:
   ```bash
   npx serve dist
   ```

## 🌐 Hospedagem Online

### Hospedagem Gratuita

**Netlify** (Recomendado):
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta `dist/` para o site
3. Seu sistema estará online em minutos

**Vercel**:
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório ou faça upload da pasta
3. Deploy automático

**GitHub Pages**:
1. Suba o código para GitHub
2. Ative GitHub Pages nas configurações
3. Use a pasta `dist/` como source

### Hospedagem Própria

**Servidor Web** (Apache/Nginx):
1. Copie o conteúdo da pasta `dist/` para o servidor
2. Configure o servidor para servir arquivos estáticos
3. Acesse via domínio/IP do servidor

## 🔧 Configuração Inicial

### 1. Primeiro Acesso

1. **Abra o sistema** no navegador
2. **Cadastre funcionários** na aba "Cadastro"
3. **Configure sincronização** (opcional) na aba "Nuvem"
4. **Teste leituras RFID** na aba "Leitura RFID"

### 2. Configuração de Backup

1. Acesse a aba **"Nuvem"**
2. Configure URL do Google Sheets (opcional)
3. Faça backup inicial clicando em **"Exportar Backup"**

### 3. Personalização

Para personalizar cores ou textos:
1. Edite arquivos em `src/`
2. Execute `npm run build`
3. Use a nova pasta `dist/`

## 🚨 Solução de Problemas

### Erro: "npm não encontrado"

**Solução**: Instale Node.js do site oficial

### Erro: "Porta em uso"

**Solução**: 
- Feche outros servidores locais
- Use porta diferente: `npx serve dist -p 3001`

### Erro: "Dependências não instaladas"

**Solução**: Execute `npm install` novamente

### Página em branco

**Soluções**:
1. Verifique console do navegador (F12)
2. Certifique-se que está acessando a URL correta
3. Limpe cache do navegador

### Leituras RFID não funcionam

**Soluções**:
1. Verifique se o leitor RFID está conectado
2. Teste entrada manual de códigos
3. Verifique drivers do leitor

## 📱 Acesso Mobile

O sistema é responsivo e funciona em:
- **Smartphones** (iOS/Android)
- **Tablets** 
- **Computadores** (Windows/Mac/Linux)

Para melhor experiência mobile:
1. Acesse via navegador do dispositivo
2. Adicione à tela inicial (PWA)
3. Use em modo retrato ou paisagem

## 🔒 Segurança

### Dados Locais
- Dados ficam no navegador (localStorage)
- Não são enviados para servidores externos
- Backup manual recomendado

### Acesso Restrito
Para restringir acesso:
1. Use servidor com autenticação
2. Configure firewall/VPN
3. Implemente login personalizado

### LGPD/Privacidade
- Sistema não coleta dados pessoais automaticamente
- Dados inseridos ficam sob responsabilidade do usuário
- Recomenda-se política de privacidade interna

## 📞 Suporte

### Documentação
- **README.md**: Documentação técnica completa
- **MANUAL_USUARIO.md**: Guia de uso detalhado

### Problemas Técnicos
1. Verifique documentação incluída
2. Consulte logs do navegador (F12)
3. Teste em navegador diferente

### Customizações
Para modificações no sistema:
1. Edite arquivos em `src/`
2. Conhecimento em React/JavaScript necessário
3. Execute `npm run build` após mudanças

## 🎯 Próximos Passos

Após instalação:

1. ✅ **Teste todas as funcionalidades**
2. ✅ **Cadastre funcionários reais**
3. ✅ **Configure backup/sincronização**
4. ✅ **Treine usuários finais**
5. ✅ **Estabeleça rotina de manutenção**

## 📊 Monitoramento

Para acompanhar uso do sistema:
- Verifique estatísticas no Painel de Controle
- Exporte relatórios regularmente
- Monitore observações automáticas
- Mantenha backups atualizados

---

**Sistema de Controle de Funcionários RFID v1.0**
*Guia de Instalação - Janeiro 2025*

Para suporte adicional, consulte a documentação completa ou entre em contato com a equipe de desenvolvimento.

