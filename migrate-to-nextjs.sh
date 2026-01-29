#!/bin/bash

# Script para migrar de Vite para Next.js
# Execute: bash migrate-to-nextjs.sh

echo "🚀 Migrando projeto de Vite para Next.js..."

# 1. Backup do package.json original
if [ -f "package.json" ]; then
  cp package.json package.vite.json
  echo "✅ Backup do package.json criado como package.vite.json"
fi

# 2. Usar o novo package.json do Next.js
if [ -f "package.nextjs.json" ]; then
  cp package.nextjs.json package.json
  echo "✅ package.json atualizado para Next.js"
fi

# 3. Atualizar postcss.config
if [ -f "postcss.config.nextjs.mjs" ]; then
  cp postcss.config.mjs postcss.config.vite.mjs 2>/dev/null || true
  cp postcss.config.nextjs.mjs postcss.config.mjs
  echo "✅ postcss.config.mjs atualizado"
fi

# 4. Remover arquivos do Vite (opcional - comentado por segurança)
# rm vite.config.ts
# rm index.html
# rm src/main.tsx

# 5. Instalar dependências
echo "📦 Instalando dependências..."
npm install

echo ""
echo "✨ Migração concluída!"
echo ""
echo "Para rodar o projeto Next.js:"
echo "  npm run dev"
echo ""
echo "O app estará disponível em: http://localhost:3000"
echo ""
echo "⚠️  Lembre-se de:"
echo "  - Mover o logo de src/logo para public/logo (já feito)"
echo "  - Remover arquivos antigos do Vite quando estiver pronto"
echo "  - Testar todas as funcionalidades"
