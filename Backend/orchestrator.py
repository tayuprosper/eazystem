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

import json

# In-memory database for job tracking
JOBS_FILE = "jobs.json"

def load_jobs():
    if os.path.exists(JOBS_FILE):
        try:
            with open(JOBS_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_jobs(jobs_data):
    with open(JOBS_FILE, "w") as f:
        json.dump(jobs_data, f)

jobs = load_jobs()

# --- Pydantic Models ---
class RenderRequest(BaseModel):
    prompt: str

# --- CORE LOGIC ---
def generate_manim_code(prompt, broken_code=None, error_msg=None):
    """
    Calls Gemini API with the optimized Eazystem system prompt.
    """
    system_instructions = """
# ROLE
Elite Math/CS Educator & Manim CE Developer. Produce 3Blue1Brown-style animations.

# OUTPUT RULES
- ONLY raw Python code. No markdown, no explanations.
- First line: from manim import *
- Main class: GeneratedScene
- Use standard Manim CE/Python stdlib only.

# CRASH PREVENTION (MANIM CE SYNTAX)
- Use Create() for shapes/graphs/arrows; Write() for Tex/MathTex. (No ShowCreation/GrowFromCenter).
- FadeOut(*self.mobjects) to clear screen. Wait(N) after reveals.
- VGroup.arrange(DOWN, buff=0.5); next_to(obj, direction, buff=0.4).
- NO .group_by_tex(), .align_left(), or .to_center().
- Use .align_to(ref, LEFT) and .move_to(ORIGIN).
- Dot(point=axes.c2p(x, y)); Line(start, end) uses positional args.
- axes.get_tangent_line(graph, x, length, color) is valid.

# LAYOUT & SPATIAL (14x8 Screen)
- TOP (y=3 to 4): Titles only (.to_edge(UP, buff=0.3)).
- LEFT (x=-7 to -0.5): Visuals/Graphs. (.shift(LEFT * 3.5))
- RIGHT (x=0.5 to 7): Formulas/Text. (.shift(RIGHT * 3.5))
- BOTTOM (y=-3.5 to -4): Footnotes.
- Clear screen after 3-4 lines of math to prevent overlap.

# VISUAL STYLE
- Background: Black. Text: White/Light Grey.
- Colors: BLUE_C/D (Primary), GREEN_C (Functions), YELLOW_C (Highlights), RED_C (Emphasis), GOLD_C (Results).
- Axes: axis_config={"color": BLUE_D}, tips=False. Labels: axes.get_axis_labels().set_color(BLUE_D).
- Use SurroundingRectangle(obj, color=GOLD_C) for key results.

# LESSON FLOW
1. HOOK: Centered Tex title (2s), then FadeOut.
2. INTUITION: Visual diagrams/graphs before math.
3. MECHANICS: Step-by-step formulas with Write() + wait(1.5).
4. EXAMPLE: Numerical calculation.
5. CONCLUSION: Summary result in a GOLD_C box (3s).
Clear screen with FadeOut(*self.mobjects) between phases.
"""

    if error_msg:
        print(f"Self-correcting Manim syntax. Error length: {len(error_msg)}")
        full_prompt = (
            f"{system_instructions}\n\n"
            "=== SELF-CORRECTION TASK ===\n"
            "The code below crashed with an error. Your job is to rewrite it from scratch, correctly.\n"
            "Do NOT repeat the same patterns that caused the crash. Refer to Section 2 and Section 6 of the rules above.\n"
            "Common fixes needed:\n"
            "  - Replace .align_left() with .align_to(ref, LEFT)\n"
            "  - Replace .to_center() with .move_to(ORIGIN)\n"
            "  - Replace .group_by_tex() with SurroundingRectangle() or remove it\n"
            "  - Replace ShowCreation() with Create()\n"
            "  - Replace arrange_in_grid() with .arrange(DOWN, buff=0.5) or manual next_to()\n"
            "  - Fix any MathTex index access [N] — use SurroundingRectangle instead\n"
            "  - Ensure FadeOut() receives actual scene mobjects, not undefined variables\n\n"
            f"Original Topic: {prompt}\n\n"
            f"Broken Code:\n```python\n{broken_code}\n```\n\n"
            f"Error Traceback:\n{error_msg}\n\n"
            "Now write the complete corrected Python code:"
        )
    else:
        print(f"Generating scene for: {prompt}")
        full_prompt = (
            f"{system_instructions}\n\n"
            "=== YOUR TASK ===\n"
            f"Educational Topic: {prompt}\n\n"
            "Follow the 5-phase lesson structure (Hook → Intuition → Mechanics → Example → Conclusion).\n"
            "Use the safe coding patterns from Section 6. Clear the screen with FadeOut(*self.mobjects) between phases.\n"
            "Make it visually rich, pedagogically clear, and crash-free.\n"
            "Output only the complete Python code starting with 'from manim import *':"
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
    global jobs
    filename = f"scene_{job_id}.py"
    scene_name = "GeneratedScene"
    output_dir = os.path.join("media", job_id)
    
    try:
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
                save_jobs(jobs)
                if os.path.exists(filename): os.remove(filename)
                return
            else:
                error_output = result.stderr[-800:] 
                if attempt < max_retries - 1:
                    # Try to fix the code with the AI
                    current_code = generate_manim_code(user_prompt, broken_code=current_code, error_msg=error_output)
                else:
                    jobs[job_id] = {"state": "FAILED", "error": error_output.strip()}
                    save_jobs(jobs)
                    if os.path.exists(filename): os.remove(filename)
    except Exception as e:
        print(f"CRITICAL ERROR in render_task for {job_id}: {str(e)}")
        jobs[job_id] = {"state": "FAILED", "error": f"Internal Server Error: {str(e)}"}
        save_jobs(jobs)
        if os.path.exists(filename): os.remove(filename)

# --- API ENDPOINTS ---

@app.post("/render")
async def start_render(request: RenderRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())[:8]
    jobs[job_id] = {"state": "PENDING"}
    save_jobs(jobs)
    background_tasks.add_task(render_task, job_id, request.prompt)
    return {"jobId": job_id}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    # Reload jobs from file to ensure sync between workers if applicable
    current_jobs = load_jobs()
    print(f"Checking status for job: {job_id}")
    status = current_jobs.get(job_id, {"state": "NOT_FOUND"})
    print(status)
    return status

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
