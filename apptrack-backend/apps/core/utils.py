import os
import hashlib
from django.utils.text import slugify


def generate_unique_filename(filename):
    name, ext = os.path.splitext(filename)
    hash_str = hashlib.md5(name.encode()).hexdigest()[:8]
    return f"{slugify(name)}-{hash_str}{ext}"