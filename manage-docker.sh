#!/bin/bash
# manage-docker.sh

function start_services() {
    echo "Starting MongoDB and Mongo Express..."
    docker compose up -d
    echo "Waiting for services to be ready..."
    sleep 5
    echo "Services are up and running!"
    echo "MongoDB: localhost:27017"
    echo "Mongo Express: http://localhost:8081"
}

function stop_services() {
    echo "Stopping services..."
    docker compose down
    echo "Services stopped!"
}

function restart_services() {
    echo "Restarting services..."
    docker compose restart
    echo "Services restarted!"
}

function view_logs() {
    echo "Showing logs (Ctrl+C to exit)..."
    docker compose logs -f
}

function reset_data() {
    echo "Warning: This will delete all data! Are you sure? (y/N)"
    read answer
    if [ "$answer" = "y" ]; then
        docker compose down -v
        docker compose up -d
        echo "Data reset complete!"
    else
        echo "Operation cancelled."
    fi
}

case "$1" in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "logs")
        view_logs
        ;;
    "reset")
        reset_data
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|reset}"
        exit 1
esac