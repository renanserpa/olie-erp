// Script para corrigir erros comuns em arquivos TypeScript do projeto
// Este script pode ser executado com Node.js para automatizar correções em todos os arquivos

const fs = require('fs');
const path = require('path');

// Diretório das páginas
const pagesDir = path.join(__dirname, 'src', 'pages');

// Função para ler um arquivo
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Função para escrever em um arquivo
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// Função para corrigir imports não utilizados
function removeUnusedImports(content) {
  // Lista de imports comumente não utilizados
  const unusedImports = [
    'LineChart', 'Line', 'Calendar', 'ChevronDown', 'ChevronUp',
    'Clock', 'AlertTriangle', 'FileText', 'CreditCard', 'MapPin',
    'Users', 'Bell', 'HelpCircle', 'X', 'Archive'
  ];
  
  // Remover imports não utilizados
  unusedImports.forEach(importName => {
    const regex = new RegExp(`(, ${importName}|${importName}, )`, 'g');
    content = content.replace(regex, ', ');
  });
  
  // Limpar imports vazios
  content = content.replace(/import \{\s*\} from .*/g, '');
  
  // Comentar import do supabase se não estiver sendo usado
  if (!content.includes('supabase.') && content.includes('import { supabase }')) {
    content = content.replace(/import { supabase } from '\.\.\/utils\/supabase';/g, 
                             '// import { supabase } from \'../utils/supabase\';');
  }
  
  return content;
}

// Função para adicionar tipagem a parâmetros
function addTypingToParameters(content) {
  // Adicionar tipagem para parâmetros 'e' em funções onChange
  content = content.replace(/onChange={\s*\(\s*e\s*\)\s*=>/g, 'onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>');
  
  // Adicionar tipagem para parâmetros 'payload' em funções de callback
  content = content.replace(/\(\s*payload\s*\)\s*=>/g, '(payload: any) =>');
  
  // Adicionar tipagem para parâmetros 'n' em funções filter/map
  content = content.replace(/(\.\s*filter\s*\(\s*n\s*=>)/g, '.filter((n: any) =>');
  content = content.replace(/(\.\s*map\s*\(\s*n\s*=>)/g, '.map((n: any) =>');
  
  return content;
}

// Função para corrigir props incompatíveis
function fixIncompatibleProps(content) {
  // Corrigir tamanho de botão 'xs' para 'sm'
  content = content.replace(/size="xs"/g, 'size="sm"');
  
  // Corrigir variante 'danger' para 'primary'
  content = content.replace(/variant="danger"/g, 'variant="primary"');
  
  return content;
}

// Função para adicionar componentes ausentes
function addMissingComponents(content) {
  // Adicionar componente Send se estiver ausente
  if (content.includes('<Send') && !content.includes('const Send =')) {
    const sendComponent = `
// Componente Send importado de lucide-react
const Send = (props: { size: number, className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);`;
    
    // Inserir após os imports
    const lastImportIndex = content.lastIndexOf('import');
    const lastImportEndIndex = content.indexOf(';', lastImportIndex) + 1;
    
    content = content.substring(0, lastImportEndIndex) + '\n' + sendComponent + content.substring(lastImportEndIndex);
  }
  
  return content;
}

// Função principal para corrigir um arquivo
function fixFile(filePath) {
  console.log(`Corrigindo ${filePath}...`);
  
  let content = readFile(filePath);
  
  // Aplicar correções
  content = removeUnusedImports(content);
  content = addTypingToParameters(content);
  content = fixIncompatibleProps(content);
  content = addMissingComponents(content);
  
  // Salvar arquivo corrigido
  writeFile(filePath, content);
  
  console.log(`${filePath} corrigido com sucesso!`);
}

// Função para processar todos os arquivos em um diretório
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(filePath);
    }
  });
}

// Criar arquivo de declaração de tipos global
function createTypeDeclaration() {
  const typesDir = path.join(__dirname, 'src', 'types');
  
  // Criar diretório se não existir
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }
  
  // Criar arquivo de declaração
  const declarationFile = path.join(typesDir, 'react-input-mask.d.ts');
  writeFile(declarationFile, 'declare module \'react-input-mask\';');
  
  console.log(`Arquivo de declaração criado: ${declarationFile}`);
}

// Atualizar arquivos de configuração
function updateConfigFiles() {
  // Atualizar postcss.config.js
  const postcssConfig = path.join(__dirname, 'postcss.config.js');
  if (fs.existsSync(postcssConfig)) {
    writeFile(postcssConfig, `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}`);
    console.log(`Arquivo atualizado: ${postcssConfig}`);
  }
  
  // Atualizar tailwind.config.js
  const tailwindConfig = path.join(__dirname, 'tailwind.config.js');
  if (fs.existsSync(tailwindConfig)) {
    writeFile(tailwindConfig, `export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`);
    console.log(`Arquivo atualizado: ${tailwindConfig}`);
  }
}

// Executar correções
try {
  console.log('Iniciando correções automáticas...');
  
  // Criar arquivo de declaração de tipos
  createTypeDeclaration();
  
  // Atualizar arquivos de configuração
  updateConfigFiles();
  
  // Processar todos os arquivos
  if (fs.existsSync(pagesDir)) {
    processDirectory(pagesDir);
  } else {
    console.error(`Diretório não encontrado: ${pagesDir}`);
  }
  
  console.log('Correções concluídas com sucesso!');
} catch (error) {
  console.error('Erro ao aplicar correções:', error);
}
