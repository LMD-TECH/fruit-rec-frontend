FROM node:18-alpine
# Étape 1 : Définir le répertoire de travail

WORKDIR /app

# Étape 2 : Copier les fichiers de dépendances
COPY package.json /app

RUN npm install --legacy-peer-deps

# Étape 4 : Copier le reste du code source
COPY . .
RUN npm run build

# Étape 7 : Exposer le port 3000 (port par défaut de Next.js)
EXPOSE 3000

# Étape 8 : Démarrer l'application
CMD ["npm", "start"]