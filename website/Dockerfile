FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_TUNNEL_DOMAIN=ophl.link
ENV NEXT_PUBLIC_TUNNEL_DOMAIN=$NEXT_PUBLIC_TUNNEL_DOMAIN
# public/install.sh is committed; skip prebuild sync (../scripts not in build context)
RUN npm run build --ignore-scripts

FROM node:22-alpine
RUN addgroup -g 10001 -S openhole && adduser -S -u 10001 -G openhole openhole
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder --chown=openhole:openhole /app/.next/standalone ./
COPY --from=builder --chown=openhole:openhole /app/.next/static ./.next/static
COPY --from=builder --chown=openhole:openhole /app/public ./public
USER openhole
EXPOSE 3000
CMD ["node", "server.js"]
