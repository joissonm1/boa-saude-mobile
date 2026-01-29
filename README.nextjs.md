# Boa Saúde Mobile - Next.js

Este projeto foi migrado de Vite para Next.js com TypeScript e React.

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## Estrutura do Projeto

```
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── layout.tsx          # Layout raiz
│   │   └── page.tsx            # Página principal
│   ├── components/             # Componentes React
│   │   ├── Login.tsx
│   │   ├── Home.tsx
│   │   ├── Profile.tsx
│   │   ├── Prescriptions.tsx
│   │   ├── AppointmentModal.tsx
│   │   ├── Chatbot.tsx
│   │   └── MapView.tsx
│   ├── lib/                    # Utilitários
│   │   ├── ui/                 # Componentes UI (shadcn)
│   │   └── utils.ts
│   └── styles/
│       ├── globals.css         # Estilos globais + Tailwind
│       └── leaflet.css         # Estilos do mapa
├── public/
│   └── logo/                   # Assets estáticos
├── next.config.ts              # Configuração Next.js
├── tailwind.config.ts          # Configuração Tailwind
├── tsconfig.json               # Configuração TypeScript
└── package.json
```

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## Migração do Vite

Se você ainda tem os arquivos do Vite, execute:

```bash
bash migrate-to-nextjs.sh
```

## Funcionalidades

- 🔐 **Login** - Autenticação de usuários
- 🏠 **Home** - Dashboard com consultas e mapa
- 📋 **Receitas** - Histórico de prescrições médicas
- 👤 **Perfil** - Configurações e informações do usuário
- 📅 **Agendamento** - Modal para agendar consultas virtuais ou presenciais
- 🗺️ **Mapa** - Visualização de hospitais e farmácias próximas
- 🤖 **Chatbot** - Assistente virtual (mock)
- 🎨 **Temas** - Modo claro/escuro e personalização de cores

## Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Leaflet** - Mapas interativos
- **Lucide React** - Ícones
