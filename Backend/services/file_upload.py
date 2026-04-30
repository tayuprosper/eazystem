import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Supabase client
supabase = create_client(
    supabase_url=os.getenv("SUPABASE_URL"),
    supabase_key=os.getenv("SUPABASE_KEY")
)

def upload_file_to_supabase(file_path, user_id):
    bucket_name = os.getenv("BUCKET_NAME") or "videos"  # Default to 'videos' if not set

    # Create a unique destination path
    file_name = os.path.basename(file_path)
    destination_path = f"{user_id}/{file_name}"

    try:
        with open(file_path, 'rb') as f:
            # 1. Perform the upload
            # Adding 'x-upsert': 'true' helps prevent errors if the file already exists
            supabase.storage.from_(bucket_name).upload(
                path=destination_path,
                file=f,
                file_options={
                    "content-type": "video/mp4",
                    "x-upsert": "true" 
                }
            )

        # 2. Generate the Public URL
        # get_public_url returns an object, we want the string inside it
        response = supabase.storage.from_(bucket_name).get_public_url(destination_path)
        
        # In the latest SDK, it's usually an object with a 'public_url' property
        # or just a string depending on your specific library version.
        # This handles the most common SDK return type:
        return response if isinstance(response, str) else response.get("public_url", response)

    except Exception as e:
        print(f"Upload failed: {e}")
        raise e