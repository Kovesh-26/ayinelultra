@echo off
echo Pushing changes to GitHub...
cd /d D:\AYINEL
git add .
git commit -m "feat: Complete KidZone implementation with full safety features"
git push origin main
echo Done! Press any key to exit.
pause
