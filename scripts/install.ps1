# OpenHole install script (PowerShell)
# Usage: irm https://openhole.dev/install.ps1 | iex
# Pin version: $env:OPENHOLE_VERSION='v0.2.0'; irm https://openhole.dev/install.ps1 | iex

$ErrorActionPreference = "Stop"

$Repo = "bablilayoub/openhole"
$InstallDir = if ($env:INSTALL_DIR) { $env:INSTALL_DIR } else { "$env:LOCALAPPDATA\Programs\openhole" }

function Get-Arch {
    switch ($env:PROCESSOR_ARCHITECTURE) {
        "AMD64" { return "amd64" }
        "ARM64" { return "arm64" }
        default { throw "Unsupported architecture: $($env:PROCESSOR_ARCHITECTURE)" }
    }
}

function Verify-Checksum {
    param(
        [string]$File,
        [string]$Binary,
        [string]$ChecksumsUrl
    )
    try {
        $checksums = Invoke-WebRequest -Uri $ChecksumsUrl -UseBasicParsing
    } catch {
        Write-Host "Warning: checksums.txt not found — skipping verification"
        return
    }
    $expected = ($checksums.Content -split "`n" | Where-Object { $_ -match " $([regex]::Escape($Binary))$" } | Select-Object -First 1) -replace '\s+.*$', ''
    if (-not $expected) {
        Write-Host "Warning: no checksum entry for $Binary — skipping verification"
        return
    }
    $actual = (Get-FileHash -Path $File -Algorithm SHA256).Hash.ToLower()
    if ($expected -ne $actual) {
        throw "Checksum mismatch for $Binary`n  expected: $expected`n  actual:   $actual"
    }
    Write-Host "✓ Checksum verified"
}

Write-Host "OpenHole install script"
Write-Host ""

$Arch = Get-Arch
$Version = if ($env:OPENHOLE_VERSION) { $env:OPENHOLE_VERSION } else { "latest" }
$Binary = "openhole-windows-$Arch.exe"

if ($Version -eq "latest") {
    $BaseUrl = "https://github.com/$Repo/releases/latest/download"
} else {
    $BaseUrl = "https://github.com/$Repo/releases/download/$Version"
}

$Url = "$BaseUrl/$Binary"
$ChecksumsUrl = "$BaseUrl/checksums.txt"

Write-Host "Downloading $Url..."
$Tmp = Join-Path $env:TEMP "openhole-install.exe"
Invoke-WebRequest -Uri $Url -OutFile $Tmp -UseBasicParsing

Verify-Checksum -File $Tmp -Binary $Binary -ChecksumsUrl $ChecksumsUrl

New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
$Dest = Join-Path $InstallDir "openhole.exe"
Copy-Item -Force $Tmp $Dest
Remove-Item $Tmp

$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$InstallDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$UserPath;$InstallDir", "User")
    $env:Path = "$env:Path;$InstallDir"
}

Write-Host "✓ Installed to $Dest"
Write-Host "  Run: openhole 3000"
Write-Host "  Restart your terminal if openhole is not found."
