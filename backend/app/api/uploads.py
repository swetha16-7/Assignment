import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from app.config import settings
from app.services.upload_service import save_uploaded_logo

router = APIRouter(prefix="/api/uploads", tags=["Uploads"])


@router.post("/logo")
async def upload_company_logo(file: UploadFile = File(...)):
    try:
        result = await save_uploaded_logo(file)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process upload: {str(e)}")


@router.get("/{filename}")
def serve_upload(filename: str):
    # Prevent path traversal
    safe_name = os.path.basename(filename)
    file_path = os.path.join(settings.UPLOAD_DIR, safe_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)
