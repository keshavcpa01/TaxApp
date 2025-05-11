from datetime import datetime
from pathlib import Path
import shutil

# Define source and destination
source = Path(".github/workflows/generate-env-example.yml")
backup_dir = Path(".github/backups")
timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
backup_file = backup_dir / f"generate-env-example-{timestamp}.yml"

# Check source exists
if not source.exists():
    print("❌ Source workflow file not found.")
    exit(1)

# Ensure backup directory exists
backup_dir.mkdir(parents=True, exist_ok=True)

# Copy file
shutil.copy2(source, backup_file)
print(f"✅ Backup saved to: {backup_file}")
