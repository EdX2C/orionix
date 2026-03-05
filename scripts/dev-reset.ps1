param(
    [int]$Port = 3000
)

$ErrorActionPreference = 'SilentlyContinue'

Write-Host "[dev-reset] Closing stale Next.js dev processes..."

# Kill any node process running `next dev` for this workspace.
$workspace = (Get-Location).Path
$nextDevProcesses = Get-CimInstance Win32_Process |
    Where-Object {
        $_.Name -eq 'node.exe' -and
        $_.CommandLine -match 'next\\dist\\bin\\next"?\s+dev' -and
        $_.CommandLine -match [regex]::Escape($workspace)
    }

foreach ($proc in $nextDevProcesses) {
    Stop-Process -Id $proc.ProcessId -Force
}

# If something still owns the target port, kill it as well.
$portOwners = Get-NetTCPConnection -LocalPort $Port -State Listen |
    Select-Object -ExpandProperty OwningProcess -Unique

foreach ($owner in $portOwners) {
    Stop-Process -Id $owner -Force
}

# Remove stale Next lock file if present.
$lockPath = Join-Path $workspace '.next\dev\lock'
if (Test-Path $lockPath) {
    Remove-Item $lockPath -Force
}

Start-Sleep -Milliseconds 500

Write-Host "[dev-reset] Starting fresh dev server on port $Port..."
& npm run dev -- --port $Port
