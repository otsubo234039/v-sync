#!/bin/bash

# V-Sync Batch Job Runner Script
# This script manages batch jobs on AWS EC2

set -e

# Configuration
BATCH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${BATCH_DIR}/logs"
PID_FILE="${BATCH_DIR}/.batch_process.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create logs directory if not exists
mkdir -p "${LOG_DIR}"

# Initialize environment
init_environment() {
    log_info "Initializing batch environment..."
    
    if [ -f "${BATCH_DIR}/.env" ]; then
        set -a
        source "${BATCH_DIR}/.env"
        set +a
        log_info "Loaded .env file"
    else
        log_warning ".env file not found, using system environment variables"
    fi
}

# Start batch processor
start_batch() {
    log_info "Starting batch processor..."
    
    if [ -f "${PID_FILE}" ] && kill -0 $(cat "${PID_FILE}") 2>/dev/null; then
        log_error "Batch processor is already running (PID: $(cat ${PID_FILE}))"
        exit 1
    fi
    
    nohup bundle exec ruby "${BATCH_DIR}/batch_processor.rb" \
        >> "${LOG_DIR}/batch_$(date +%Y%m%d_%H%M%S).log" 2>&1 &
    
    echo $! > "${PID_FILE}"
    log_info "Batch processor started (PID: $(cat ${PID_FILE}))"
}

# Stop batch processor
stop_batch() {
    log_info "Stopping batch processor..."
    
    if [ -f "${PID_FILE}" ]; then
        PID=$(cat "${PID_FILE}")
        if kill -0 $PID 2>/dev/null; then
            kill $PID
            log_info "Batch processor stopped (PID: $PID)"
        else
            log_warning "Batch processor is not running"
        fi
        rm "${PID_FILE}"
    else
        log_warning "No PID file found"
    fi
}

# Check batch processor status
status_batch() {
    if [ -f "${PID_FILE}" ]; then
        PID=$(cat "${PID_FILE}")
        if kill -0 $PID 2>/dev/null; then
            log_info "Batch processor is running (PID: $PID)"
            return 0
        else
            log_error "Batch processor is not running (stale PID file)"
            rm "${PID_FILE}"
            return 1
        fi
    else
        log_warning "Batch processor is not running"
        return 1
    fi
}

# Show logs
show_logs() {
    if [ -z "$1" ]; then
        tail -f "${LOG_DIR}"/batch_*.log
    else
        tail -f "${LOG_DIR}/batch_$1.log"
    fi
}

# Cleanup function
cleanup() {
    log_warning "Received interrupt signal, cleaning up..."
    stop_batch
    exit 0
}

# Main
main() {
    init_environment
    
    case "${1:-help}" in
        start)
            start_batch
            ;;
        stop)
            stop_batch
            ;;
        restart)
            stop_batch
            sleep 1
            start_batch
            ;;
        status)
            status_batch
            ;;
        logs)
            show_logs "$2"
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|status|logs}"
            echo ""
            echo "Commands:"
            echo "  start   - Start the batch processor"
            echo "  stop    - Stop the batch processor"
            echo "  restart - Restart the batch processor"
            echo "  status  - Check batch processor status"
            echo "  logs    - Show batch processor logs (follow mode)"
            exit 1
            ;;
    esac
}

# Setup signal handlers
trap cleanup SIGINT SIGTERM

main "$@"
