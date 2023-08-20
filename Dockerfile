# Stage 1: Build the frontend
FROM node:16.4.2 as frontend
WORKDIR /app/frontend
COPY ./frontend/surge-app/package.json ./frontend/surge-app/package-lock.json ./
RUN npm install
COPY ./frontend/surge-app/ ./
RUN npm run build

# Stage 2: Build the backend
FROM node:16.4.2 as backend
WORKDIR /app/backend
COPY ./backend/package.json ./backend/package-lock.json ./
RUN npm install
COPY ./backend/ ./
RUN npm run build

# Stage 3: Create the final image
FROM node:16.4.2
WORKDIR /app

# Copy frontend and backend build outputs from previous stages
COPY --from=frontend /app/frontend/build ./frontend/build
COPY --from=backend /app/backend/build ./backend/build

# Expose ports (adjust as needed)
EXPOSE 3000
EXPOSE 5000

# Start the applications
CMD ["npm", "run", "start"]
