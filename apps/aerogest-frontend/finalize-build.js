const fs = require('fs');
const { execSync } = require('child_process');

// 1. Criar arquivo de configuração correto
const configContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false
};

const path = require('path');
module.exports = nextConfig;`;

fs.writeFileSync('next.config.temp.js', configContent);
console.log('Arquivo de configuração temporário criado');

// 2. Executar build
try {
  console.log('Iniciando build...');
  execSync('npx next build --config next.config.temp.js --no-lint', { stdio: 'inherit' });
  
  // 3. Substituir configuração original
  fs.renameSync('next.config.temp.js', 'next.config.js');
  console.log('Configuração permanente aplicada');
  
  // 4. Limpar arquivos temporários
  fs.unlinkSync('create-temp-config.js');
  fs.unlinkSync('finalize-build.js');
  
  console.log('Processo concluído com sucesso!');
  console.log('Execute: npx next start -p 3005');
} catch (error) {
  console.error('Erro durante o build:', error);
}
