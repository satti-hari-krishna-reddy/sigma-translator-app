# Stage 1: Build frontend
FROM node:14 AS frontend
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Stage 2: Build backend
FROM python:3.10.11 AS backend
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

FROM python:3.10.11
WORKDIR /app
COPY --from=frontend /app/build ./frontend/build
COPY --from=backend /app .

# Expose necessary ports
EXPOSE 5000 5173

# Start the application
CMD ["concurrently", "\"python src/Backend/api.py\"", "\"npm run start\""]
