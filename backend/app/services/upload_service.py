import os
import uuid
import base64
from fastapi import UploadFile, HTTPException
from app.config import settings
from app.utils.validation import validate_image_upload


async def save_uploaded_logo(file: UploadFile) -> dict:
    # Read file content
    contents = await file.read()
    file_size = len(contents)
    content_type = file.content_type or "image/png"

    # Validate
    is_valid, err_msg = validate_image_upload(content_type, file_size)
    if not is_valid:
        raise HTTPException(status_code=400, detail=err_msg)

    # Generate unique filename
    ext = os.path.splitext(file.filename or "")[1].lower()
    if not ext:
        if "png" in content_type:
            ext = ".png"
        elif "svg" in content_type:
            ext = ".svg"
        elif "webp" in content_type:
            ext = ".webp"
        else:
            ext = ".jpg"

    safe_filename = f"logo_{uuid.uuid4().hex[:12]}{ext}"
    target_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    with open(target_path, "wb") as f:
        f.write(contents)

    # Encode as base64 data URI
    b64_encoded = base64.b64encode(contents).decode("utf-8")
    data_uri = f"data:{content_type};base64,{b64_encoded}"

    # Return metadata
    return {
        "filename": safe_filename,
        "url": f"/api/uploads/{safe_filename}",
        "data_uri": data_uri,
        "content_type": content_type,
        "size_bytes": file_size
    }
