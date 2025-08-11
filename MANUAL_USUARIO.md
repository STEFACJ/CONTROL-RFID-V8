# Manual do Usuário - Sistema de Controle de Funcionários RFID

## 🎯 Introdução

Este manual fornece instruções detalhadas para usar o Sistema de Controle de Funcionários com tecnologia RFID. O sistema foi desenvolvido para facilitar o monitoramento e controle dos horários de intervalo dos colaboradores de forma eficiente e automatizada.

## 🖥️ Interface Principal

### Navegação por Abas

O sistema possui 6 abas principais:

1. **🏷️ Leitura RFID** - Registrar leituras de crachás
2. **📋 Histórico** - Visualizar todas as leituras
3. **⚙️ Tratamento** - Analisar dados processados
4. **👥 Cadastro** - Gerenciar funcionários
5. **📊 Painel** - Visualizar estatísticas e gráficos
6. **☁️ Nuvem** - Sincronizar dados e backups

### Indicadores de Status

- **🟢 Online**: Sistema conectado e funcionando
- **🔴 Offline**: Problemas de conexão detectados
- **🕐 Horário**: Exibição em tempo real

## 📖 Guia Passo a Passo

### 1. Configuração Inicial

#### 1.1 Cadastrar Funcionários

1. Clique na aba **"Cadastro"**
2. Clique no botão **"Novo Funcionário"**
3. Preencha os campos obrigatórios:
   - **Nome Completo**: Nome do funcionário
   - **RE**: Registro de Empregado (apenas números)
   - **Código RFID**: Código do crachá (pode ser escaneado)
4. Clique em **"Cadastrar"**

> ⚠️ **Importante**: Não é possível cadastrar RE ou RFID duplicados

#### 1.2 Configurar Sincronização (Opcional)

1. Acesse a aba **"Nuvem"**
2. Insira a URL da planilha Google Sheets
3. Clique em **"Conectar"**
4. Configure sincronização automática se desejado

### 2. Operação Diária

#### 2.1 Registrar Leituras RFID

1. Acesse a aba **"Leitura RFID"**
2. **Método 1 - Automático**:
   - Aproxime o crachá do leitor
   - O código será capturado automaticamente
3. **Método 2 - Manual**:
   - Digite o código RFID no campo
   - Pressione Enter ou clique em "Registrar Leitura"

**Resultado**: A leitura aparecerá em "Leituras Recentes" com confirmação verde.

#### 2.2 Monitorar Histórico

1. Acesse a aba **"Histórico"**
2. Use os filtros disponíveis:
   - **Busca por RFID**: Digite o código para filtrar
   - **Filtro por data**: Selecione uma data específica
3. Visualize estatísticas:
   - Total de leituras
   - Leituras filtradas
   - Dias com registros

**Ações disponíveis**:
- **Atualizar**: Recarregar dados
- **Exportar CSV**: Baixar relatório
- **Limpar**: Apagar todo o histórico

#### 2.3 Analisar Dados Tratados

1. Acesse a aba **"Tratamento"**
2. Clique em **"Reprocessar"** para atualizar
3. Analise as observações automáticas:
   - **🟡 Apenas 1 leitura**: Funcionário pode ter esquecido de registrar saída
   - **🔴 Intervalo < 25 min**: Possível erro de leitura
   - **🟡 Intervalo > 40 min**: Intervalo mais longo que o padrão
   - **🟢 Intervalo normal**: Entre 25-40 minutos

#### 2.4 Visualizar Painel de Controle

1. Acesse a aba **"Painel"**
2. Monitore as estatísticas principais:
   - Total de intervalos
   - Intervalos longos (>40 min)
   - Média de intervalo
3. Analise os gráficos:
   - **Estatísticas dos últimos 7 dias**
   - **Distribuição de intervalos**

**Exportações disponíveis**:
- **Excel**: Relatório em formato CSV
- **JSON**: Dados completos do dashboard

## 🔧 Funcionalidades Avançadas

### Sincronização com Google Sheets

#### Configurar Conexão

1. Crie uma planilha no Google Sheets
2. Copie a URL da planilha
3. No sistema, vá para aba **"Nuvem"**
4. Cole a URL no campo correspondente
5. Clique em **"Conectar"**

#### Enviar Dados

- Clique em **"Enviar para Nuvem"** para upload
- Aguarde a confirmação de sucesso

#### Baixar Dados

- Clique em **"Baixar da Nuvem"** para sincronizar
- Dados serão mesclados com os locais

### Backup e Restauração

#### Exportar Backup

1. Na aba **"Nuvem"**, seção "Backup Local"
2. Clique em **"Exportar Backup"**
3. Arquivo JSON será baixado automaticamente

#### Importar Backup

1. Clique em **"Importar Backup"**
2. Selecione o arquivo JSON de backup
3. Confirme a importação
4. Sistema será recarregado com os dados

## 📊 Interpretação de Dados

### Códigos de Status

- **✅ Sucesso**: Leitura registrada corretamente
- **❌ Erro**: Problema na leitura
- **⚠️ Aviso**: Situação que requer atenção

### Tipos de Observação

1. **Apenas 1 leitura no dia**
   - **Causa**: Funcionário registrou apenas entrada ou saída
   - **Ação**: Verificar se esqueceu de registrar

2. **Intervalo muito curto (< 25 min)**
   - **Causa**: Possível erro de leitura ou intervalo inadequado
   - **Ação**: Verificar com o funcionário

3. **Intervalo longo (> 40 min)**
   - **Causa**: Intervalo mais longo que o padrão
   - **Ação**: Monitorar se está dentro da política da empresa

4. **Intervalo normal (25-40 min)**
   - **Causa**: Intervalo dentro do padrão esperado
   - **Ação**: Nenhuma ação necessária

## 🚨 Solução de Problemas

### Problemas Comuns

#### Leitura não funciona

**Sintomas**: Código não é capturado ou registrado

**Soluções**:
1. Verifique se o crachá está funcionando
2. Limpe o leitor RFID
3. Tente entrada manual
4. Verifique conexão com o sistema

#### Funcionário não aparece no tratamento

**Sintomas**: Leitura registrada mas não aparece nos dados tratados

**Soluções**:
1. Verifique se o funcionário está cadastrado
2. Confirme se o código RFID está correto
3. Clique em "Reprocessar" na aba Tratamento

#### Sincronização falha

**Sintomas**: Erro ao conectar ou sincronizar com Google Sheets

**Soluções**:
1. Verifique a URL da planilha
2. Confirme permissões de acesso
3. Teste conexão com internet
4. Tente reconectar

#### Dados perdidos

**Sintomas**: Histórico ou cadastros desapareceram

**Soluções**:
1. Verifique se há backup disponível
2. Importe backup mais recente
3. Verifique sincronização com nuvem
4. Contate suporte técnico

### Mensagens de Erro

| Erro | Significado | Solução |
|------|-------------|---------|
| "Código RFID já cadastrado" | RFID duplicado | Use código diferente |
| "RE já cadastrado" | Registro duplicado | Verifique dados do funcionário |
| "Conexão falhou" | Problema de rede | Verifique internet |
| "Arquivo inválido" | Backup corrompido | Use backup válido |

## 📋 Boas Práticas

### Uso Diário

1. **Mantenha cadastro atualizado**: Sempre cadastre novos funcionários
2. **Monitore regularmente**: Verifique painel de controle diariamente
3. **Faça backups**: Exporte backup semanalmente
4. **Analise padrões**: Use aba de tratamento para identificar problemas

### Manutenção

1. **Limpeza de dados**: Remova registros antigos periodicamente
2. **Atualização de cadastros**: Mantenha dados de funcionários atualizados
3. **Verificação de hardware**: Teste leitores RFID regularmente
4. **Backup de segurança**: Mantenha múltiplas cópias de backup

### Segurança

1. **Acesso controlado**: Limite quem pode acessar o sistema
2. **Dados sensíveis**: Proteja informações pessoais dos funcionários
3. **Backup seguro**: Armazene backups em local seguro
4. **Auditoria**: Monitore uso do sistema regularmente

## 📞 Suporte e Contato

### Quando Solicitar Suporte

- Problemas técnicos persistentes
- Dúvidas sobre funcionalidades
- Necessidade de customizações
- Treinamento adicional

### Informações para Suporte

Ao entrar em contato, forneça:

1. **Descrição do problema**: Detalhe o que está acontecendo
2. **Passos para reproduzir**: Como o problema ocorre
3. **Mensagens de erro**: Copie textos de erro exatos
4. **Navegador usado**: Chrome, Firefox, Safari, etc.
5. **Sistema operacional**: Windows, Mac, Linux

### Canais de Suporte

- **Email**: suporte@sistema-rfid.com
- **Telefone**: (11) 9999-9999
- **Chat online**: Disponível no sistema
- **Documentação**: Manual sempre atualizado

## 📚 Recursos Adicionais

### Vídeos Tutoriais

- Configuração inicial do sistema
- Como cadastrar funcionários
- Usando o painel de controle
- Configurando sincronização

### FAQ - Perguntas Frequentes

**P: Posso usar o sistema offline?**
R: Sim, o sistema funciona offline. Dados são salvos localmente e sincronizados quando conectar.

**P: Quantos funcionários posso cadastrar?**
R: Não há limite técnico. O sistema suporta milhares de funcionários.

**P: Os dados são seguros?**
R: Sim, dados são criptografados e seguem padrões de segurança.

**P: Posso personalizar os intervalos?**
R: Atualmente os intervalos são fixos, mas customização está no roadmap.

---

**Sistema de Controle de Funcionários RFID v1.0**
*Manual do Usuário - Versão 1.0 - Janeiro 2025*

