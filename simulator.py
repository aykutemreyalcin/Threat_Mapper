import random
from datetime import datetime

attack_types = ["Port Scan", "Brute Force Login", "DDoS Attack", "SQL Injection", "XSS Attempt", "Malware Upload"]
ports = [21, 22, 23, 80, 443, 3306, 8080, 3389, 5900, 27017]
usernames = ["admin", "root", "user", "test", "guest", "backup", "oracle", "mysql"]
attack_verbs = ["scanning", "attempting", "probing", "targeting", "breaching", "exploiting"]
severity_levels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

def generate_fake_attack():
    attack_type = random.choice(attack_types)
    ip = ".".join(str(random.randint(1, 255)) for _ in range(4))
    severity = random.choice(severity_levels)
    verb = random.choice(attack_verbs)

    if attack_type == "Port Scan":
        port = random.choice(ports)
        detail = f"{verb} port {port}"
    elif attack_type == "Brute Force Login":
        username = random.choice(usernames)
        success = random.choice([True, False, False])
        result = "SUCCESS" if success else "FAIL"
        detail = f"{verb} login as '{username}' → {result}"
    elif attack_type == "DDoS Attack":
        detail = f"{verb} with {random.randint(100,10000)} requests/sec"
    elif attack_type == "SQL Injection":
        detail = f"{verb} vulnerable endpoint"
    elif attack_type == "XSS Attempt":
        detail = f"{verb} reflected XSS"
    else:
        detail = f"{verb} file upload vulnerability"

    return {
        "ip": ip,
        "type": attack_type,
        "detail": detail,
        "severity": severity,
        "time": datetime.now().strftime("%H:%M:%S")
    }
