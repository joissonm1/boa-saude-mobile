# 🏥 Boa Saúde Mobile

Uma aplicação de saúde digital moderna e completa desenvolvida para o mercado angolano, oferecendo acesso facilitado a serviços médicos, gestão de receitas, carteira digital e muito mais.

## 📱 Sobre o Projeto

Boa Saúde é uma plataforma mobile de telemedicina e gestão de saúde que conecta pacientes a profissionais de saúde em Angola. A aplicação oferece uma experiência completa de cuidados de saúde digital, desde o agendamento de consultas até a dispensação de medicamentos.

## ✨ Funcionalidades Principais

### 🎯 Agendamento de Consultas
- **Consultas Online**: Videochamadas com médicos especializados
- **Consultas Presenciais**: Visualização de hospitais e clínicas próximas com informações de contato
- Seleção de especialidades médicas
- Escolha de horários disponíveis
- Sistema de pagamento integrado

### 💊 Gestão de Receitas Médicas
- Visualização de receitas digitais
- Histórico completo de prescrições
- Filtros por status (Todas, Pendentes, Dispensadas, Parciais, Vencidas)
- Download de receitas em PDF
- QR Code para dispensação em farmácias
- Fluxo completo de dispensação de medicamentos

### 💰 Carteira Digital
- Saldo em Kwanza (Kz)
- Recarga via:
  - Referência Bancária
  - Cartão de Crédito
- Histórico detalhado de transações
- Pagamentos instantâneos dentro da plataforma

### 🏥 Localização de Serviços
- **Clínicas e Hospitais**: Mapa interativo com localização de unidades de saúde
- **Farmácias**: Localização de farmácias próximas
- Informações de contato (telefone)
- Direções via GPS
- Filtros por especialidade e serviços

### 👤 Perfil do Usuário
- Dados pessoais completos
- Informações de saúde (tipo sanguíneo, alergias, condições médicas)
- Dados de emergência
- Preferências de notificação
- Documentação (número de utente)

### 💬 Chatbot de Atendimento
- Assistência automatizada 24/7
- Respostas a perguntas frequentes
- Suporte para agendamento e consultas

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 15.5.11 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS com OKLCH color space
- **UI Components**: Componentes personalizados baseados em shadcn/ui
- **Ícones**: Lucide React
- **Mapas**: Leaflet com OpenStreetMap
- **Build**: SWC compiler

## 🎨 Design

- Interface moderna e profissional
- Dark mode completo com cores vibrantes e alto contraste
- Tema dinâmico com suporte a diferentes matizes
- Componentes responsivos otimizados para mobile
- Animações fluidas e transições suaves
- Design system consistente em toda a aplicação

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/joissonm1/boa-saude-mobile.git

# Entre no diretório
cd boa-saude-mobile

# Instale as dependências
npm install
```

### Executar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm start
```

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes principais da aplicação
│   │   ├── wallet/         # Componentes da carteira
│   │   ├── prescription/   # Componentes de receitas
│   │   ├── booking/        # Componentes de agendamento
│   │   └── common/         # Componentes compartilhados
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página inicial
│   └── App.tsx             # Componente principal da aplicação
├── components/             # Componentes reutilizáveis
├── lib/
│   ├── mock-data.ts       # Dados de demonstração
│   └── utils.ts           # Funções utilitárias
├── hooks/                  # React hooks personalizados
├── services/               # Serviços de API
├── types/                  # Definições TypeScript
└── styles/                 # Estilos globais e temas

```

## 💳 Sistema de Pagamento

A aplicação suporta múltiplos métodos de pagamento adaptados ao mercado angolano:

- **Carteira Digital**: Pagamentos instantâneos usando saldo da carteira
- **Referência Bancária**: Pagamento via banco com código de referência único
- **Cartão de Crédito**: Visa, Mastercard, Elo

Todas as transações são registradas com histórico completo e status em tempo real.

## 🌍 Localização

- Moeda: Kwanza Angolano (Kz)
- Idioma: Português (Angola)
- Fuso horário: WAT (West Africa Time)
- Métodos de pagamento locais

## 📝 Status do Projeto

✅ MVP Completo e Funcional
- Todas as funcionalidades principais implementadas
- Interface profissional sem emojis
- Sistema de tipos TypeScript completo
- Build otimizado para produção
- Pronto para deploy

## 🔒 Segurança

- Autenticação via token
- Dados sensíveis armazenados localmente de forma segura
- Validação de inputs em todos os formulários
- Comunicação segura com APIs

## 📱 Funcionalidades Mobile-First

- Layout otimizado para dispositivos móveis
- Touch-friendly com áreas de toque adequadas
- Scroll suave e natural
- Carregamento progressivo de conteúdo
- Suporte offline para dados em cache

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request para sugestões e melhorias.

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Equipe

Desenvolvido para revolucionar o acesso à saúde em Angola.

---

**Boa Saúde** - Cuidando da sua saúde 💙
