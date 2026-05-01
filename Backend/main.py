import uuid
import subprocess
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from services.job_manager import load_jobs, save_jobs
from services.manim_generrator import generate_manim_code
from services.file_upload import upload_file_to_supabase
from services.data_upload import upload_video_data_to_supabase

app = FastAPI(title="Eazystem Backend API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # For development - change later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Media
os.makedirs("media", exist_ok=True)
app.mount("/media", StaticFiles(directory="media"), name="media")

# --- Models ---
class RenderRequest(BaseModel):
    prompt: str
    userId: str

# --- Background Task ---
def render_task(job_id: str, user_prompt: str, max_retries: int = 3):
    jobs = load_jobs()
    filename = f"scene_{job_id}.py"
    output_dir = os.path.join("media", job_id)
    current_code = None

    try:
        current_code = generate_manim_code(user_prompt)

        for attempt in range(max_retries):
            with open(filename, "w", encoding="utf-8") as f:
                f.write(current_code)

            result = subprocess.run(
                    ["manim", "-pql", filename, "GeneratedScene", "--media_dir", output_dir],
                        capture_output=True,
                        text=True,
                        # timeout=180   # Prevents hanging forever
                    )

            if result.returncode == 0:
                video_path = os.path.join(output_dir, "videos", f"scene_{job_id}", "480p15", "GeneratedScene.mp4")
                
                if os.path.exists(video_path):
                    video_url = upload_file_to_supabase(video_path, job_id)
                    upload_video_data_to_supabase(video_url, jobs[job_id]["owner"], user_prompt)
                    
                    jobs[job_id] = {"state": "COMPLETED", "videoUrl": video_url}
                else:
                    jobs[job_id] = {"state": "FAILED", "error": "Video file not found"}
                break
            else:
                error_output = result.stderr[-1000:]
                if attempt < max_retries - 1:
                    current_code = generate_manim_code(user_prompt, broken_code=current_code, error_msg=error_output)
                else:
                    jobs[job_id] = {"state": "FAILED", "error": error_output.strip()}
        else:
            jobs[job_id] = {"state": "FAILED", "error": "Max retries exceeded"}

    except Exception as e:
        jobs[job_id] = {"state": "FAILED", "error": str(e)}
    finally:
        save_jobs(jobs)
        if os.path.exists(filename):
            os.remove(filename)

# --- Routes ---
@app.post("/render")
async def start_render(request: RenderRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())[:8]
    
    jobs = load_jobs()
    jobs[job_id] = {"owner": request.userId, "prompt": request.prompt, "state": "PENDING"}
    save_jobs(jobs)

    background_tasks.add_task(render_task, job_id, request.prompt)
    return {"jobId": job_id, "status": "PENDING"}


@app.get("/status/{job_id}")
async def get_status(job_id: str):
    jobs = load_jobs()

    status =  jobs.get(job_id, {"state": "NOT_FOUND"})
    print(f"Status check for job {job_id}: {status}")
    return status


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)