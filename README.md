# Sistema de Gerenciamento de Voos

## 📦 Pré-requisitos
- Node.js 18+
- MongoDB 6+
- npm 9+

## 🚀 Instalação
1. Clone o repositório:
```bash
git clone https://github.com/crazydog22/Sistema-de-gerenciamento-de-voos.git
cd sistema-gerenciamento-voos
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o ambiente:
```bash
cp apps/sistema-gerenciamento-voos/.env.example apps/sistema-gerenciamento-voos/.env
```

4. Inicie o servidor:
```bash
npm run dev
```

## 🔧 Variáveis de Ambiente
| Variável         | Descrição                          | Exemplo                     |
|------------------|------------------------------------|-----------------------------|
| MONGODB_URI      | URL de conexão do MongoDB          | mongodb://localhost:27017/aerogest |
| PORT             | Porta da aplicação                 | 3001                        |
| JWT_SECRET       | Chave para tokens JWT              | sua-chave-secreta           |

## 📄 Documentação
Acesse a documentação da API em:
`http://localhost:3001/api-docs`

## 🤝 Contribuição
1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
