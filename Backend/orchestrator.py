import subprocess
import uuid
import os
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from google import genai

from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API_KEY is not set in the environment variables.")

client = genai.Client(api_key=API_KEY)

app = FastAPI(title="Eazystem Backend API")

# 1. Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Serve Media Directory
if not os.path.exists("media"):
    os.makedirs("media")
app.mount("/media", StaticFiles(directory="media"), name="media")

# In-memory database for job tracking
jobs = {}

# --- Pydantic Models ---
class RenderRequest(BaseModel):
    prompt: str

# --- CORE LOGIC ---
def generate_manim_code(prompt, broken_code=None, error_msg=None):
    """
    Calls Gemini API with the optimized Eazystem system prompt.
    """
    system_instructions = (
        "You are an expert computer science and math educator, heavily inspired by 3Blue1Brown. "
        "You are also a master developer using Manim Community Edition (Manim CE). "
        "The user will give you an educational topic. Create a step-by-step Manim animation. "
        "\n\nCRITICAL MANIM CE RULES: "
        "\n1. ONLY use modern Manim CE syntax. Use 'Create()' instead of 'ShowCreation()'. "
        "\n2. Always name the main scene class 'GeneratedScene'. "
        "\n3. Output ONLY raw, executable Python code starting with 'from manim import *'."
        "\n\nSPATIAL & LAYOUT RULES: "
        "\n1. NEVER OVERLAP TEXT OR OBJECTS. "
        "\n2. For graphs/automata with >3 states, use `VGroup.arrange_in_grid()` to prevent overlapping. "
        "\n3. Use `CurvedArrow` instead of `ArcBetweenPoints` or mixing straight arrows with arcs. "
        "\n4. Set `.set_z_index(1)` on MathTex labels inside VGroups so they don't get hidden behind filled shapes. "
        "\n5. Use `self.play(FadeOut(*self.mobjects))` to clear the screen between major conceptual steps."
    )

    if error_msg:
        print(f"Self-correcting Manim syntax. Error length: {len(error_msg)}")
        full_prompt = (
            f"{system_instructions}\n\n"
            "I tried to run your previous code, but it threw an error. Fix it immediately.\n\n"
            f"Original Topic: {prompt}\n\n"
            f"Broken Code:\n{broken_code}\n\n"
            f"Error Message:\n{error_msg}"
        )
    else:
        print(f"Generating scene for: {prompt}")
        full_prompt = (
            f"{system_instructions}\n\n"
            f"Educational Topic to Animate: {prompt}\n\n"
            "Plan a short visual lesson. Use text, shapes, and arrows. Generate the complete Manim code."
        )
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=full_prompt,
    )
    
    code = response.text
    if "```python" in code:
        code = code.split("```python")[1].split("```")[0]
    elif "```" in code:
        code = code.split("```")[1].split("```")[0]
        
    return code.strip()

def render_task(job_id: str, user_prompt: str, max_retries: int = 3):
    """
    Background worker that runs the full pipeline: Generate -> Render -> Retry.
    """
    filename = f"scene_{job_id}.py"
    scene_name = "GeneratedScene"
    output_dir = os.path.join("media", job_id)
    
    current_code = generate_manim_code(user_prompt)
    
    for attempt in range(max_retries):
        with open(filename, "w") as file:
            file.write(current_code)
            
        # -pql: preview quality low for speed (480p 15fps)
        command = ["manim", "-pql", filename, scene_name, "--media_dir", output_dir]
        result = subprocess.run(command, capture_output=True, text=True)
        
        if result.returncode == 0:
            # Path to the rendered .mp4 file
            video_url = f"/media/{job_id}/videos/scene_{job_id}/480p15/GeneratedScene.mp4"
            jobs[job_id] = {"state": "COMPLETED", "videoUrl": video_url}
            if os.path.exists(filename): os.remove(filename)
            return
        else:
            error_output = result.stderr[-800:] 
            if attempt < max_retries - 1:
                # Try to fix the code with the AI
                current_code = generate_manim_code(user_prompt, broken_code=current_code, error_msg=error_output)
            else:
                jobs[job_id] = {"state": "FAILED", "error": error_output.strip()}
                if os.path.exists(filename): os.remove(filename)

# --- API ENDPOINTS ---

@app.post("/render")
async def start_render(request: RenderRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())[:8]
    jobs[job_id] = {"state": "PENDING"}
    background_tasks.add_task(render_task, job_id, request.prompt)
    return {"jobId": job_id}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    return jobs.get(job_id, {"state": "NOT_FOUND"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)