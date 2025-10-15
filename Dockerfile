FROM node:22-alpine

WORKDIR /app

# 依存関係をコピーしてインストール
COPY package*.json ./
RUN npm install --omit=dev

# ソースコードをコピー
COPY src ./src

# 静的ファイルをコピー
COPY public ./public

# 環境変数
ENV PORT=8080

EXPOSE 8080

CMD ["node", "src/server.js"]
