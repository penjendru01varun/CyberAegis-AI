import hashlib
import hmac
import time
import uuid
from typing import Dict


SALT = "hybershield_v1_secure_salt_2026"


def sha256_hash(data: str) -> str:
    """Produce a deterministic SHA-256 hex digest from a string."""
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def build_device_fingerprint(
    ip_address: str,
    device_headers: Dict[str, str],
    screen_resolution: str,
    timezone: str,
    language: str,
    platform: str,
) -> str:
    """
    Creates a unique, cross-session device fingerprint by hashing
    stable device characteristics together.
    """
    # Use only the /24 subnet of the IP to tolerate NAT/VPN changes
    ip_prefix = ".".join(ip_address.split(".")[:3])
    header_keys = "|".join(sorted(device_headers.keys()))

    raw = f"{SALT}:{ip_prefix}:{header_keys}:{screen_resolution}:{timezone}:{language}:{platform}"
    return sha256_hash(raw)[:32]


def build_attacker_fingerprint(
    ip: str,
    user_agent: str,
    session_id: str,
) -> str:
    """
    Generates a short attacker fingerprint from network identity signals.
    Intentionally less stable than device fingerprints to catch session-hoppers.
    """
    raw = f"{SALT}:atk:{ip}:{user_agent}:{session_id[:8]}"
    return sha256_hash(raw)[:20]


def new_visitor_id() -> str:
    """Issue a unique visitor UUID (non-reversible)."""
    return f"vid_{uuid.uuid4().hex[:16]}"


def new_orchestration_id() -> str:
    return f"orch_{uuid.uuid4().hex}"
