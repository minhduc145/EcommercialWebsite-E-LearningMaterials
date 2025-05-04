# Chuyển đến thư mục chứa script
Set-Location -Path $PSScriptRoot

# Chạy gradlew bootRun
./gradlew bootRun

# Dừng lại để xem kết quả
Read-Host -Prompt "Nhấn Enter để thoát"
