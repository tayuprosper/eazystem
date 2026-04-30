from Backend.services.file_upload import upload_file_to_supabase
import os

def test_upload_file_to_supabase():
    # Create a temporary file for testing
    print("Starting test for file upload...")
    test_file_path = "test.mp4"
    with open(test_file_path, "w") as f:
        f.write("This is a test file for upload.")

    try:
        # Call the upload function
        public_url = upload_file_to_supabase(test_file_path, 123)

        # Check if the public URL is returned
        assert public_url.startswith("https://"), "Public URL should start with https://"
        print("Test passed: File uploaded successfully and public URL returned.", public_url)
    except Exception as e:
        print(f"Test failed: {e}")
    finally:
        # Clean up the temporary file
        if os.path.exists(test_file_path):
            os.remove(test_file_path)
            
if __name__ == "__main__":
    test_upload_file_to_supabase()  