const fs = require('fs');
const content = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false
};

const path = require('path');
module.exports = nextConfig;`;

fs.writeFileSync('next.config.temp.js', content);
console.log('Arquivo temporário criado com sucesso!');
