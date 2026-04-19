# 🚀 CIPHER BREAKERS | Technoverse Hackathon 2026

<p align="center">
  <img src="assets/banner.png" width="100%" alt="HyberShield AI Banner">
</p>

<div align="center">

# 🌌 HyberShield AI
### 3-Layer Proactive UPI Fraud Prevention System

[![Sub-250ms Decisions](https://img.shields.io/badge/Speed-%3C250ms-00D4FF?style=for-the-badge&logo=fastapi)](https://github.com/penjendru01varun/CyberAegis-AI)
[![Multi-Agent](https://img.shields.io/badge/Architecture-7_Agents-2B6EF0?style=for-the-badge&logo=google-gemini)](https://github.com/penjendru01varun/CyberAegis-AI)
[![Fraud Reduction](https://img.shields.io/badge/Loss_Reduction-40%25-F24E5E?style=for-the-badge&logo=shield)](https://github.com/penjendru01varun/CyberAegis-AI)

**Presented to Cognizant Technoverse Hackathon 2026**

</div>

---

## 📌 1. Problem Statement: India's UPI Crisis
UPI transaction volumes are skyrocketing, but so is fraud. Current systems suffer from high latency, high false positives, and a purely reactive approach.
- 🔴 **Lag:** 4-6 minute detection delay.
- 🔴 **False Positives:** 34% legitimate transactions blocked.
- 🔴 **Elderly Impact:** Coercion scams disproportionately target vulnerable users.

## 💡 2. Our Solution: 3-Layer Architecture
HyberShield AI introduces a proactive defense mechanism that stops fraud before it even starts.

| Layer | Component | Description |
| :--- | :--- | :--- |
| **🔍 VeraShield** | **Pre-Attack Intelligence** | Uses GhostNet to trap scanners and capture attacker fingerprints before they strike. |
| **⚡ FraudShield** | **Real-Time Scoring** | Contextual risk analysis with sub-250ms decision latency. |
| **🛡️ ElderShield** | **Human-Centric Safety** | Protected holds, family alerts, and specialized UX for elderly users. |

---

## 🤖 3. Multi-Agent Intelligence System
We use **7 specialized agents** orchestrated via LangGraph to provide comprehensive protection.

| Agent | Function | Strategic Value |
| :--- | :--- | :--- |
| 👻 **GhostNet** | Decoy Accounts | Detects reconnaissance scanning early. |
| 🖥️ **Fingerprint** | Session Tracking | Builds unique attacker IDs across IPs. |
| 💥 **BlastRadius** | Predictive Analysis | Forecasts potential target victims. |
| 📡 **ReconSignal** | Anomaly Detection | Detects "low-and-slow" scanning patterns. |
| ⚙️ **RiskEngine** | Weighted Scoring | Computes real-time risk scores (0-100). |
| 🛡️ **ElderShield** | Safety Guard | Implements coaching and intervention for vulnerable users. |
| 🎙️ **VoiceGuard** | Audio Analysis | Detects deepfake/synthetic voice artifacts in KYC. |

---

## 🏗️ 4. System Architecture
```mermaid
graph TD
    User((User/Fraudster)) --> Frontend[React + Three.js Dashboard]
    Frontend --> API[FastAPI Orchestrator]
    
    subgraph Layers
        Layer1[VeraShield: Pre-Attack]
        Layer2[FraudShield: Real-Time]
        Layer3[ElderShield: Intervention]
    end
    
    API --> Layer1
    API --> Layer2
    API --> Layer3
    
    subgraph AI Agents
        A1[GhostNet]
        A2[Fingerprint]
        A3[BlastRadius]
        A4[RiskEngine]
    end
    
    Layer1 --> A1 & A2
    Layer2 --> A3 & A4
    
    API --> DB[(PostgreSQL / Neo4j)]
```

---

## 🛠️ 5. Technology Stack
<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white)

</div>

---

## 👥 6. Team CIPHER BREAKERS
| Member | Role |
| :--- | :--- |
| **Penjendru Varun** | Lead Developer & AI Orchestration |
| **Mozhivarman** | AI/ML Architect |
| **Keshika** | Frontend & UX Design |
| **Varsha Shree** | Security & Analytics |

---

<div align="center">
  <p>© 2026 CIPHER BREAKERS — All Rights Reserved</p>
  <sub>Stop fraud before it reaches users.</sub>
</div>
