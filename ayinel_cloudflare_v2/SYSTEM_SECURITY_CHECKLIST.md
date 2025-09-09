# System Security Checklist - Virus & Malware Protection

## 🛡️ Immediate Security Checks

### 1. Windows Defender (Built-in Protection)

```powershell
# Check Windows Defender status
Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled, BehaviorMonitorEnabled, OnAccessProtectionEnabled

# Run a quick scan
Start-MpScan -ScanType QuickScan

# Run a full scan (takes longer)
Start-MpScan -ScanType FullScan
```

### 2. Windows Security Center

- Press `Windows + I` → Update & Security → Windows Security
- Check all protection areas are green:
  - ✅ Virus & threat protection
  - ✅ Account protection
  - ✅ Firewall & network protection
  - ✅ App & browser control
  - ✅ Device security
  - ✅ Device performance & health

### 3. Task Manager Analysis

- Press `Ctrl + Shift + Esc`
- Check for suspicious processes:
  - High CPU usage from unknown programs
  - Multiple instances of the same process
  - Processes with random names
  - Processes using excessive memory

### 4. Startup Programs Check

```powershell
# Check startup programs
Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location

# Or use Task Manager → Startup tab
```

## 🔍 Advanced Security Tools

### 5. Malwarebytes (Free Version)

- Download from: https://www.malwarebytes.com/
- Install and run full scan
- Remove any detected threats

### 6. AdwCleaner (Free)

- Download from: https://www.malwarebytes.com/adwcleaner
- Run scan for adware and PUPs (Potentially Unwanted Programs)

### 7. HitmanPro (Free Trial)

- Download from: https://www.hitmanpro.com/
- Cloud-based scanning for advanced threats

## 🚨 Suspicious Activity Indicators

### Check for:

- **Unexpected pop-ups or ads**
- **Browser redirects**
- **Slow system performance**
- **Unknown network activity**
- **Files appearing/disappearing**
- **Antivirus disabled without permission**
- **Strange emails sent from your account**

### Network Activity Check:

```powershell
# Check active network connections
netstat -an | findstr ESTABLISHED

# Check for suspicious outbound connections
netstat -an | findstr :80
netstat -an | findstr :443
```

## 🛠️ System Hardening

### 8. Windows Updates

```powershell
# Check for updates
Get-WindowsUpdate

# Install updates
Install-WindowsUpdate -AcceptAll
```

### 9. Firewall Configuration

```powershell
# Check firewall status
Get-NetFirewallProfile | Select-Object Name, Enabled

# Enable firewall for all profiles
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

### 10. User Account Control (UAC)

- Ensure UAC is enabled
- Set to "Always notify" for maximum security

## 🔧 Development Environment Security

### 11. Node.js Security

```bash
# Check for vulnerable packages
npm audit

# Fix vulnerabilities
npm audit fix

# Update packages
npm update
```

### 12. Git Security

```bash
# Check git configuration
git config --list

# Verify remote URLs
git remote -v
```

### 13. Environment Variables

- Check `.env` files for sensitive data
- Never commit API keys or passwords
- Use environment variables for secrets

## 📋 Quick Security Commands

### Run these in PowerShell as Administrator:

```powershell
# 1. System File Checker
sfc /scannow

# 2. DISM Health Check
DISM /Online /Cleanup-Image /CheckHealth

# 3. Check Windows Defender
Get-MpComputerStatus

# 4. Check for suspicious services
Get-Service | Where-Object {$_.Status -eq "Running"} | Select-Object Name, DisplayName, StartType

# 5. Check scheduled tasks
Get-ScheduledTask | Where-Object {$_.State -eq "Ready"} | Select-Object TaskName, TaskPath
```

## 🚨 Emergency Response

### If Malware is Detected:

1. **Disconnect from internet** immediately
2. **Run Windows Defender offline scan**
3. **Boot in Safe Mode** if needed
4. **Use multiple antivirus tools** for confirmation
5. **Reset passwords** for all accounts
6. **Monitor bank accounts** for suspicious activity
7. **Consider system restore** to clean state

## 🔒 Prevention Best Practices

### Daily Habits:

- ✅ Keep Windows updated
- ✅ Use strong, unique passwords
- ✅ Enable 2FA on all accounts
- ✅ Don't click suspicious links
- ✅ Don't download from untrusted sources
- ✅ Regular backups of important data

### For Development:

- ✅ Use virtual environments
- ✅ Keep dependencies updated
- ✅ Use HTTPS for all connections
- ✅ Validate all user inputs
- ✅ Regular security audits

## 📞 Additional Resources

- **Microsoft Security**: https://www.microsoft.com/security
- **Windows Defender**: Built into Windows 10/11
- **Malwarebytes**: https://www.malwarebytes.com/
- **VirusTotal**: https://www.virustotal.com/ (for file scanning)

## ✅ Security Status Check

After running these checks, your system should be:

- ✅ Windows Defender active and updated
- ✅ No suspicious processes running
- ✅ No unauthorized network connections
- ✅ All security updates installed
- ✅ Firewall properly configured
- ✅ UAC enabled
- ✅ No malware detected by multiple scanners

---

**Note**: This checklist provides comprehensive protection. Run these checks regularly and after any suspicious activity. If you find malware, consider consulting with a cybersecurity professional.
