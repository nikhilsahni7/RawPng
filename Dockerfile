# Use the official Bun image
FROM oven/bun:latest as base

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Set environment variables with default values for build time
ARG RESEND_API_KEY
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ARG MONGODB_URI
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_S3_BUCKET_NAME
ARG AWS_REGION
ARG CLOUDFRONT_DOMAIN_NAME

# Build the Next.js application
RUN bun run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "start"]