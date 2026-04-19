import re
from typing import List, Tuple

# Known bot fingerprint signals ───────────────────────────────────────────────
BOT_USER_AGENT_PATTERNS = [
    r"python-requests",
    r"curl/",
    r"wget/",
    r"scrapy",
    r"phantomjs",
    r"headlesschrome",
    r"selenium",
    r"puppeteer",
    r"playwright",
    r"go-http-client",
    r"okhttp",
    r"apache-httpclient",
]

KNOWN_GHOST_PREFIXES = [
    "ghost_", "decoy_", "trap_", "honeypot_"
]

SCAN_VELOCITY_THRESHOLD = 50   # requests/minute → attacker
LOW_SLOW_THRESHOLD      = 8    # requests/minute → low-and-slow
SEQUENTIAL_WINDOW       = 5    # consecutive UPI IDs = sequential scan


def is_bot(user_agent: str) -> Tuple[bool, float]:
    """Return (is_bot, likelihood 0-1) based on User-Agent string."""
    ua_lower = user_agent.lower()
    matched = [p for p in BOT_USER_AGENT_PATTERNS if re.search(p, ua_lower)]
    if matched:
        return True, min(1.0, 0.6 + len(matched) * 0.15)
    return False, 0.05


def classify_scan_pattern(scan_velocity: int, upi_id: str) -> str:
    """Return a human-readable scan pattern label."""
    is_ghost = any(upi_id.startswith(p) for p in KNOWN_GHOST_PREFIXES)
    if scan_velocity > SCAN_VELOCITY_THRESHOLD:
        return "automated_bulk_scan"
    elif scan_velocity > LOW_SLOW_THRESHOLD:
        return "medium_velocity_scan"
    elif is_ghost:
        return "targeted_ghost_probe"
    else:
        return "manual_lookup"


def detect_sequential_scan(patterns: List[str]) -> bool:
    """
    Returns True if the lookup list shows sequential UPI phone numbers.
    Converts trailing 10-digit numbers and checks for runs ≥ SEQUENTIAL_WINDOW.
    """
    numbers = []
    for p in patterns:
        digits = re.sub(r"[^0-9]", "", p)
        if digits:
            try:
                numbers.append(int(digits[-10:]))
            except ValueError:
                pass
    if len(numbers) < SEQUENTIAL_WINDOW:
        return False
    numbers.sort()
    run = 1
    for i in range(1, len(numbers)):
        if numbers[i] - numbers[i - 1] == 1:
            run += 1
            if run >= SEQUENTIAL_WINDOW:
                return True
        else:
            run = 1
    return False


def detect_dictionary_attack(patterns: List[str]) -> bool:
    """Detect dictionary-style UPI handle probing (common words/names)."""
    common_handles = {"rahul", "priya", "amit", "raj", "sunita", "anil", "pooja"}
    handles = set()
    for p in patterns:
        at = p.split("@")
        if at:
            handles.add(at[0].lower())
    return len(handles & common_handles) >= 3


def classify_recon_signal(
    count: int, window_seconds: int, patterns: List[str]
) -> Tuple[str, float]:
    """
    Returns (signal_type, anomaly_score 0-100).
    Uses z-score heuristics against expected baseline (~2 lookups/60s per IP).
    """
    baseline_rate = 2 / 60  # lookups per second
    actual_rate = count / max(window_seconds, 1)
    z = (actual_rate - baseline_rate) / max(baseline_rate * 0.5, 0.001)

    if detect_sequential_scan(patterns):
        return "sequential_numeric_scan", min(95.0, 60 + z * 5)
    elif detect_dictionary_attack(patterns):
        return "dictionary_name_attack", min(90.0, 55 + z * 4)
    elif actual_rate > SCAN_VELOCITY_THRESHOLD / 60:
        return "high_velocity_bulk_scan", min(98.0, 70 + z * 3)
    elif 2.5 < z <= 10:
        return "medium_anomaly", min(70.0, 30 + z * 4)
    elif z > 10:
        return "low_and_slow_recon", min(80.0, 40 + z * 2)
    else:
        return "normal_activity", max(0.0, z * 5)


def predict_blast_targets(
    fingerprint: str, scan_pattern: List[str], targeted_pattern: str
) -> Tuple[List[str], List[float]]:
    """
    Simulates target prediction using the attacker's scan pattern.
    In production this queries the PostgreSQL user database.
    """
    import hashlib
    seed = int(hashlib.md5(fingerprint.encode()).hexdigest()[:8], 16)

    # Simulate 5 predicted user IDs with confidence scores
    targets = [f"user_{(seed + i * 7) % 9999:04d}" for i in range(5)]
    confidences = [round(0.95 - i * 0.07, 2) for i in range(5)]
    return targets, confidences
