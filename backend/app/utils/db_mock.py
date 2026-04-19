import sqlite3
import json
import os
import logging
from typing import Optional, Dict, Any

# Simple File-based SQLite for persistent demo state
DB_PATH = "hybershield_demo.db"
logger = logging.getLogger("db_mock")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # User Behavioral Profiles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_profiles (
        user_id TEXT PRIMARY KEY,
        avg_transaction_value REAL,
        frequent_locations TEXT,
        trusted_devices TEXT,
        risk_segment TEXT DEFAULT 'LOW',
        is_vulnerable BOOLEAN DEFAULT 0
    )
    """)
    
    # Attacker Fingerprints
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attacker_fingerprints (
        fingerprint TEXT PRIMARY KEY,
        hit_count INTEGER DEFAULT 0,
        last_seen TIMESTAMP,
        scan_velocity REAL,
        known_bot BOOLEAN DEFAULT 0
    )
    """)
    
    # Transaction History (for Blast Radius)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transaction_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        amount REAL,
        decision TEXT,
        risk_score INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Seed some data if empty
    cursor.execute("SELECT COUNT(*) FROM user_profiles")
    if cursor.fetchone()[0] == 0:
        seed_data = [
            ("user_demo_123", 5000.0, '["Mumbai", "Pune"]', '["fp_abc"]', "LOW", 0),
            ("user_elderly_456", 12000.0, '["Delhi"]', '["fp_elder_1"]', "MEDIUM", 1),
            ("user_high_net_789", 150000.0, '["Bangalore", "Dubai"]', '["fp_premium"]', "LOW", 0)
        ]
        cursor.executemany("INSERT INTO user_profiles VALUES (?,?,?,?,?,?)", seed_data)
        conn.commit()
    
    conn.close()

def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM user_profiles WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            profile = dict(row)
            profile["frequent_locations"] = json.loads(profile["frequent_locations"])
            profile["trusted_devices"] = json.loads(profile["trusted_devices"])
            return profile
    except Exception as e:
        logger.error(f"DB Error: {e}")
    return None

def update_attacker_signal(fingerprint: str, scan_velocity: float, is_bot: bool):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO attacker_fingerprints (fingerprint, hit_count, last_seen, scan_velocity, known_bot)
        VALUES (?, 1, CURRENT_TIMESTAMP, ?, ?)
        ON CONFLICT(fingerprint) DO UPDATE SET
            hit_count = hit_count + 1,
            last_seen = CURRENT_TIMESTAMP,
            scan_velocity = ?,
            known_bot = ?
        """, (fingerprint, scan_velocity, is_bot, scan_velocity, is_bot))
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"DB Error: {e}")

def get_attacker_history(fingerprint: str) -> Optional[Dict[str, Any]]:
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM attacker_fingerprints WHERE fingerprint = ?", (fingerprint,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None
    except Exception as e:
        logger.error(f"DB Error: {e}")
    return None

def log_transaction(user_id, amount, decision, risk_score):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO transaction_logs (user_id, amount, decision, risk_score) VALUES (?,?,?,?)",
                       (user_id, amount, decision, risk_score))
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"DB Error: {e}")
