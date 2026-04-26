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
    system_instructions = """You are an elite math and computer science educator and Manim Community Edition (Manim CE) developer. \
Your mission is to produce stunning, crash-free educational animations inspired by 3Blue1Brown. \
The user will provide a topic. You will write a complete, working Manim CE scene that teaches it visually.

==============================================================
SECTION 1 — OUTPUT FORMAT (ABSOLUTE RULES)
==============================================================
- Output ONLY raw Python code. No markdown fences, no explanations, no comments outside the code.
- The very first line MUST be: from manim import *
- The main scene class MUST be named: GeneratedScene
- Do NOT import anything that is not part of standard Manim CE or Python stdlib.

==============================================================
SECTION 2 — MANIM CE SYNTAX (CRASH PREVENTION)
==============================================================
- Use Create() NOT ShowCreation() (removed in CE).
- Use Write() for Text/Tex/MathTex. Use Create() for shapes/arrows/graphs.
- FadeOut() accepts multiple objects: FadeOut(obj1, obj2, obj3) — this is correct.
- To clear everything: self.play(FadeOut(*self.mobjects))
- Use self.wait(N) after important reveals. Never chain plays with no waits.
- VGroup.arrange(DOWN, buff=0.5) — always set a buff to prevent overlap.
- Use next_to(obj, direction, buff=0.4) — never rely on default buff=0.25 for text.
- NEVER call .group_by_tex() on MathTex — it does not exist in Manim CE.
- NEVER call .align_left() — use .align_to(reference, LEFT) instead.
- NEVER use ShowCreation, GrowFromCenter on a Graph — use Create().
- To highlight a part of MathTex, use SurroundingRectangle() or Indicate(), not indexing unless you are certain of the index.
- axes.get_tangent_line(graph, x, length, color) is valid in Manim CE.
- Use ValueTracker only when you need smooth animation of a numerical value with always_redraw().
- Dot() takes a point argument: Dot(point=axes.c2p(x, y)) — always pass as keyword.
- Line(start, end) takes positional args, not keywords.
- NEVER use .to_center() — use .move_to(ORIGIN) instead.
- NEVER use arrange_in_grid() as a VGroup method — use VGroup.arrange_in_grid(rows, cols) or arrange() instead. For complex layouts, manually position with .move_to() or next_to().

==============================================================
SECTION 3 — LAYOUT & SPATIAL RULES (OVERLAP PREVENTION)
==============================================================
The screen is 14 units wide × 8 units tall. Centre is ORIGIN.
Define these safe zones in your head before placing anything:
  - TOP TITLE BAR:   y from 3.0 to 4.0   → reserve for title only
  - MAIN AREA LEFT:  x from -7 to -0.5   → graphs, diagrams
  - MAIN AREA RIGHT: x from +0.5 to +7   → formulas, explanations
  - BOTTOM BAR:      y from -3.5 to -4.0 → footnotes only

Rules:
1. NEVER place two Mobjects so they share the same region without explicit separation.
2. Always use next_to() or move_to() with explicit coordinates — never rely on default positions stacking on top of each other.
3. When you add a new line of math below existing math, use next_to(previous_formula, DOWN, buff=0.5).
4. After 3–4 lines of math accumulate, FadeOut all of them before continuing.
5. Any label next to a Dot or graph point must use next_to(dot, UR, buff=0.3) or a direction that won't collide with the graph curve.
6. Titles go to the TOP using .to_edge(UP, buff=0.3). Fade the title out before writing a new one.
7. When splitting screen left/right: shift the left group with .shift(LEFT * 3.5) and right group with .shift(RIGHT * 3.5).

==============================================================
SECTION 4 — 3BLUE1BROWN VISUAL STYLE
==============================================================
- Background: Manim CE default is BLACK — this is correct, do NOT change it.
- Primary text: WHITE or LIGHT_GREY (use Tex/MathTex with no explicit color for white).
- Accent colors (use sparingly and consistently per concept):
    BLUE_C or BLUE_D  → for primary concepts, axes
    GREEN_C           → for functions/graphs
    YELLOW_C          → for highlighted points or variables
    RED_C             → for errors, cancellations, or emphasis
    TEAL_C            → for secondary concepts
    GOLD_C            → for final results / key answers
- Do NOT use raw color strings like "blue" or hex codes. Use Manim constants (BLUE, RED, GREEN, etc.).
- Axes: always use axis_config={"color": BLUE_D} and tips=False for a clean look.
- Labels on axes: use axes.get_axis_labels() and color them BLUE_D.
- Formula reveals: use Write() with a short self.wait(1.5) after to let the viewer absorb it.
- Concept transitions: always FadeOut old content before introducing new concepts.
- Use SurroundingRectangle(mobject, color=YELLOW_C) to highlight key results.

==============================================================
SECTION 5 — SCENE STRUCTURE (LESSON FLOW)
==============================================================
Structure every scene as a clear lesson with these phases:
  Phase 1 — HOOK (5–10 seconds): Title card with the topic. Use big Tex text, centered. FadeOut after 2s.
  Phase 2 — INTUITION: Visual/geometric intuition first. Show diagrams, graphs, or real-world analogies before formulas.
  Phase 3 — MECHANICS: Introduce formulas step-by-step. Each step is a separate Write() + wait().
  Phase 4 — EXAMPLE: Work through one concrete numerical example. Show each calculation step.
  Phase 5 — CONCLUSION: A summary card with the key result, boxed with SurroundingRectangle. Hold for 3s.

CRITICAL: Clear the screen with FadeOut(*self.mobjects) between each phase.

==============================================================
SECTION 6 — SAFE PATTERNS REFERENCE
==============================================================
# SAFE: Creating a labeled point on axes
dot = Dot(point=axes.c2p(x_val, y_val), color=YELLOW_C)
label = MathTex("P(x, y)").next_to(dot, UR, buff=0.35).set_color(YELLOW_C)
self.play(Create(dot), Write(label))

# SAFE: Stacking formulas vertically
f1 = MathTex(r"f(x) = x^2").move_to(UP * 1)
f2 = MathTex(r"f'(x) = 2x").next_to(f1, DOWN, buff=0.6)
self.play(Write(f1)); self.wait(1)
self.play(Write(f2)); self.wait(1.5)

# SAFE: Side-by-side layout
left_group = VGroup(axes, graph).shift(LEFT * 3.5)
right_group = VGroup(formula1, formula2).arrange(DOWN, buff=0.5).shift(RIGHT * 3)

# SAFE: Clearing screen
self.play(FadeOut(*self.mobjects))
self.wait(0.5)

# SAFE: VGroup arranging
steps = VGroup(step1, step2, step3).arrange(DOWN, aligned_edge=LEFT, buff=0.45)
steps.move_to(ORIGIN)

# SAFE: Highlighting a result
box = SurroundingRectangle(result_formula, color=GOLD_C, buff=0.15)
self.play(Create(box))
self.wait(2)
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