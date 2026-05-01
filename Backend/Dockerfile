FROM manimcommunity/manim:latest

USER root

RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create necessary directories and fix permissions
RUN mkdir -p media \
    && touch jobs.json \
    && chmod 666 jobs.json \
    && chown -R manimuser:manimuser /app

EXPOSE 8000

USER manimuser

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]