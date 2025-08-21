@echo off
cd /d C:\Projects\Playwright
npx playwright test tests/specs/login.spec.ts --project=chromium --headed
