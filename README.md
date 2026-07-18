# Cargo Dangerous Goods - NOTOC Test Automation

This project provides automated end-to-end and API and UI testing for the Cargo Dangerous Goods system (NOTOC) using [Playwright](https://playwright.dev/) and [Allure](https://docs.qameta.io/allure/) for reporting.

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- [Allure Commandline](https://docs.qameta.io/allure/#_installing_a_commandline) (for viewing reports)

## Project Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/AAInternal/cgodangergds-test-automation.git
   cd cgodangergds-test-automation
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables as needed (see `.env` or your CI setup).

## Running Tests

### Run All Tests
```sh
npx playwright test
```

### Run All Tests with Allure Report Generation
```sh
npm run test:allure
```

### Clean, Run All Tests and Regenerate Allure Reports
```sh
npm run test:allure-delete-generate
```

### Run a Single Test File
```sh
npx playwright test tests/notoc/NtmParse.api.spec.js
```

### Run Tests in Parallel
Playwright runs tests in parallel by default. To control workers:
```sh
npx playwright test --workers=4
```

### Run Tests by Tag
Use `--grep` to filter by tag (e.g., `@sanity`, `@regression`):
```sh
npx playwright test --grep @sanity
npx playwright test --grep @regression
```

### Run Tests by Project
Projects are defined in `playwright.config.js` (e.g., 'UI only', 'API only'):
```sh
npx playwright test --project="UI only - Test Suite | Chrome Browser"
npx playwright test --project="API only - Test Suite"
```

### Run Tests with Custom Environment Variables
```sh
ENV=nonprod npx playwright test
```
Or in PowerShell:
```powershell
$env:ENV="nonprod"; npx playwright test
```

### Open Playwright HTML Report
```sh
npx playwright show-report
```

### Open Allure Report
After running tests with Allure output:

#### Generate Allure Report (HTML)
```sh
allure generate --clean --single-file allure-results -o allure-report
```


## Folder Structure
- `tests/` - Test specs (API, UI, examples)
- `pages/` - Page Object Models
- `playwright-report/` - Playwright's built-in HTML report (auto-generated)
- `data/` - Test data files
- `allure-results/` - Allure raw results (auto-generated)
- `allure-report/` - Allure HTML report (auto-generated)
- `playwright-report/` - Playwright's built-in HTML report (auto-generated)

## Additional Resources
- [Playwright Test Docs](https://playwright.dev/docs/intro)
- [Allure Docs](https://docs.qameta.io/allure/)


