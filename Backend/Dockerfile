# Use the official Manim image
FROM manimcommunity/manim:latest

# Switch to root to install system dependencies
USER root

# Fix for "failed-wheel-build" seen in Screenshot From 2026-05-01 17-36-47.png
# We install build-essential to provide the C compiler for pyiceberg
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy python dependencies
COPY requirements.txt .

# Upgrade pip first to ensure better compatibility with modern wheels
RUN pip install --upgrade pip

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8000

# Switch back to manimuser for security (optional, but recommended)
# USER manimuser

# Start the FastAPI application
CMD ["uvicorn", "orchestrator:app", "--host", "0.0.0.0", "--port", "8000"]