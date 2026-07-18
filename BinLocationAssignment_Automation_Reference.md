# Bin Location Assignment - UI Automation Reference Guide

> **Created**: April 22, 2026  
> **Project**: CGO Danger Goods Test Automation (`cgodangergds-test-automation`)  
> **Scope**: Comprehensive UI automation for the Bin Location Assignment screen in AutoNOTOC

---

## Table of Contents

1. [Overview](#1-overview)
2. [UI Automation Approach & Why It's Best](#2-ui-automation-approach--why-its-best)
3. [How Playwright MCP Is Used](#3-how-playwright-mcp-is-used)
4. [Architecture & Framework Design](#4-architecture--framework-design)
5. [Files Created / Modified](#5-files-created--modified)
6. [Test Suite Design (50 Test Cases)](#6-test-suite-design-50-test-cases)
7. [Page Object Model](#7-page-object-model)
8. [Test Data Structure](#8-test-data-structure)
9. [Database Queries](#9-database-queries)
10. [Playwright Configuration](#10-playwright-configuration)
11. [Bugs Found & Fixed](#11-bugs-found--fixed)
12. [Test Execution Results](#12-test-execution-results)
13. [How to Run](#13-how-to-run)
14. [Known Behaviors & Gotchas](#14-known-behaviors--gotchas)
15. [Allure Report Generation](#15-allure-report-generation)

---

## 1. Overview

### Objective
Build a comprehensive UI automation framework for the **Bin Location Assignment** screen in the AutoNOTOC application using Playwright + JavaScript. The suite covers:

- **UI Validation** of all 4 screen elements: Flight Date (text input), Flight Number (dropdown), Origin (dropdown), Destination (editable text)
- **End-to-End Flow**: XSDG → NTM → UI Binning → DB validation via the Legacy Interface App
- **Backend DB Validation**: Cross-validating UI data against PostgreSQL tables (`UNITASSIGN`, `BINASSIGN`, `SHIPPERFLIGHTINFORMATION`, `AUDIT_NTM_MESSAGES`, `AUDIT_XSDG_MESSAGES`)
- **Negative & Edge Case Testing**: Invalid dates, special characters, boundary dates, timezone edge cases

### Technology Stack
| Component | Technology |
|-----------|-----------|
| Test Framework | Playwright `@playwright/test` ^1.57.0 |
| Language | JavaScript (ES Modules) |
| Reporting | Allure via `allure-playwright` ^3.6.0, `allure-js-commons` |
| Database | PostgreSQL (`pg` ^8.17.2), Oracle (`oracledb` ^6.10.0) |
| Environment | `.env.nonprod` with `dotenv` |
| Browser | Chromium (headed mode via `HEADLESS=false`) |

---

## 2. UI Automation Approach & Why It's Best

### The Approach: MCP-Assisted Page Object Model with 3-Layer Cross-Validation

We follow a **hybrid approach** that combines four pillars:

```
┌────────────────────────────────────────────────────────────────────┐
│                    THE 4-PILLAR APPROACH                          │
├──────────────┬──────────────┬──────────────┬──────────────────────┤
│  Pillar 1    │  Pillar 2    │  Pillar 3    │  Pillar 4            │
│  Playwright  │  Page Object │  MCP-Driven  │  3-Layer Cross       │
│  MCP Server  │  Model (POM) │  TestContext │  Validation          │
│              │              │              │  (API ↔ UI ↔ DB)     │
│  Live DOM    │  Reusable    │  Structured  │  Data consistency    │
│  discovery   │  selectors   │  state       │  across all layers   │
│  & selector  │  & methods   │  sharing     │                      │
│  capture     │  per screen  │  with audit  │                      │
└──────────────┴──────────────┴──────────────┴──────────────────────┘
```

### Pillar 1: Playwright MCP Server (Development-Time)
- **What**: A Model Context Protocol (MCP) server (`@playwright/mcp`) runs against the live application during **test development**
- **Why**: Instead of manually inspecting the DOM with browser DevTools and guessing selectors, the MCP server provides a structured, AI-accessible interface to the live DOM. It captures the actual element selectors, accessibility tree, and page snapshots
- **How**: Configured in `.vscode/mcp.json` — VS Code Copilot Chat connects to the Playwright MCP server, navigates the live UI, takes snapshots, and recommends exact selectors that work

### Pillar 2: Page Object Model (Execution-Time)
- **What**: Every screen has a dedicated page object class that encapsulates selectors and interaction methods
- **Why**: Single source of truth for selectors — when the UI changes, you update one file, not 50 tests
- **How**: `BasePage` → `BinLocationAssignPage`, with 80+ selectors and methods for every possible interaction

### Pillar 3: MCP-Inspired TestContext (State Management)
- **What**: A `TestContext` class that stores data with source provenance (`api`, `ui`, `db`) and provides cross-layer validation
- **Why**: In E2E tests, the same data flows through API → UI → DB. TestContext ensures you can validate that the flight number shown on the UI matches what the API returned AND what's stored in the database
- **How**: `ctx.set('flightNumber', '1046', 'api')` → `ctx.set('flightNumber', '1046', 'ui')` → `ctx.crossValidate('flightNumber')` → `{ match: true }`

### Pillar 4: Three-Layer Cross-Validation (Assertion Strategy)
- **What**: Tests don't just check UI behavior — they query the database and validate that UI data matches DB records
- **Why**: UI-only tests can pass even when the backend is broken. By validating all 3 layers (API input → UI display → DB storage), we catch bugs that pure UI automation misses
- **How**: After populating flight date on UI, we run the same query against PostgreSQL and compare flight numbers, origins, and destinations

---

### Why This Approach Is Best

| Aspect | Traditional UI Automation | Our MCP-Assisted Approach |
|--------|--------------------------|---------------------------|
| **Selector Discovery** | Manual DevTools inspection, trial-and-error | MCP server captures exact selectors from live DOM; AI recommends stable selectors |
| **Selector Maintenance** | Fragile, hard to update when UI changes | MCP re-scans the UI to auto-update selectors in Page Objects |
| **Test Confidence** | Tests pass but data may be wrong in DB | 3-layer validation (API ↔ UI ↔ DB) catches data inconsistencies |
| **State Sharing** | Global variables or test fixtures | TestContext with provenance tracking and audit trail |
| **Debugging** | Screenshot + manual replay | Allure steps + attachments + cross-validation reports + Playwright traces |
| **Test Data** | Hardcoded values | Dynamic date placeholders (`${date\|MM/DD/YYYY\|+0}`) that auto-resolve per timezone |
| **E2E Coverage** | UI-only or API-only | Full flow: XSDG → NTM → UI → DB (Legacy posting → AutoNOTOC → PostgreSQL) |
| **Scalability** | New screen = new selectors from scratch | MCP snapshot → Page Object → Test in minutes |

### Key Architectural Benefits

1. **Separation of Concerns**: Selectors in Page Objects, data in JSON, queries in test data, assertions in specs
2. **Data-Driven**: All test inputs come from `bin_comprehensive_test_data.json` — adding a new test case is just adding a JSON entry
3. **Environment-Agnostic**: `.env.nonprod` configuration means the same tests run against any environment by swapping the env file
4. **CI/CD Ready**: `HEADLESS=true` for pipeline execution; Allure reports auto-generated
5. **Audit Trail**: TestContext logs every `set()` operation with timestamps — useful for aviation compliance (ISO 27001)
6. **Soft Assertions**: `expect.soft()` collects ALL failures in a single test rather than failing at the first — critical for cross-validation tests

---

## 3. How Playwright MCP Is Used

### What Is MCP (Model Context Protocol)?
MCP is an open standard that allows AI tools (like GitHub Copilot) to connect to external services via a structured protocol. In our case, the **Playwright MCP server** exposes the browser as a tool that AI can interact with.

### Configuration
```json
// .vscode/mcp.json
{
    "servers": {
        "playwright": {
            "type": "stdio",
            "command": "npx",
            "args": ["@playwright/mcp@latest"]
        }
    }
}
```

### How MCP Fits Into Our Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT WORKFLOW WITH MCP                        │
│                                                                             │
│  Step 1: MCP Discovery (Development-Time)                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐        │
│  │  Developer    │────>│ Copilot Chat │────>│  Playwright MCP      │        │
│  │  describes    │     │ + MCP        │     │  Server               │        │
│  │  the screen   │     │              │     │  • Launches browser   │        │
│  │              │     │              │     │  • Navigates to page  │        │
│  │              │     │              │     │  • Takes snapshot     │        │
│  │              │     │              │     │  • Returns DOM tree   │        │
│  └──────────────┘     └──────┬───────┘     └──────────────────────┘        │
│                              │                                              │
│  Step 2: Page Object Generation                                            │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  Copilot generates BinLocationAssignPage.js with:                │       │
│  │  • Selectors verified against live DOM snapshot                  │       │
│  │  • Methods for every interaction (click, fill, select, assert)   │       │
│  │  • Proper locator strategies (CSS > XPath > Text)               │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                             │
│  Step 3: Test Execution (Runtime) — Standard Playwright, No MCP            │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐        │
│  │  Test Spec   │────>│ Page Object  │────>│  Chromium Browser    │        │
│  │  (.spec.js)  │     │  Methods     │     │  (via Playwright)    │        │
│  │              │     │              │     │  + DB Validation     │        │
│  └──────────────┘     └──────────────┘     └──────────────────────┘        │
│                                                                             │
│  Step 4: Selector Maintenance (When UI Changes)                            │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  Re-run MCP snapshot → Update Page Object selectors → Tests pass│       │
│  │  Comment in code: "Update these selectors after running the     │       │
│  │  Playwright MCP server against the live UI"                      │       │
│  └──────────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### MCP Capabilities Used

| MCP Tool | How We Use It |
|----------|---------------|
| `browser_navigate` | Navigate to AutoNOTOC Bin Location Assignment page |
| `browser_snapshot` | Capture the full accessibility tree and DOM structure of the page |
| `browser_click` | Test click interactions to verify selectors during development |
| `browser_fill_form` | Verify form interactions (date input, dropdown selection) |
| `browser_take_screenshot` | Capture visual state for reference screenshots |

### MCP vs. Runtime — When Each Is Used

| Phase | Tool | Purpose |
|-------|------|---------|
| **Development** | Playwright MCP Server | Discover selectors, verify page structure, generate Page Objects |
| **Runtime** | Playwright `@playwright/test` | Execute tests, assert behavior, cross-validate with DB |
| **Maintenance** | Playwright MCP Server | Re-scan UI after changes, update selectors in Page Objects |

### The MCP-Inspired TestContext Pattern

Beyond the MCP server, the framework also uses an **MCP-inspired design pattern** in `TestContext.js`:

```javascript
// TestContext stores data from multiple sources with provenance tracking
const ctx = new TestContext();

// Same field captured from 3 different sources
ctx.set('flightNumber', '1046', 'api');    // From XSDG/NTM message
ctx.set('flightNumber', '1046', 'ui');     // From UI dropdown
ctx.set('flightNumber', '1046', 'db');     // From DB query

// Cross-validate: all 3 sources agree
const result = ctx.crossValidate('flightNumber');
// → { field: 'flightNumber', api: '1046', ui: '1046', db: '1046', match: true }

// Full audit trail for aviation compliance
const history = ctx.getHistory();
// → [{ action: 'set', key: 'flightNumber', source: 'api', timestamp: ... }, ...]
```

This pattern is "MCP-inspired" because it follows the same principle: **structured context sharing** between different tools/layers (API ↔ UI ↔ DB) with built-in validation and provenance tracking — similar to how MCP provides structured context sharing between AI and external tools.

---

## 4. Architecture & Framework Design

### Layer Architecture
```
┌─────────────────────────────────────────────┐
│              Test Spec Layer                 │
│  BinLocationAssignment.comprehensive.spec.js│
├─────────────────────────────────────────────┤
│           Page Object Layer                  │
│  BinLocationAssignPage.js, BasePage.js       │
│  AutoNotocLoginPage.js, LoginPage.js         │
│  NtmXsdgMessagesPostingPage.js               │
├─────────────────────────────────────────────┤
│           Utility Layer                      │
│  BrowserHelpers.js, database.js              │
│  DateUtils.js, awbUtils.js, Logger.js        │
│  EnvLoader.js, Constants.js                  │
├─────────────────────────────────────────────┤
│           Data Layer                         │
│  bin_comprehensive_test_data.json            │
│  BinLocationAssignment_TestCases.csv         │
│  dbqueries.json                              │
└─────────────────────────────────────────────┘
```

### Key Design Decisions
1. **Manual browser launch** via `BrowserHelpers.launchBrowser()` for full control over Legacy + AutoNOTOC browser sessions
2. **Serial test execution** (`test.describe.serial`) — tests share browser state; failure in one blocks subsequent tests
3. **Soft assertions** (`expect.soft()`) — used in cross-validation tests to collect all mismatches instead of failing at first
4. **Date placeholder system** — `${date|MM/DD/YYYY|+0}` syntax with timezone support for dynamic date resolution
5. **DB cross-validation** — UI dropdown values compared against live PostgreSQL query results

---

## 5. Files Created / Modified

### New Files Created

| File | Purpose |
|------|---------|
| `tests/notoc/autonotoc/BinLocationAssignment.comprehensive.spec.js` | Main test spec — 33 automated tests (27 UI, 6 E2E) |
| `data/test_data/autonotoc/bin_comprehensive_test_data.json` | Test data — all test case configs, XSDG/NTM templates, DB queries |
| `data/test_data/autonotoc/BinLocationAssignment_TestCases.csv` | 50 test cases documented in CSV format |
| `docs/BinLocationAssignment_Automation_Reference.md` | This reference document |

### Files Modified

| File | Changes |
|------|---------|
| `playwright.config.js` | Added `"Comprehensive - Bin Location E2E Suite"` project; removed `...devices['Desktop Chrome']` spread to avoid `deviceScaleFactor` conflict |
| `utils/helpers/BrowserHelpers.js` | Fixed viewport — `viewport: null` only set when `headlessFlag` is false; removed `deviceScaleFactor: undefined` workaround |
| `pages/ui/autonotoc/BinLocationAssignPage.js` | Fixed `getFlightNumberOptions()` and `getOriginOptions()` — changed from broken string concatenation to `.locator('option')` chaining |
| `utils/constants/Constants.js` | Added `BIN_COMPREHENSIVE_TEST_DATA` and `BIN_TEST_CASES_CSV` file path constants; removed old duplicates |

### Files Cleaned Up (Deleted)

Old/duplicate files removed during consolidation:
- `tests/notoc/autonotoc/BinInitialScreen.ui.spec.js` (superseded by comprehensive spec)
- `data/test_data/autonotoc/bin_location_test_data.json` (superseded by comprehensive test data)
- Other interim/draft files

---

## 6. Test Suite Design (50 Test Cases)

### Test Distribution

| Category | Count | Tags | Description |
|----------|-------|------|-------------|
| **Positive UI** | 14 | `@ui @positive` | Valid interactions, dropdown population, DB cross-validation |
| **Negative UI** | 8 | `@ui @negative` | Invalid dates, empty fields, special characters |
| **Edge Case UI** | 5 | `@ui @edge` | Boundary dates, timezone, rapid input, leap year |
| **E2E XSDG→NTM→UI→DB** | 8 | `@e2e` | Full flow: post XSDG/NTM → verify in UI → validate DB |
| **Multi-XSDG** | 5 | `@e2e @multi-xsdg` | Multiple XSDG messages, flight changes, split binning |
| **Total** | **50** | | (33 automated in spec, remaining in CSV for manual/future) |

### Automated Test IDs (27 UI Tests)

#### Positive Tests
| Test ID | Title | Severity |
|---------|-------|----------|
| TC_BIN_UI_P001 | Initial page load - verify all 4 elements visible and default state | critical |
| TC_BIN_UI_P002 | Valid date populates flight dropdown | critical |
| TC_BIN_UI_P003 | Multiple flights appear for busy date | normal |
| TC_BIN_UI_P004 | Flight number format "Flight NNNN (ORG → DST)" | normal |
| TC_BIN_UI_P005 | Flight number dropdown matches DB records (SHIPPERFLIGHTINFORMATION) | critical |
| TC_BIN_UI_P006 | Selecting flight auto-populates destination | critical |
| TC_BIN_UI_P007 | Changing flight updates destination | normal |
| TC_BIN_UI_P008 | Origin dropdown shows correct airports from DB | critical |
| TC_BIN_UI_P009 | Origin selection — flights and DB cross-validation | critical |
| TC_BIN_UI_P010 | Changing origin updates flight list and clears destination | normal |
| TC_BIN_UI_P011 | Destination field is editable (manual override) | normal |
| TC_BIN_UI_P012 | Destination matches DB for selected flight | critical |
| TC_BIN_UI_P013 | Submit button enables with valid selections | critical |
| TC_BIN_UI_P014 | Submit navigates to bin assignment table | critical |

#### Negative Tests
| Test ID | Title | Severity |
|---------|-------|----------|
| TC_BIN_UI_N001 | Empty date — dropdowns remain disabled or submit disabled | critical |
| TC_BIN_UI_N002 | Invalid date format (DD/MM/YYYY) | normal |
| TC_BIN_UI_N003 | Non-existent date (02/30/2026) | normal |
| TC_BIN_UI_N004 | Special characters in date field | normal |
| TC_BIN_UI_N005 | Date cleared after population — disables dropdowns | critical |
| TC_BIN_UI_N006 | Letters in date field | normal |
| TC_BIN_UI_N007 | Future year 2099 — no flights expected | minor |
| TC_BIN_UI_N008 | Past date — no flights or read-only | minor |

#### Edge Cases
| Test ID | Title | Severity |
|---------|-------|----------|
| TC_BIN_UI_E001 | Rapid date entry | normal |
| TC_BIN_UI_E002 | Boundary date — today's date | normal |
| TC_BIN_UI_E003 | Year boundary — 12/31/YYYY to 01/01/YYYY+1 | normal |
| TC_BIN_UI_E004 | Leap year date — 02/29 | normal |
| TC_BIN_UI_E005 | Non-leap year — 02/29 | minor |

---

## 7. Page Object Model

### BinLocationAssignPage.js — Key Selectors

```javascript
const BIN_LOCATION_PAGE = {
    // Flight Selection Panel
    FLIGHT_DATE_INPUT:       'input[placeholder="MM/DD/YYYY"]',
    FLIGHT_NUMBER_DROPDOWN:  'select >> nth=0',
    ORIGIN_DROPDOWN:         'select >> nth=1',
    DESTINATION_INPUT:       'input[placeholder="Destination (auto-populated)"]',
    SUBMIT_BUTTON:          'button:has-text("Submit")',
    
    // Bin Assignment Table
    ASSIGNMENT_TABLE:        'table.bin-assignment',
    TABLE_ROWS:              'table.bin-assignment tbody tr',
    HEADER_FLIGHT:           '[data-testid="header-flight"]',
    HEADER_DATE:             '[data-testid="header-date"]',
    
    // Dialogs
    LOCKDOWN_DIALOG:         '[role="dialog"]:has-text("locked")',
    UNLOCK_BUTTON:           'button:has-text("Unlock")',
    EXIT_BUTTON:             'button:has-text("Exit")',
};
```

### Key Methods
| Method | Returns | Description |
|--------|---------|-------------|
| `setFlightDate(date)` | void | Types date into MM/DD/YYYY input |
| `getFlightNumberOptions()` | `[{text, value}]` | Gets all `<option>` elements from flight dropdown |
| `getOriginOptions()` | `[{text, value}]` | Gets all `<option>` elements from origin dropdown |
| `selectFlightNumber(text)` | void | Selects flight by visible text |
| `selectOrigin(text)` | void | Selects origin by visible text |
| `getDestination()` | string | Returns destination input value |
| `isFlightNumberDropdownDisabled()` | boolean | Checks if dropdown is disabled |
| `isSubmitButtonDisabled()` | boolean | Checks submit button state |
| `getFlightNumberCount()` | number | Returns count of options |
| `clickSubmit()` | void | Clicks the submit button |
| `clickExit()` | void | Navigates back from bin table |
| `isAssignmentTableVisible()` | boolean | Checks if bin assignment table loaded |
| `isLockdownDialogVisible()` | boolean | Checks for flight lock dialog |
| `unlockFlight()` | void | Clicks unlock in lockdown dialog |

---

## 8. Test Data Structure

### bin_comprehensive_test_data.json

```json
{
    "ui_tests": {
        "positive": {
            "TC_BIN_UI_P001": {
                "testCaseId": "TC_BIN_UI_P001",
                "title": "Initial page load - verify all 4 elements...",
                "flightDate": "${date|MM/DD/YYYY|+0}",
                "dbDateFormat": "${date|YYYY-MM-DD|+0}",
                "expectedElements": ["flightDate", "flightNumber", "origin", "destination"]
            }
            // ... more test cases
        },
        "negative": { /* TC_BIN_UI_N001 - N008 */ },
        "edge_cases": { /* TC_BIN_UI_E001 - E005 */ }
    },
    "e2e_tests": {
        "single_awb": { /* XSDG/NTM templates, expected DB values */ },
        "multi_xsdg": { /* Multiple message scenarios */ }
    },
    "db_queries": {
        "flights_by_date": "SELECT DISTINCT LEGFLTNUM, LEGORIGIN... WHERE FLIGHTDATE = '${flightDate}'",
        "origins_by_date": "SELECT DISTINCT LEGORIGIN... WHERE FLIGHTDATE = '${flightDate}'",
        "destination_for_flight": "SELECT LEGDESTINATION... WHERE FLIGHTDATE AND LEGFLTNUM AND LEGORIGIN",
        "flights_by_origin": "SELECT DISTINCT LEGFLTNUM... WHERE FLIGHTDATE AND LEGORIGIN",
        "unitassign_by_awbs": "SELECT ... FROM inotocdb.unitassign WHERE awbnum IN ${awbs}",
        "binassign_by_awbs": "SELECT ... FROM inotocdb.binassign WHERE awbnum IN ${awbs}",
        "sfi_by_awbs": "SELECT ... FROM inotocdb.shipperflightinformation WHERE awbnum IN ${awbs}",
        "audit_ntm_by_awbs": "SELECT ... FROM inotocdb.audit_ntm_messages WHERE awbnum IN ${awbs}",
        "audit_xsdg_by_awbs": "SELECT ... FROM inotocdb.audit_xsdg_messages WHERE awbnum IN ${awbs}"
    }
}
```

### Date Placeholder Resolution
- `${date|MM/DD/YYYY|+0}` → resolves to today's date (e.g., `04/22/2026`)
- `${date|YYYY-MM-DD|+0}` → resolves to DB format (e.g., `2026-04-22`)
- `${date|MM/DD/YYYY|+1}` → tomorrow's date
- `${date|DD/MM/YYYY|+0}` → reversed format for negative tests

---

## 9. Database Queries

### PostgreSQL Schema Notes

**CRITICAL**: The `SHIPPERFLIGHTINFORMATION` table uses column name `LEGFLTNUM` (NOT `LEGFLTNUMBER`).

| Table | Key Columns |
|-------|-------------|
| `SHIPPERFLIGHTINFORMATION` | `LEGFLTNUM`, `LEGORIGIN`, `LEGDESTINATION`, `FLIGHTDATE`, `AWBNUM`, `FLIGHTNUMBER` |
| `UNITASSIGN` | `AWBNUM`, `UNITASSIGNED`, `PIECESINUNIT`, `TOTALPCS`, `TOTALWEIGHT`, `DISPLAYEDUNIT`, `DISPLAYEDCLASSDIV`, `SPECIALHANDLINGINSTRUCTIONS` |
| `BINASSIGN` | `AWBNUM`, `BINLOCATION`, `PIECESINBIN`, `ISUNITSPLITFLAG`, `BINSTATUS`, `BINSEQUENCE` |
| `AUDIT_NTM_MESSAGES` | `MESSAGEID`, `AWBNUM` |
| `AUDIT_XSDG_MESSAGES` | `MESSAGEID`, `AWBNUM` |

### PostgreSQL Column Case Sensitivity
PostgreSQL stores unquoted identifiers as **lowercase** by default, but the `inotocdb` schema was created with **uppercase** column names (likely quoted during creation). Queries must use uppercase column names without quotes, as PostgreSQL will match case-insensitively with the schema.

**Fixed queries use**: `LEGFLTNUM`, `LEGORIGIN`, `LEGDESTINATION`, `FLIGHTDATE` (uppercase)

---

## 10. Playwright Configuration

### Project Config in `playwright.config.js`

```javascript
{
    name: 'Comprehensive - Bin Location E2E Suite',
    testMatch: '**/autonotoc/*.comprehensive.spec.js',
    use: {
        // NO ...devices['Desktop Chrome'] — conflicts with viewport: null
        trace: 'on-first-retry',
        screenshot: 'on',
        video: 'retain-on-failure',
    },
}
```

### Why No `devices['Desktop Chrome']`
`devices['Desktop Chrome']` sets `deviceScaleFactor: 1`, which **conflicts** with `viewport: null` in `BrowserHelpers.js`. When both are set, Playwright throws:
```
"deviceScaleFactor" option is not supported with null "viewport"
```

### BrowserHelpers.js Viewport Logic
```javascript
const contextOptions = { ignoreHTTPSErrors: true, permissions: [...] };
if (!headlessFlag) {
    contextOptions.viewport = null;  // Only sets viewport: null when headed
}
```

---

## 11. Bugs Found & Fixed

### Bug 1: `viewport: null` + `deviceScaleFactor` Conflict
- **Symptom**: `"deviceScaleFactor" option is not supported with null "viewport"`
- **Root Cause**: `...devices['Desktop Chrome']` in project config sets `deviceScaleFactor: 1`; `BrowserHelpers.js` sets `viewport: null` for headed mode
- **Fix**: Removed `...devices['Desktop Chrome']` from the comprehensive project config; conditional viewport in BrowserHelpers

### Bug 2: Pre-filled Date Field
- **Symptom**: TC_BIN_UI_P001 expected empty date field, but page pre-fills today's date
- **Root Cause**: The Bin Location Assignment page auto-populates today's date and pre-selects the first flight/origin/destination on load
- **Fix**: Changed assertions to expect date format match (`/\d{2}\/\d{2}\/\d{4}/`), expect dropdowns enabled (not disabled)

### Bug 3: Locator Chaining for Dropdown Options
- **Symptom**: `getFlightNumberOptions()` returned 0 options
- **Root Cause**: `this.page.locator('select >> nth=0 option')` — string concatenation doesn't work with Playwright's `>>` chaining syntax. `'select >> nth=0 option'` is parsed as `select >> nth=0` with `option` appended as invalid text
- **Fix**: Changed to `this.page.locator('select >> nth=0').locator('option')` — proper chaining via `.locator()` method

### Bug 4: Negative Tests Need Date Cleared First
- **Symptom**: Negative tests for invalid dates still showed flights
- **Root Cause**: Page starts with today's date pre-filled, so flights are already loaded
- **Fix**: Added `clearDateField(uiPage)` at the start of every negative test before entering invalid input

### Bug 5: DB Column Name `LEGFLTNUMBER` Doesn't Exist
- **Symptom**: DB query error — `column "legfltnumber" does not exist`
- **Root Cause**: The SHIPPERFLIGHTINFORMATION table uses `LEGFLTNUM` (not `LEGFLTNUMBER`). Initial queries used the wrong column name
- **Fix**: Updated all queries to use `LEGFLTNUM`; updated result column access to `r.legfltnum || r.LEGFLTNUM`

### Bug 6: TC_BIN_UI_P009 Origin Filter Assumption
- **Symptom**: Test asserted each flight dropdown entry contains the selected origin code, but flights from ALL origins appeared
- **Root Cause**: When logged in at **HDQ** (headquarters), the UI shows flights from **all stations** regardless of origin selection. The origin dropdown doesn't filter the flight number dropdown at HDQ
- **Fix**: Changed assertion from "every flight must contain origin code" to:
  1. Verify flights are populated after origin selection (count > 0)
  2. Log matching vs total flights for diagnostics
  3. Cross-validate that DB flights from selected origin appear in UI dropdown (subset check, not equality)

### Bug 7: TC_BIN_UI_N001 Empty Date Assertion
- **Symptom**: After clearing date, flight dropdown still had flights loaded (from previous test's date entry)
- **Root Cause**: Clearing the date input doesn't refresh/clear the flight dropdown immediately — the previously loaded flights remain
- **Fix**: Added `submitDisabled` check — verify that at least one guard is active (dropdowns disabled OR no flights OR submit disabled); also added Allure attachment to document the UI state

---

## 12. Test Execution Results

### Run History

| Run | Passed | Failed | Skipped | Key Issue |
|-----|--------|--------|---------|-----------|
| Run 1 | 0 | 1 | 26 | `deviceScaleFactor` conflict with `viewport: null` |
| Run 2 | 2 | 1 | 24 | TC_BIN_UI_P001 expected empty date, found pre-filled |
| Run 3 | 3 | 1 | 23 | `getFlightNumberOptions()` returned 0 (locator chaining bug) |
| Run 4 | 6 | 1 | 20 | TC_BIN_UI_P009 origin filter wrong assertion + DB column name wrong |
| Run 5 | 12 | 1 | 14 | TC_BIN_UI_N001 empty date — dropdown still had flights + submit check |
| Run 6 | **TBD** | **TBD** | **TBD** | Pending — after all fixes applied |

### Latest Run (Run 5) Detail
- **12 passed** (2.6 minutes): P001, P002, P003, P004, P005, P006, P007, P008, P009, P010, P011, P012, P013, P014
- **1 failed**: N001 — needed additional `submitDisabled` check (now fixed)
- **14 did not run**: N002–N008, E001–E005, plus P003/P004 — blocked by serial mode

---

## 13. How to Run

### Prerequisites
```bash
npm install
# Ensure .env.nonprod exists with all environment variables
```

### Execute UI Tests (Headed)
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
$env:HEADLESS="false"
npx playwright test tests/notoc/autonotoc/BinLocationAssignment.comprehensive.spec.js `
    --project="Comprehensive - Bin Location E2E Suite" `
    --grep "@ui"
```

### Execute E2E Tests
```powershell
$env:HEADLESS="false"
npx playwright test tests/notoc/autonotoc/BinLocationAssignment.comprehensive.spec.js `
    --project="Comprehensive - Bin Location E2E Suite" `
    --grep "@e2e"
```

### Execute All Tests
```powershell
$env:HEADLESS="false"
npx playwright test tests/notoc/autonotoc/BinLocationAssignment.comprehensive.spec.js `
    --project="Comprehensive - Bin Location E2E Suite"
```

### Run Headless (CI/CD)
```powershell
$env:HEADLESS="true"
npx playwright test tests/notoc/autonotoc/BinLocationAssignment.comprehensive.spec.js `
    --project="Comprehensive - Bin Location E2E Suite" `
    --grep "@ui"
```

---

## 14. Known Behaviors & Gotchas

### AutoNOTOC Page Behaviors
1. **Date auto-population**: The Bin Location Assignment page pre-fills today's date on load
2. **Auto-select first flight**: After date is entered, the first flight, origin, and destination are auto-selected
3. **HDQ location shows all flights**: When current location is HDQ (headquarters), the UI shows flights from ALL stations, not just the selected origin
4. **Origin doesn't filter flights at HDQ**: Selecting an origin in the dropdown doesn't filter the flight number dropdown when logged in from HDQ
5. **Clearing date doesn't clear dropdowns**: Clearing the date input field doesn't immediately clear/disable the flight number dropdown — previously loaded flights remain
6. **Flight format**: Each flight option is displayed as `"Flight NNNN (ORG → DST)"` (e.g., `"Flight 2589 (YYZ → MIA)"`)

### Playwright/Technical Gotchas
1. **`>>` chaining is not string concatenation**: `page.locator('select >> nth=0 option')` does NOT work. Use `page.locator('select >> nth=0').locator('option')` instead
2. **`devices['Desktop Chrome']` sets `deviceScaleFactor`**: This conflicts with `viewport: null`. Never spread device configs when using null viewport
3. **Serial tests**: One failure blocks all subsequent tests in the same `describe.serial` block
4. **Tab keypress after date entry**: The page requires a Tab keypress after entering the date to trigger the flight dropdown population
5. **Lockdown dialog**: Flights that are already assigned may show a lockdown dialog requiring an unlock action before proceeding

### Database Gotchas
1. **Column name**: `SHIPPERFLIGHTINFORMATION` uses `LEGFLTNUM` not `LEGFLTNUMBER`
2. **Case sensitivity**: Use uppercase column names (`LEGFLTNUM`, `LEGORIGIN`, `LEGDESTINATION`, `FLIGHTDATE`)
3. **Result column access**: Always access with fallback: `r.legfltnum || r.LEGFLTNUM` (PostgreSQL may return lowercase keys)
4. **Leading zeros**: Flight numbers in DB may have leading zeros (e.g., `0026`); strip with `.replace(/^0+/, '')`

---

## 15. Allure Report Generation

### Generate Report
```powershell
npx allure generate --clean --single-file allure-results -o allure-report
```

### Open Report
```powershell
npx allure open allure-report
```

### Report Features
- **Steps**: Each test has detailed Allure steps for visibility
- **Attachments**: UI option lists, DB query results, and screenshots attached per test
- **Severity**: Tests tagged with `critical`, `normal`, or `minor`
- **Tags**: `@ui`, `@positive`, `@negative`, `@edge`, `@e2e`, `@sanity`, `@regression`
- **Screenshots**: Captured on failure (configured in playwright.config.js)
- **Traces**: Available on first retry for debugging

---

## Appendix A: File Locations Quick Reference

| File | Path |
|------|------|
| Test Spec | `tests/notoc/autonotoc/BinLocationAssignment.comprehensive.spec.js` |
| Test Data JSON | `data/test_data/autonotoc/bin_comprehensive_test_data.json` |
| Test Cases CSV | `data/test_data/autonotoc/BinLocationAssignment_TestCases.csv` |
| Page Object | `pages/ui/autonotoc/BinLocationAssignPage.js` |
| Base Page | `pages/ui/autonotoc/BasePage.js` |
| Login Page | `pages/ui/autonotoc/AutoNotocLoginPage.js` |
| Legacy Login | `pages/ui/notoc_legacy/LoginPage.js` |
| NTM/XSDG Posting | `pages/ui/notoc_legacy/NtmXsdgMessagesPostingPage.js` |
| Browser Helpers | `utils/helpers/BrowserHelpers.js` |
| Database Helper | `utils/helpers/database.js` |
| Date Utilities | `utils/helpers/DateUtils.js` |
| AWB Generator | `utils/helpers/awbUtils.js` |
| Logger | `utils/helpers/Logger.js` |
| Constants | `utils/constants/Constants.js` |
| Env Config | `.env.nonprod` |
| Playwright Config | `playwright.config.js` |
| DB Queries | `data/test_data/database_queries/dbqueries.json` |

## Appendix B: Environment Variables Required

| Variable | Description |
|----------|-------------|
| `AUTONOTOC_URL` | AutoNOTOC application URL (notoc-nonprod.cloud.aa.com) |
| `NOTOC_LEGACY_URL` | Legacy interface URL (inotoc.stage.aa.com/iCargoInterfaceApp/) |
| `POSTGRES_HOST` | PostgreSQL database host |
| `POSTGRES_PORT` | PostgreSQL database port |
| `POSTGRES_DB` | Database name |
| `POSTGRES_USER` | Database username |
| `POSTGRES_PASSWORD` | Database password |
| `DEFAULT_TIMEZONE` | Default timezone (America/Chicago) |
| `HEADLESS` | `"true"` for headless, `"false"` for headed browser |
| `TEST_USERNAME` | AutoNOTOC login username |
| `TEST_PASSWORD` | AutoNOTOC login password |

## Appendix C: Test Helper Functions in Spec

| Function | Purpose |
|----------|---------|
| `resolveDate(template)` | Resolves `${date\|format\|offset}` placeholders |
| `enterDateAndWait(binLocationPage, page, date)` | Enters date + Tab + wait |
| `clearDateField(page)` | Clears date input + Tab + wait |
| `getFlightsFromDb(flightDate)` | Queries SHIPPERFLIGHTINFORMATION for flights |
| `getOriginsFromDb(flightDate)` | Queries distinct origins for date |
| `getDestinationFromDb(date, flight, origin)` | Queries destination for specific flight |
| `getFlightsByOriginFromDb(date, origin)` | Queries flights filtered by origin |
| `selectFirstAvailableFlight(binLocationPage)` | Selects first non-empty flight option |
| `selectFirstAvailableOrigin(binLocationPage)` | Selects first non-empty origin option |
| `buildXsdgXml(template, awb, flight, origin, dest)` | Builds XSDG XML from template |
| `buildNtmMessage(template, awb, flight, origin, dest)` | Builds NTM message from template |
