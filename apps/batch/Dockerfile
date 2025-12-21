FROM ruby:3.2.0-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    bash \
    curl \
    git

# Copy Gemfile
COPY Gemfile Gemfile.lock* ./

# Install gems without relying on Gemfile.lock during build
RUN bundle install --without development test

# Copy application files
COPY . .

# Create logs directory
RUN mkdir -p logs

# Make batch_runner.sh executable
RUN chmod +x batch_runner.sh

# Set environment
ENV RACK_ENV=production
ENV AWS_REGION=ap-northeast-1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD bundle exec ruby -e "puts 'OK'" || exit 1

# Default command
CMD ["./batch_runner.sh", "start"]
