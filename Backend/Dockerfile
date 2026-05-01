# Use the official Manim image (best base for Manim + Python)
FROM manimcommunity/manim:latest

# Switch to root to install system packages
USER root

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Create media directory
RUN mkdir -p media && chown -R manimuser:manimuser media

# Expose FastAPI port
EXPOSE 8000

# Switch back to non-root user for security
USER manimuser

# Start the FastAPI app
# Make sure this matches your main file name
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]