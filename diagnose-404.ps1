# 404 Error Diagnostic Script
# Run this to help identify what's causing the 404 error

Write-Host "🔍 ogDoc 404 Error Diagnostic Tool" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check Backend Health
Write-Host "1️⃣  Testing Backend Health..." -ForegroundColor Yellow
try {
    $backendHealth = Invoke-RestMethod -Uri "https://ogdoc.onrender.com/health" -Method Get -TimeoutSec 10
    if ($backendHealth.status -eq "ok") {
        Write-Host "   ✅ Backend is healthy!" -ForegroundColor Green
        Write-Host "   Response: $($backendHealth | ConvertTo-Json -Compress)" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  Backend returned unexpected response" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Backend health check failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Check Backend Root
Write-Host "2️⃣  Testing Backend Root Endpoint..." -ForegroundColor Yellow
try {
    $backendRoot = Invoke-RestMethod -Uri "https://ogdoc.onrender.com/" -Method Get -TimeoutSec 10
    Write-Host "   ✅ Backend root accessible!" -ForegroundColor Green
    Write-Host "   Response: $($backendRoot | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Backend root failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Check Frontend
Write-Host "3️⃣  Testing Frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "https://ogdoc-1.onrender.com/" -Method Get -TimeoutSec 10
    Write-Host "   ✅ Frontend is accessible!" -ForegroundColor Green
    Write-Host "   Status Code: $($frontendResponse.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Frontend failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Check if local dev server is running
Write-Host "4️⃣  Checking Local Development Server..." -ForegroundColor Yellow
try {
    $localResponse = Invoke-WebRequest -Uri "http://localhost:5173/" -Method Get -TimeoutSec 2
    Write-Host "   ✅ Local dev server is running on port 5173" -ForegroundColor Green
    Write-Host "   💡 You might be testing locally - make sure to rebuild after changes!" -ForegroundColor Cyan
} catch {
    Write-Host "   ℹ️  Local dev server not running (this is OK if testing production)" -ForegroundColor Gray
}
Write-Host ""

# Test 5: Check Git Status
Write-Host "5️⃣  Checking Git Status..." -ForegroundColor Yellow
$gitStatus = git status --short
if ([string]::IsNullOrWhiteSpace($gitStatus)) {
    Write-Host "   ✅ No uncommitted changes" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
}
Write-Host ""

# Test 6: Check last commit
Write-Host "6️⃣  Last Git Commit..." -ForegroundColor Yellow
$lastCommit = git log -1 --oneline
Write-Host "   $lastCommit" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 Summary & Next Steps:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you're seeing 404 errors, please provide:" -ForegroundColor White
Write-Host "1. The EXACT URL showing the 404 (from browser console)" -ForegroundColor White
Write-Host "2. Are you testing LOCALLY or on PRODUCTION?" -ForegroundColor White
Write-Host "3. Screenshot of the browser console error" -ForegroundColor White
Write-Host ""
Write-Host "Common Issues:" -ForegroundColor Yellow
Write-Host "• Testing locally without rebuilding: Run 'npm run dev' in frontend folder" -ForegroundColor Gray
Write-Host "• Render still deploying: Wait 2-3 minutes after git push" -ForegroundColor Gray
Write-Host "• Browser cache: Hard refresh with Ctrl+Shift+R" -ForegroundColor Gray
Write-Host "• Missing favicon: This is harmless, just a warning" -ForegroundColor Gray
Write-Host ""
