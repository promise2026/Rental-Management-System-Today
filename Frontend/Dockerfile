# ---------------------------------------------------------
# Frontend — React + Vite (multi-stage build)
# ---------------------------------------------------------

# Stage 1: Build the React application
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the static build output with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Nginx runs in the foreground so Docker can manage the process
CMD ["nginx", "-g", "daemon off;"]