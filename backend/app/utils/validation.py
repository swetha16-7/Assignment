import re
from typing import Tuple

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
ALLOWED_IMAGE_MIMES = {"image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"}
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


def is_valid_email(email: str) -> bool:
    if not email:
        return False
    return bool(EMAIL_REGEX.match(email.strip()))


def validate_image_upload(content_type: str, file_size: int) -> Tuple[bool, str]:
    if content_type not in ALLOWED_IMAGE_MIMES:
        return False, f"Unsupported image type: {content_type}. Allowed: PNG, JPG, JPEG, SVG, WEBP."
    if file_size > MAX_IMAGE_SIZE_BYTES:
        return False, f"File exceeds maximum allowed size of 5MB (size: {file_size / (1024 * 1024):.2f}MB)."
    return True, ""
