from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Supabase client
supabase = create_client(
    supabase_url=os.getenv("SUPABASE_URL"),
    supabase_key=os.getenv("SUPABASE_KEY")
)

def upload_video_data_to_supabase(video_path, user_id, prompt):
    db_data = {
        "owner": user_id,
        "video_url": video_path,
        "prompt": prompt
    }
    supabase.table("videos").insert(db_data).execute()
    