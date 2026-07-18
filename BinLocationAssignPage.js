import { BasePage } from './BasePage.js';
import { TIMEOUTS } from '../../../utils/constants/Constants.js';
import * as allure from 'allure-js-commons';

/**
 * Selectors for the Bin Location Assignment screen.
 * Captured from the live DOM at https://notoc-nonprod.cloud.aa.com/bin-location-assignment
 * on 2026-04-15. Elements have no IDs or data-testid attributes, so role-based and
 * text-based selectors are used per Playwright best practices.
 */
export const BIN_LOCATION_PAGE = {
    // ==================== HEADER / GLOBAL ELEMENTS ====================
    AA_LOGO: 'img[alt="American Airlines"]',
    PAGE_TITLE_H1: 'h1',
    AGENT_INFO: 'p:has-text("Agent:")',
    ENV_INFO: 'p:has-text("STAGE Env")',

    // ==================== NAVIGATION MENU ====================
    NAV_BIN_LOCATION_LINK: 'a[href="/bin-location-assignment"]',
    NAV_FLIGHT_PLAN_LINK: 'a[href="/flight-plan"]',
    NAV_MAIN_MENU_LINK: 'a[href="/"]',
    NAV_PRINT_NOTOC_RAMP_LINK: 'a[href="/print-notoc-ramp-flight"]',
    NAV_PRINT_NOTOC_HISTORY_LINK: 'a[href="/print-notoc"]',
    NAV_EMERGENCY_RESPONSE_LINK: 'a[href="/emergency-response-report"]',
    NAV_CHANGE_PRINTER_LINK: 'a[href="/change-printer-id"]',
    NAV_CHANGE_LOCATION_LINK: 'a[href="/change-location"]',

    // ==================== SEARCH / FILTER SECTION ====================
    PAGE_HEADING: 'h2:has-text("Dangerous Goods Assign Bin Location")',
    FLIGHT_DATE_INPUT: 'input[placeholder="MM/DD/YYYY"]',
    FLIGHT_DATE_LABEL: 'text=Flight Date',
    FLIGHT_NUMBER_DROPDOWN: 'select >> nth=0',
    FLIGHT_NUMBER_LABEL: 'text=Flight Number',
    ORIGIN_DROPDOWN: 'select >> nth=1',
    ORIGIN_LABEL: 'text=Please enter the origin',
    DESTINATION_INPUT: 'input[placeholder="Destination (auto-populated)"]',
    DESTINATION_LABEL: 'text=Destination',
    SUBMIT_BUTTON: 'button:has-text("Submit")',

    // ==================== CAUTION / WARNING MESSAGES ====================
    NO_FLIGHTS_FOUND_BANNER: '.bg-\\[\\#ffe2e6\\]',
    NO_FLIGHTS_FOUND_MESSAGE: 'p:has-text("No Flights Found")',

    // ==================== FLIGHT LOCK DOWN ALERT DIALOG ====================
    LOCKDOWN_DIALOG: '[role="dialog"]',
    LOCKDOWN_DIALOG_HEADING: '[role="dialog"] h2',
    LOCKDOWN_DIALOG_CLOSE_BUTTON: '[role="dialog"] button:has(img[alt="Close"])',
    LOCKDOWN_DIALOG_FLIGHT_INFO: '[role="dialog"] p >> nth=0',
    LOCKDOWN_DIALOG_MESSAGE: '[role="dialog"] p >> nth=1',
    LOCKDOWN_UNLOCK_BUTTON: 'button:has-text("OK - Unlock Flight for Updates")',
    LOCKDOWN_VIEW_BIN_BUTTON: 'button:has-text("View Bin Information")',
    LOCKDOWN_CANCEL_BUTTON: 'button:has-text("Cancel, Choose Another Flight")',

    // ==================== PRINT / EXPORT ACTION BUTTONS ====================
    LASER_BUTTON: 'button:has-text("Laser")',
    SABRE_HARDCOPY_BUTTON: 'button:has-text("Sabre Hardcopy")',
    EXPORT_PDF_BUTTON: 'button:has-text("Export to PDF")',

    // ==================== BIN ASSIGNMENT SECTION ====================
    FLIGHT_INFO_PARAGRAPH: 'p:has-text("Flight"):has-text("→")',
    EQUIPMENT_AIRCRAFT_LABEL: 'text=Equipment/Aircraft Type',
    EQUIPMENT_AIRCRAFT_DROPDOWN: 'main select',

    // ==================== ASSIGNMENT TABLE ====================
    ASSIGNMENT_TABLE: 'table.w-full.border-collapse',
    ASSIGNMENT_TABLE_HEADER_ROW_1: 'table thead tr >> nth=0',
    ASSIGNMENT_TABLE_HEADER_ROW_2: 'table thead tr >> nth=1',
    ASSIGNMENT_TABLE_HEADER_ROW_3: 'table thead tr >> nth=2',
    ASSIGNMENT_TABLE_BODY_ROWS: 'table tbody tr',

    // Header cells (Row 1 - Flight info)
    HEADER_FLIGHT: 'th:has-text("FLIGHT:")',
    HEADER_DATE: 'th:has-text("DATE:")',
    HEADER_FROM: 'th:has-text("FROM:")',
    HEADER_TO: 'th:has-text("TO:")',
    HEADER_BIN_LOCATION: 'th:has-text("BIN LOCATION:")',

    // Header cells (Row 2)
    HEADER_BIN_ASSIGN: 'th:has-text("BIN ASSIGN")',

    // Header cells (Row 3 - Column headers)
    HEADER_ALL: 'th:has-text("ALL")',
    HEADER_SPLIT: 'th:has-text("SPLIT")',
    HEADER_BUILT_PCS: 'th:has-text("BUILT")',
    HEADER_DESTINATION: 'th:has-text("DESTINATION")',
    HEADER_UNIT_ID: 'th:has-text("UNIT ID")',
    HEADER_TOTAL_PCS: 'th:has-text("TOTAL PCS")',
    HEADER_TOTAL_WT: 'th:has-text("TOTAL WT")',
    HEADER_HEIGHT: 'th:has-text("Height(in)")',
    HEADER_CLASS_DIV: 'th:has-text("CLASS/DIV")',
    HEADER_UNIT: 'th:has-text("UNIT")',
    HEADER_SPECIAL_HANDLING: 'th:has-text("SPECIAL HANDLING")',

    // Data row cells (relative to a row)
    ROW_ALL_RADIO: 'input[type="radio"][name="all"]',
    ROW_SPLIT_RADIO: 'input[type="radio"][name="split"]',
    ROW_BUILT_PCS_CELL: 'td >> nth=2',
    ROW_DESTINATION_CELL: 'td >> nth=3',
    ROW_UNIT_ID_CELL: 'td >> nth=4',
    ROW_TOTAL_PCS_CELL: 'td >> nth=5',
    ROW_TOTAL_WT_CELL: 'td >> nth=6',
    ROW_HEIGHT_CELL: 'td >> nth=7',
    ROW_CLASS_DIV_CELL: 'td >> nth=8',
    ROW_UNIT_CELL: 'td >> nth=9',
    ROW_SPECIAL_HANDLING_CELL: 'td >> nth=10',

    // ==================== BOTTOM ACTION BUTTONS ====================
    ADD_NEW_BIN_BUTTON: 'button:has-text("Add New Bin")',
    ADD_ALL_UNITS_BUTTON: 'button:has-text("Add All Units To Bin")',
    EXIT_BUTTON: 'button:has-text("Exit")',

    // ==================== GET BIN NAME DIALOG ====================
    BIN_NAME_DIALOG: 'dialog:has-text("Get Bin Name")',
    BIN_NAME_DIALOG_HEADING: 'dialog h2:has-text("Get Bin Name")',
    BIN_NAME_DIALOG_CLOSE_BUTTON: 'dialog:has-text("Get Bin Name") button:has(img[alt="Close"])',
    BIN_LOCATION_INPUT: 'textbox[name="Bin Location:"], input[placeholder="Enter Bin Location"]',
    BIN_COMPARTMENT_LISTBOX: 'listbox[name="Compartment suggestions"]',
    BIN_COMPARTMENT_OPTION_A1: 'option:has-text("A1 (AFT)")',
    BIN_COMPARTMENT_OPTION_A2: 'option:has-text("A2 (AFT)")',
    BIN_COMPARTMENT_OPTION_F1: 'option:has-text("F1 (FWD)")',
    BIN_COMPARTMENT_OPTION_F2: 'option:has-text("F2 (FWD)")',
    REFUSE_SHIPMENT_CHECKBOX: 'checkbox:has-text("Check here to REFUSE a shipment")',
    BIN_INSTRUCTIONS_TEXT: 'text=Bin Location can contain only alpha-numeric characters',
    BIN_NON_ACCOMMODATED_TEXT: 'text=Non-accommodated shipment codes are',
    ON_BEHALF_CHECKBOX: 'checkbox:has-text("Are you Loading this Bin on Behalf of someone else")',
    ON_BEHALF_ID_INPUT: 'input[placeholder="Input text"] >> nth=0',
    ON_BEHALF_NAME_INPUT: 'input[placeholder="Input text"] >> nth=1',
    BIN_DIALOG_SUBMIT_BUTTON: 'dialog:has-text("Get Bin Name") button:has-text("Submit")',

    // ==================== FEEDBACK / STATUS ====================
    ALERT_REGION: '[role="alert"]',
};

/**
 * BinLocationAssignPage - Page object for the Bin Location Assignment screen in AutoNOTOC.
 * Handles flight search via dropdowns, lock-down dialog handling, aircraft selection,
 * radio-based unit selection (ALL/SPLIT), and bin assignment actions.
 */
export class BinLocationAssignPage extends BasePage {
    constructor(page) {
        super(page);
    }

    // ==================== SEARCH / FILTER METHODS ====================

    /**
     * Selects a flight number from the Flight Number dropdown.
     * @param {string} flightLabel - The visible option label (e.g., "Flight 1046 (ATL → MIA)")
     */
    async selectFlightNumber(flightLabel) {
        await allure.step(`Select flight number: ${flightLabel}`, async () => {
            await this.page.locator(BIN_LOCATION_PAGE.FLIGHT_NUMBER_DROPDOWN).selectOption({ label: flightLabel });
        });
    }

    /**
     * Selects an origin airport from the Origin dropdown.
     * @param {string} originLabel - The visible option label (e.g., "MIAMI INTERNATIONAL AIRPORT (MIA)")
     */
    async selectOrigin(originLabel) {
        await allure.step(`Select origin: ${originLabel}`, async () => {
            await this.page.locator(BIN_LOCATION_PAGE.ORIGIN_DROPDOWN).selectOption({ label: originLabel });
        });
    }

    /**
     * Sets the flight date in the date input field.
     * @param {string} date - Date in MM/DD/YYYY format
     */
    async setFlightDate(date) {
        await allure.step(`Set flight date: ${date}`, async () => {
            const input = this.page.locator(BIN_LOCATION_PAGE.FLIGHT_DATE_INPUT);
            await input.fill('');
            await input.fill(date);
        });
    }

    /**
     * Gets the auto-populated destination value.
     * @returns {Promise<string>}
     */
    async getDestination() {
        return this.page.locator(BIN_LOCATION_PAGE.DESTINATION_INPUT).inputValue();
    }

    /**
     * Clicks the Submit button to search for flights / load assignment data.
     */
    async clickSubmit() {
        await allure.step('Click Submit button', async () => {
            await this.page.locator(BIN_LOCATION_PAGE.SUBMIT_BUTTON).click();
            await this.waitForPageLoad();
        });
    }

    /**
     * Performs a full flight search with the provided criteria.
     * @param {Object} searchCriteria - Search parameters
     * @param {string} [searchCriteria.flightNumber] - Flight number dropdown label
     * @param {string} [searchCriteria.flightDate] - Flight date (MM/DD/YYYY)
     * @param {string} [searchCriteria.origin] - Origin dropdown label
     */
    async searchFlights({ flightNumber, flightDate, origin } = {}) {
        await allure.step(`Search flights - Flight: ${flightNumber || 'N/A'}, Date: ${flightDate || 'N/A'}`, async () => {
            if (flightDate) {
                await this.setFlightDate(flightDate);
            }
            if (flightNumber) {
                await this.selectFlightNumber(flightNumber);
            }
            if (origin) {
                await this.selectOrigin(origin);
            }
            await this.clickSubmit();
        });
    }

    // ==================== FLIGHT LOCK DOWN DIALOG METHODS ====================

    /**
     * Checks if the Flight Lock Down Alert dialog is visible.
     * @returns {Promise<boolean>}
     */
    async isLockdownDialogVisible() {
        return this.page.locator(BIN_LOCATION_PAGE.LOCKDOWN_DIALOG).isVisible();
    }

    /**
     * Gets the lock down dialog message text.
     * @returns {Promise<string>}
     */
    async getLockdownDialogMessage() {
        return this.page.locator(BIN_LOCATION_PAGE.LOCKDOWN_DIALOG_MESSAGE).innerText();
    }

    /**
     * Clicks "OK - Unlock Flight for Updates" on the lock down dialog.
     */
    async unlockFlight() {
        await allure.step('Unlock flight for updates', async () => {
            await this.page.locator(BIN_LOCATION_PAGE.LOCKDOWN_UNLOCK_BUTTON).click();
            await this.waitForPageLoad();
        });
    }

    /**
     * Clicks "View Bin Information" on the lock down dialog.
     */
    async viewBinInformation() {
        await allure.step('View bin information (read-only)', async () => {
            await this.page.locator(BIN_LOCATION_PAGE.LOCKDOWN_VIEW_BIN_BUTTON).click();
            await this.waitForPageLoad();
        });
    }

    /**
     * Clicks "Cancel, Choose Another Flight" on the lock down dialog.
     */
    async cancelLockdownDialog() {
        await allure.step('Cancel and choose another flight', async () => {
            await this.page.locator(BIN_LOCATION_PAGE.LOCKDOWN_CANCEL_BUTTON).click();
            await this.waitForPageLoad();
        });
    }

    /**
     * Closes the lock down dialog via the X button.
     */
    async closeLockdownDialog() {
        await this.page.locator(BIN_LOCATION_PAGE.LOCKDOWN_DIALOG_CLOSE_BUTTON).click();
    }

    // ==================== AIRCRAFT / EQUIPMENT METHODS ====================

    /**
     * Selects an aircraft/equipment type from the dropdown.
     * @param {string} aircraftLabel - The visible option label (e.g., "737---738A")
     */
    async selectAircraftType(aircraftLabel) {
        await allure.step(`Select aircraft type: ${aircraftLabel}`, async () => {
            await this.page.locator(BIN_LOCATION_PAGE.EQUIPMENT_AIRCRAFT_DROPDOWN).selectOption({ label: aircraftLabel });
        });
    }

    // ==================== ASSIGNMENT TABLE METHODS ====================

    /**
     * Gets the flight information from the assignment page header paragraph.
     * @returns {Promise<string>}
     */
    async getFlightInfoText() {
        return this.page.locator(BIN_LOCATION_PAGE.FLIGHT_INFO_PARAGRAPH).innerText();
    }

    /**
     * Gets the count of data rows in the assignment table.
     * @returns {Promise<number>}
     */
    async getAssignmentRowCount() {
        return this.page.locator(BIN_LOCATION_PAGE.ASSIGNMENT_TABLE_BODY_ROWS).count();
    }

    /**
     * Gets the full assignment table data as an array of objects.
     * @returns {Promise<Array<Object>>}
     */
    async getAssignmentTableData() {
        const rows = this.page.locator(BIN_LOCATION_PAGE.ASSIGNMENT_TABLE_BODY_ROWS);
        const count = await rows.count();
        const data = [];
        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            data.push({
                builtPcs: (await row.locator(BIN_LOCATION_PAGE.ROW_BUILT_PCS_CELL).innerText()).trim(),
                destination: (await row.locator(BIN_LOCATION_PAGE.ROW_DESTINATION_CELL).innerText()).trim(),
                unitId: (await row.locator(BIN_LOCATION_PAGE.ROW_UNIT_ID_CELL).innerText()).trim(),
                totalPcs: (await row.locator(BIN_LOCATION_PAGE.ROW_TOTAL_PCS_CELL).innerText()).trim(),
                totalWt: (await row.locator(BIN_LOCATION_PAGE.ROW_TOTAL_WT_CELL).innerText()).trim(),
                height: (await row.locator(BIN_LOCATION_PAGE.ROW_HEIGHT_CELL).innerText()).trim(),
                classDiv: (await row.locator(BIN_LOCATION_PAGE.ROW_CLASS_DIV_CELL).innerText()).trim(),
                unit: (await row.locator(BIN_LOCATION_PAGE.ROW_UNIT_CELL).innerText()).trim(),
                specialHandling: (await row.locator(BIN_LOCATION_PAGE.ROW_SPECIAL_HANDLING_CELL).innerText()).trim(),
            });
        }
        return data;
    }

    /**
     * Clicks the "ALL" radio button for a specific row by unit ID.
     * @param {string} unitId - The UNIT ID text to match (e.g., "ATLP1046")
     */
    async selectAllForUnit(unitId) {
        await allure.step(`Select ALL radio for unit: ${unitId}`, async () => {
            const rows = this.page.locator(BIN_LOCATION_PAGE.ASSIGNMENT_TABLE_BODY_ROWS);
            const count = await rows.count();
            for (let i = 0; i < count; i++) {
                const cellText = await rows.nth(i).locator(BIN_LOCATION_PAGE.ROW_UNIT_ID_CELL).innerText();
                if (cellText.trim().includes(unitId)) {
                    await rows.nth(i).locator(BIN_LOCATION_PAGE.ROW_ALL_RADIO).click();
                    break;
                }
            }
        });
    }

    /**
     * Clicks the "SPLIT" radio button for a specific row by unit ID.
     * @param {string} unitId - The UNIT ID text to match (e.g., "ATLP1046")
     */
    async selectSplitForUnit(unitId) {
        await allure.step(`Select SPLIT radio for unit: ${unitId}`, async () => {
            const rows = this.page.locator(BIN_LOCATION_PAGE.ASSIGNMENT_TABLE_BODY_ROWS);
            const count = await rows.count();
            for (let i = 0; i < count; i++) {
                const cellText = await rows.nth(i).locator(BIN_LOCATION_PAGE.ROW_UNIT_ID_CELL).innerText();
                if (cellText.trim().includes(unitId)) {
                    await rows.nth(i).locator(BIN_LOCATION_PAGE.ROW_SPLIT_RADIO).click();
                    break;
                }
            }
        });
    }

    // ==================== BOTTOM ACTION BUTTON METHODS ====================

    /**
     * Clicks the "Add New Bin" button.
     */
    async clickAddNewBin() {
        await allure.step('Click Add New Bin', async () => {
            await this.page.locator(BIN_LOCATION_PAGE.ADD_NEW_BIN_BUTTON).click();
            await this.waitForPageLoad();
        });
    }

    /**
     * Clicks the "Add All Units To Bin" button.
     */
    async clickAddAllUnitsToBin() {
        await allure.step('Click Add All Units To Bin', async () => {
            await this.page.locator(BIN_LOCATION_PAGE.ADD_ALL_UNITS_BUTTON).click();
            await this.waitForPageLoad();
        });
    }

    /**
     * Clicks the "Exit" button to return to the search/filter page.
     */
    async clickExit() {
        await allure.step('Click Exit button', async () => {
            await this.page.locator(BIN_LOCATION_PAGE.EXIT_BUTTON).click();
            await this.waitForPageLoad();
        });
    }

    // ==================== PRINT / EXPORT METHODS ====================

    /**
     * Clicks the "Laser" print button.
     */
    async clickLaserPrint() {
        await this.page.locator(BIN_LOCATION_PAGE.LASER_BUTTON).click();
    }

    /**
     * Clicks the "Sabre Hardcopy" print button.
     */
    async clickSabreHardcopy() {
        await this.page.locator(BIN_LOCATION_PAGE.SABRE_HARDCOPY_BUTTON).click();
    }

    /**
     * Clicks the "Export to PDF" button.
     */
    async clickExportPdf() {
        await this.page.locator(BIN_LOCATION_PAGE.EXPORT_PDF_BUTTON).click();
    }

    // ==================== UTILITY / STATUS METHODS ====================

    /**
     * Checks if the "Add New Bin" button is enabled.
     * @returns {Promise<boolean>}
     */
    async isAddNewBinEnabled() {
        return this.page.locator(BIN_LOCATION_PAGE.ADD_NEW_BIN_BUTTON).isEnabled();
    }

    /**
     * Checks if the "Add All Units To Bin" button is enabled.
     * @returns {Promise<boolean>}
     */
    async isAddAllUnitsEnabled() {
        return this.page.locator(BIN_LOCATION_PAGE.ADD_ALL_UNITS_BUTTON).isEnabled();
    }

    /**
     * Checks if the assignment table is visible (bin assignment section has loaded).
     * @returns {Promise<boolean>}
     */
    async isAssignmentTableVisible() {
        return this.page.locator(BIN_LOCATION_PAGE.ASSIGNMENT_TABLE).isVisible();
    }

    /**
     * Gets the page heading text.
     * @returns {Promise<string>}
     */
    async getPageHeading() {
        return this.page.locator(BIN_LOCATION_PAGE.PAGE_HEADING).innerText();
    }

    /**
     * Gets the alert region text (if any message is displayed).
     * @returns {Promise<string>}
     */
    async getAlertText() {
        const alert = this.page.locator(BIN_LOCATION_PAGE.ALERT_REGION);
        if (await alert.isVisible()) {
            return alert.innerText();
        }
        return '';
    }

    /**
     * Takes a screenshot of the current page state.
     * @returns {Promise<Buffer>}
     */
    async takeScreenshot() {
        return this.page.screenshot({ fullPage: true });
    }

    // ==================== FLIGHT DATE & DROPDOWN VALIDATION METHODS ====================

    /**
     * Checks if the "No Flights Found" caution banner is visible.
     * @returns {Promise<boolean>}
     */
    async isNoFlightsFoundVisible() {
        return this.page.locator(BIN_LOCATION_PAGE.NO_FLIGHTS_FOUND_MESSAGE).isVisible();
    }

    /**
     * Gets the "No Flights Found" message text.
     * @returns {Promise<string>}
     */
    async getNoFlightsFoundText() {
        return this.page.locator(BIN_LOCATION_PAGE.NO_FLIGHTS_FOUND_MESSAGE).innerText();
    }

    /**
     * Checks if the Flight Number dropdown is disabled.
     * @returns {Promise<boolean>}
     */
    async isFlightNumberDropdownDisabled() {
        return this.page.locator(BIN_LOCATION_PAGE.FLIGHT_NUMBER_DROPDOWN).isDisabled();
    }

    /**
     * Checks if the Origin dropdown is disabled.
     * @returns {Promise<boolean>}
     */
    async isOriginDropdownDisabled() {
        return this.page.locator(BIN_LOCATION_PAGE.ORIGIN_DROPDOWN).isDisabled();
    }

    /**
     * Checks if the Submit button is disabled.
     * @returns {Promise<boolean>}
     */
    async isSubmitButtonDisabled() {
        return this.page.locator(BIN_LOCATION_PAGE.SUBMIT_BUTTON).isDisabled();
    }

    /**
     * Gets all available flight number options from the dropdown.
     * @returns {Promise<Array<{text: string, value: string}>>}
     */
    async getFlightNumberOptions() {
        const options = await this.page.locator(BIN_LOCATION_PAGE.FLIGHT_NUMBER_DROPDOWN).locator('option').all();
        const result = [];
        for (const opt of options) {
            result.push({
                text: (await opt.innerText()).trim(),
                value: await opt.getAttribute('value') || '',
            });
        }
        return result;
    }

    /**
     * Gets the count of available flight numbers (excluding placeholder).
     * @returns {Promise<number>}
     */
    async getFlightNumberCount() {
        const options = await this.getFlightNumberOptions();
        return options.filter(o => o.value !== '').length;
    }

    /**
     * Gets all available origin options from the dropdown.
     * @returns {Promise<Array<{text: string, value: string}>>}
     */
    async getOriginOptions() {
        const options = await this.page.locator(BIN_LOCATION_PAGE.ORIGIN_DROPDOWN).locator('option').all();
        const result = [];
        for (const opt of options) {
            result.push({
                text: (await opt.innerText()).trim(),
                value: await opt.getAttribute('value') || '',
            });
        }
        return result;
    }

    /**
     * Gets the count of available origin airports (excluding placeholder).
     * @returns {Promise<number>}
     */
    async getOriginCount() {
        const options = await this.getOriginOptions();
        return options.filter(o => o.value !== '').length;
    }

    /**
     * Gets the currently selected flight number option text.
     * @returns {Promise<string>}
     */
    async getSelectedFlightNumber() {
        return this.page.locator(`${BIN_LOCATION_PAGE.FLIGHT_NUMBER_DROPDOWN} option[selected]`).innerText();
    }

    /**
     * Gets the currently selected origin option text.
     * @returns {Promise<string>}
     */
    async getSelectedOrigin() {
        return this.page.locator(`${BIN_LOCATION_PAGE.ORIGIN_DROPDOWN} option[selected]`).innerText();
    }

    /**
     * Checks if a specific origin code appears in the origin dropdown.
     * @param {string} originCode - Airport code (e.g., "DFW")
     * @returns {Promise<boolean>}
     */
    async isOriginAvailable(originCode) {
        const options = await this.getOriginOptions();
        return options.some(o => o.value === originCode);
    }

    /**
     * Checks if flight options contain flights from a given origin code.
     * @param {string} originCode - Airport code (e.g., "DFW")
     * @returns {Promise<boolean>}
     */
    async hasFlightsFromOrigin(originCode) {
        const options = await this.getFlightNumberOptions();
        return options.some(o => o.text.includes(`(${originCode} →`) || o.text.includes(`(${originCode}→`));
    }

    // ==================== POPUP / LOCKDOWN CONDITION DETECTION ====================

    /**
     * Detects which lockdown popup condition is active.
     * Condition 1: Flight info not received from OpsHub - 3 options (View Bin, Unlock, Cancel)
     * Condition 2: Flight has departed - 2 options (View Bin, Cancel)
     * @returns {Promise<'condition1'|'condition2'|'none'>}
     */
    async detectLockdownCondition() {
        if (!await this.isLockdownDialogVisible()) {
            return 'none';
        }
        // Check if Unlock button is visible (only present in Condition 1)
        const unlockVisible = await this.page.locator(BIN_LOCATION_PAGE.LOCKDOWN_UNLOCK_BUTTON).isVisible();
        if (unlockVisible) {
            return 'condition1';
        }
        return 'condition2';
    }

    /**
     * Handles the lockdown popup based on the desired action.
     * @param {'unlock'|'viewBin'|'cancel'} action - Desired action
     * @returns {Promise<string>} The condition detected ('condition1', 'condition2', 'none')
     */
    async handleLockdownPopup(action = 'unlock') {
        const condition = await this.detectLockdownCondition();
        if (condition === 'none') return condition;

        await allure.step(`Lockdown popup detected: ${condition} — action: ${action}`, async () => {
            const message = await this.getLockdownDialogMessage();
            await allure.attachment('Lockdown Message', message, 'text/plain');

            switch (action) {
                case 'unlock':
                    if (condition === 'condition1') {
                        await this.unlockFlight();
                    } else {
                        await allure.attachment('Warning', 'Unlock not available for departed flights (condition2)', 'text/plain');
                        await this.cancelLockdownDialog();
                    }
                    break;
                case 'viewBin':
                    await this.viewBinInformation();
                    break;
                case 'cancel':
                    await this.cancelLockdownDialog();
                    break;
            }
        });
        return condition;
    }

    // ==================== BINNING OPERATION METHODS ====================

    /**
     * Performs full binning (ALL pieces) for a unit.
     * Selects ALL radio → Add New Bin → fills bin dialog → submits.
     * @param {string} unitId - The UNIT ID to bin (e.g., "DFWP1042")
     * @param {string} binLocation - Bin location code (e.g., "A1")
     * @param {string} compartment - Compartment label (e.g., "A1 (AFT)")
     * @returns {Promise<Object>} Binning result with details
     */
    async performFullBinning(unitId, binLocation, compartment) {
        return await allure.step(`Full binning: unit ${unitId} → bin ${binLocation}`, async () => {
            // Select ALL radio for the unit
            await this.selectAllForUnit(unitId);
            await this.page.waitForTimeout(500);

            // Click Add New Bin
            await this.clickAddNewBin();
            await this.page.waitForTimeout(2000);

            // Fill bin dialog
            await this._fillBinDialog(binLocation, compartment);

            return { unitId, binLocation, compartment, type: 'ALL', splitFlag: 'N' };
        });
    }

    /**
     * Performs split binning (partial pieces) for a unit.
     * Selects SPLIT radio → Add New Bin → fills bin dialog → submits.
     * @param {string} unitId - The UNIT ID to bin
     * @param {string} binLocation - Bin location code
     * @param {string} compartment - Compartment label
     * @returns {Promise<Object>} Binning result with details
     */
    async performSplitBinning(unitId, binLocation, compartment) {
        return await allure.step(`Split binning: unit ${unitId} → bin ${binLocation}`, async () => {
            // Select SPLIT radio for the unit
            await this.selectSplitForUnit(unitId);
            await this.page.waitForTimeout(500);

            // Click Add New Bin
            await this.clickAddNewBin();
            await this.page.waitForTimeout(2000);

            // Fill bin dialog
            await this._fillBinDialog(binLocation, compartment);

            return { unitId, binLocation, compartment, type: 'SPLIT', splitFlag: 'Y' };
        });
    }

    /**
     * Performs delete binning - removes an existing bin assignment.
     * Clicks the delete/remove action for the specified unit's bin.
     * @param {string} unitId - The UNIT ID whose bin to delete
     * @returns {Promise<void>}
     */
    async performDeleteBinning(unitId) {
        await allure.step(`Delete binning for unit: ${unitId}`, async () => {
            const rows = this.page.locator(BIN_LOCATION_PAGE.ASSIGNMENT_TABLE_BODY_ROWS);
            const count = await rows.count();
            for (let i = 0; i < count; i++) {
                const cellText = await rows.nth(i).locator(BIN_LOCATION_PAGE.ROW_UNIT_ID_CELL).innerText();
                if (cellText.trim().includes(unitId)) {
                    // Look for a delete/remove button in the row
                    const deleteBtn = rows.nth(i).locator('button:has-text("Delete"), button:has-text("Remove"), button[aria-label*="delete"], button[aria-label*="remove"], img[alt*="delete"]');
                    if (await deleteBtn.count() > 0) {
                        await deleteBtn.first().click();
                        await this.page.waitForTimeout(2000);
                    } else {
                        // Try the ALL radio deselect approach - click ALL radio to re-select then use remove
                        await rows.nth(i).locator(BIN_LOCATION_PAGE.ROW_ALL_RADIO).click();
                        await this.page.waitForTimeout(500);
                    }
                    break;
                }
            }
            // Handle any confirmation dialog
            const confirmBtn = this.page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("OK")');
            if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await confirmBtn.click();
                await this.page.waitForTimeout(2000);
            }
        });
    }

    /**
     * Changes the bin location for an already-binned unit.
     * @param {string} unitId - The UNIT ID whose bin to change
     * @param {string} newBinLocation - New bin location code
     * @param {string} newCompartment - New compartment label
     * @returns {Promise<Object>} Change result
     */
    async performChangeBinLocation(unitId, newBinLocation, newCompartment) {
        return await allure.step(`Change bin: unit ${unitId} → new bin ${newBinLocation}`, async () => {
            const rows = this.page.locator(BIN_LOCATION_PAGE.ASSIGNMENT_TABLE_BODY_ROWS);
            const count = await rows.count();
            for (let i = 0; i < count; i++) {
                const cellText = await rows.nth(i).locator(BIN_LOCATION_PAGE.ROW_UNIT_ID_CELL).innerText();
                if (cellText.trim().includes(unitId)) {
                    // Click on the bin location cell or edit button to change
                    const editBtn = rows.nth(i).locator('button:has-text("Edit"), button:has-text("Change"), button[aria-label*="edit"]');
                    if (await editBtn.count() > 0) {
                        await editBtn.first().click();
                    } else {
                        // Re-select ALL radio and add to new bin
                        await rows.nth(i).locator(BIN_LOCATION_PAGE.ROW_ALL_RADIO).click();
                    }
                    await this.page.waitForTimeout(500);
                    break;
                }
            }

            // Click Add New Bin to assign to new location
            await this.clickAddNewBin();
            await this.page.waitForTimeout(2000);

            // Fill bin dialog with new location
            await this._fillBinDialog(newBinLocation, newCompartment);

            return { unitId, newBinLocation, newCompartment, type: 'CHANGE' };
        });
    }

    /**
     * Gets the current bin location for a unit from the assignment table.
     * @param {string} unitId - The UNIT ID to look up
     * @returns {Promise<string|null>} Bin location or null if not found
     */
    async getBinLocationForUnit(unitId) {
        const rows = this.page.locator(BIN_LOCATION_PAGE.ASSIGNMENT_TABLE_BODY_ROWS);
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            const cellText = await rows.nth(i).locator(BIN_LOCATION_PAGE.ROW_UNIT_ID_CELL).innerText();
            if (cellText.trim().includes(unitId)) {
                const builtPcs = await rows.nth(i).locator(BIN_LOCATION_PAGE.ROW_BUILT_PCS_CELL).innerText();
                return builtPcs.trim();
            }
        }
        return null;
    }

    /**
     * Gets the table header info (flight, date, from, to, bin location).
     * @returns {Promise<Object>} Header information
     */
    async getTableHeaderInfo() {
        const headers = {};
        const flightHeader = this.page.locator(BIN_LOCATION_PAGE.HEADER_FLIGHT);
        const dateHeader = this.page.locator(BIN_LOCATION_PAGE.HEADER_DATE);
        const fromHeader = this.page.locator(BIN_LOCATION_PAGE.HEADER_FROM);
        const toHeader = this.page.locator(BIN_LOCATION_PAGE.HEADER_TO);
        const binHeader = this.page.locator(BIN_LOCATION_PAGE.HEADER_BIN_LOCATION);

        if (await flightHeader.isVisible()) headers.flight = (await flightHeader.innerText()).trim();
        if (await dateHeader.isVisible()) headers.date = (await dateHeader.innerText()).trim();
        if (await fromHeader.isVisible()) headers.from = (await fromHeader.innerText()).trim();
        if (await toHeader.isVisible()) headers.to = (await toHeader.innerText()).trim();
        if (await binHeader.isVisible()) headers.binLocation = (await binHeader.innerText()).trim();

        return headers;
    }

    /**
     * Checks whether the page is on the default binning search screen
     * (not the assignment table).
     * @returns {Promise<boolean>}
     */
    async isOnSearchScreen() {
        return this.page.locator(BIN_LOCATION_PAGE.FLIGHT_DATE_INPUT).isVisible();
    }

    // ==================== PRIVATE HELPERS ====================

    /**
     * Fills the "Get Bin Name" dialog with bin location and compartment, then submits.
     * @param {string} binLocation - Bin location code
     * @param {string} compartment - Compartment label
     * @private
     */
    async _fillBinDialog(binLocation, compartment) {
        const binInput = this.page.locator(BIN_LOCATION_PAGE.BIN_LOCATION_INPUT);
        await binInput.waitFor({ state: 'visible', timeout: 5000 });
        await binInput.fill(binLocation);

        // Select compartment
        const compartmentOption = this.page.locator(`option:has-text("${compartment}")`);
        if (await compartmentOption.isVisible()) {
            await compartmentOption.click();
        }

        // Submit bin dialog
        await this.page.locator(BIN_LOCATION_PAGE.BIN_DIALOG_SUBMIT_BUTTON).click();
        await this.page.waitForTimeout(2000);
    }
}
