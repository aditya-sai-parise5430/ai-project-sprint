"""
Referral code generation and lookup utilities.
"""
import random
import re
import string

from app.core.database import get_db


_CHARS = string.ascii_uppercase + string.digits


def _clean_name_prefix(name: str, length: int = 5) -> str:
    """Extract up to `length` uppercase alphanumeric chars from name."""
    cleaned = re.sub(r"[^A-Z0-9]", "", name.upper())
    return cleaned[:length].ljust(length, "X")  # pad with X if too short


def _random_suffix(length: int = 3) -> str:
    return "".join(random.choices(_CHARS, k=length))


def generate_unique_referral_code(name: str, max_attempts: int = 10) -> str:
    """
    Generate a unique 8-char referral code.
    Format: <5-char name prefix><3-char random suffix>
    Retries up to max_attempts on collision.
    """
    db = get_db()
    prefix = _clean_name_prefix(name)

    for _ in range(max_attempts):
        code = prefix + _random_suffix()
        result = db.table("users").select("id").eq("referral_code", code).execute()
        if not result.data:
            return code

    # Fallback: fully random 8-char code
    for _ in range(max_attempts):
        code = "".join(random.choices(_CHARS, k=8))
        result = db.table("users").select("id").eq("referral_code", code).execute()
        if not result.data:
            return code

    raise RuntimeError("Could not generate a unique referral code after max attempts")


def get_referral_count(referral_code: str) -> int:
    db = get_db()
    result = db.table("referrals").select("id", count="exact").eq("referrer_code", referral_code).execute()
    return result.count or 0


def is_valid_referral_code(code: str) -> tuple[bool, str | None]:
    """Returns (is_valid, referrer_name)."""
    db = get_db()
    result = db.table("users").select("name").eq("referral_code", code).execute()
    if result.data:
        return True, result.data[0]["name"]
    return False, None
