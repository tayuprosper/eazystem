import subprocess
import uuid
import os
import glob
import shutil
import json
from services.data_upload import upload_video_data_to_supabase
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from google import genai
from services.file_upload import upload_file_to_supabase
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("API_KEY is not set in the environment variables.")

client = genai.Client(api_key=API_KEY)
app = FastAPI(title="Eazystem Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists("media"):
    os.makedirs("media")
app.mount("/media", StaticFiles(directory="media"), name="media")

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

class RenderRequest(BaseModel):
    prompt: str
    userId: str

# --- CORE LOGIC ---
def generate_manim_code(prompt, broken_code=None, error_msg=None):
    system_instructions = """
# ROLE
Elite Math/CS Educator & Manim CE Developer. Produce 3Blue1Brown-style animations.
# OUTPUT RULES
- ONLY raw Python code. No markdown, no explanations, no 'Sure! here is your code'.
- First line: from manim import *
- Main class: GeneratedScene
- Use standard Manim CE/Python stdlib only.
# CRASH PREVENTION
- Use Create() instead of ShowCreation().
- Use .align_to(ref, LEFT) instead of .align_left().
- Ensure all mobjects used in FadeOut(*self.mobjects) are actually initialized.
"""

    if error_msg:
        full_prompt = f"{system_instructions}\n\n=== FIX THIS ERROR ===\nCode:\n{broken_code}\n\nError:\n{error_msg}\n\nRewrite the complete code correctly:"
    else:
        full_prompt = f"{system_instructions}\n\nTask: Create a visual lesson about {prompt}. Name the class GeneratedScene."

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=full_prompt,
    )
    
    code = response.text
    # Improved cleaning logic
    if "```python" in code:
        code = code.split("```python")[1].split("```")[0]
    elif "```" in code:
        code = code.split("```")[1].split("```")[0]
    
    return code.strip()

def render_task(job_id: str, user_prompt: str, max_retries: int = 3):
    global jobs
    filename = f"script_{job_id}.py"
    output_dir = os.path.join("media", job_id)
    
    try:
        current_code = generate_manim_code(user_prompt)
        
        for attempt in range(max_retries):
            with open(filename, "w") as file:
                file.write(current_code)
                
            # Added timeout of 300 seconds to prevent hanging processes
            command = ["manim", "-pql", filename, "GeneratedScene", "--media_dir", output_dir]
            result = subprocess.run(command, capture_output=True, text=True, timeout=300)
            
            # Robust file searching using glob
            # This looks for ANY .mp4 inside the job's media folder regardless of class name
            search_pattern = os.path.join(output_dir, "videos", "**", "*.mp4")
            found_videos = glob.glob(search_pattern, recursive=True)

            if result.returncode == 0 and found_videos:
                local_video_path = found_videos[0]
                
                # Upload to Supabase
                video_url = upload_file_to_supabase(local_video_path, job_id)
                upload_video_data_to_supabase(video_url, jobs[job_id]["owner"], user_prompt)
                
                jobs[job_id].update({"state": "COMPLETED", "videoUrl": video_url})
                save_jobs(jobs)
                
                # Cleanup files/folders
                if os.path.exists(filename): os.remove(filename)
                shutil.rmtree(output_dir, ignore_errors=True)
                return
            else:
                # Capture error for self-correction
                error_output = result.stderr if result.stderr else "Video file not generated."
                print(f"Attempt {attempt + 1} failed for {job_id}")
                
                if attempt < max_retries - 1:
                    current_code = generate_manim_code(user_prompt, broken_code=current_code, error_msg=error_output[-1000:])
                else:
                    jobs[job_id].update({"state": "FAILED", "error": "Max retries reached or render failed."})
                    save_jobs(jobs)
                    if os.path.exists(filename): os.remove(filename)

    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}")
        jobs[job_id] = {"state": "FAILED", "error": str(e)}
        save_jobs(jobs)
        if os.path.exists(filename): os.remove(filename)

# --- API ENDPOINTS ---

@app.post("/render")
async def start_render(request: RenderRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())[:8]
    jobs[job_id] = {"owner": request.userId, "prompt": request.prompt, "state": "PENDING"}
    save_jobs(jobs)
    background_tasks.add_task(render_task, job_id, request.prompt)
    return {"jobId": job_id}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    current_jobs = load_jobs()
    return current_jobs.get(job_id, {"state": "NOT_FOUND"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)