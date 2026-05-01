import json
import os

JOBS_FILE = "jobs.json"

def load_jobs() -> dict:
    if os.path.exists(JOBS_FILE):
        try:
            with open(JOBS_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_jobs(jobs: dict):
    with open(JOBS_FILE, "w") as f:
        json.dump(jobs, f, indent=2)