# Use the official Manim image
FROM manimcommunity/manim:latest

# Switch to root to install some extra python deps if needed, though we can stay as manimuser
USER root

WORKDIR /app

# copy pythin dependencies
COPY requirements.txt .

# install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8000

# Start the FastAPI application
CMD ["uvicorn", "orchestrator:app", "--host", "0.0.0.0", "--port", "8000"]