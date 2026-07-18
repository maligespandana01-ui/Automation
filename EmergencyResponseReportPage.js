import { BasePage } from './BasePage.js';
import { TIMEOUTS } from '../../../utils/constants/Constants.js';
import * as allure from 'allure-js-commons';
import { Logger } from '../../../utils/helpers/Logger.js';

/**
 * Selectors for the Emergency Response Report screen.
 * Covers search form, report header, hazmat detail table, footer info,
 * and action buttons (Laser, Sabre Hardcopy, Export to PDF, Exit).
 */
export const EMERGENCY_RESPONSE_PAGE = {
    // ==================== NAVIGATION ====================
    NAV_EMERGENCY_RESPONSE_LINK: 'a[href="/emergency-response-report"]',

    // ==================== SEARCH FORM ====================
    PAGE_HEADING: 'text=Dangerous Goods - Emergency Response Report',
    FLIGHT_DATE_INPUT: 'input[type="date"], input[placeholder="MM/DD/YYYY"]',
    FLIGHT_NUMBER_DROPDOWN: 'select >> nth=0',
    ORIGIN_DROPDOWN: 'select >> nth=1',
    DESTINATION_INPUT: 'input[readonly], input[disabled]',
    SUBMIT_BUTTON: 'button:has-text("Submit")',

    // ==================== REPORT HEADER ====================
    REPORT_TITLE: ':text("EMERGENCY RESPONSE REPORT")',
    REPORT_SUBTITLE: 'text=DANGEROUS GOODS (HAZARDOUS MATERIALS) DETAIL',
    LOCAL_DATETIME: 'text=Local:',
    GMT_DATETIME: 'text=GMT:',

    // ==================== FLIGHT INFO ROW ====================
    FLIGHT_INFO_ROW: 'table tr:has(th:has-text("Flight:"), td:has-text("Flight:"))',
    REPORT_FLIGHT_NUMBER: 'td:has-text("Flight:") >> nth=0',
    REPORT_DATE: 'td:has-text("Date:") >> nth=0',
    REPORT_FROM: 'td:has-text("From:") >> nth=0',
    REPORT_TO: 'td:has-text("To:") >> nth=0',
    REPORT_UNIT_NUM: 'td:has-text("Unit Num:") >> nth=0',
    REPORT_BIN_LOCATION: 'td:has-text("Bin Location:") >> nth=0',
    REPORT_CARGO_TYPE: 'td:has-text("Cargo") >> nth=0',

    // ==================== HAZMAT DETAIL TABLE ====================
    HAZMAT_TABLE: 'table',
    HAZMAT_TABLE_HEADER_ROW: 'table tr:has(th:has-text("Airbill"))',
    HAZMAT_TABLE_BODY_ROWS: 'table tbody tr',

    // AWB group header row (e.g., "001DFW23417553 (Total Packages=3)")
    AWB_GROUP_HEADER: 'td[colspan]',

    // Data rows within hazmat detail
    ROW_SEQUENCE: 'td >> nth=0',
    ROW_PROPER_SHIPPING_NAME: 'td >> nth=1',
    ROW_CLASS_DIVISION: 'td >> nth=2',
    ROW_UN_ID_NUMBER: 'td >> nth=3',
    ROW_RQ: 'td >> nth=4',
    ROW_LTD_QTY: 'td >> nth=5',
    ROW_NUM_PCS: 'td >> nth=6',
    ROW_NET_QTY: 'td >> nth=7',
    ROW_TOTAL_WEIGHT: 'td >> nth=8',
    ROW_HEIGHT: 'td >> nth=9',
    ROW_PACKING_GROUP: 'td >> nth=10',
    ROW_EXEMPTION: 'td >> nth=11',

    // ==================== EMERGENCY CONTACT SECTION ====================
    EMERGENCY_CONTACT_ROW: 'tr:has-text("Emergency Contact Num:")',
    DOMESTIC_CONTACT: 'text=Domestic',
    INTERNATIONAL_CONTACT: 'text=International',
    PIC_NOTICE: 'text=PIC must notify Operations Control',

    // ==================== SPECIAL HANDLING / VERIFIED BY ====================
    VERIFIED_BY_ROW: 'tr:has-text("Verified By:")',
    VERIFIED_BY_NAME: 'td:right-of(:text("Verified By:")) >> nth=0',
    VERIFIED_BY_EMP_NUM: 'td:right-of(:text("Emp Num:")) >> nth=0',
    LOADED_BY_NAME: 'td:right-of(:text("Loaded By:")) >> nth=0',
    LOADED_BY_EMP_NUM: 'td:right-of(:text("Emp Num:")) >> nth=1',
    ALL_ITEMS_OK: 'text=All items OK for Passenger and Cargo Aircraft',

    // ==================== FOOTER ====================
    END_OF_REPORT_TEXT: 'text=End of Emergency Response Report',
    USG13_LIMITS: 'text=USG-13 Limits per COMPARTMENT',

    // ==================== ACTION BUTTONS ====================
    LASER_BUTTON: 'button:has-text("Laser")',
    SABRE_HARDCOPY_BUTTON: 'button:has-text("Sabre Hardcopy")',
    EXPORT_PDF_BUTTON: 'button:has-text("Export to PDF")',
    EXIT_BUTTON: 'button:has-text("Exit")',
};

/**
 * EmergencyResponseReportPage - Page object for the Emergency Response Report
 * (INBOUND NOTOC) screen in the Cargo Dangerous Goods application.
 *
 * Supports:
 * - Navigating to the ERR screen
 * - Filling search criteria (flight date, flight number, origin)
 * - Submitting and waiting for report render
 * - Extracting all report data (flight info, hazmat rows, contact info, verified-by)
 * - Export to PDF with download capture
 * - Exit action
 */
export class EmergencyResponseReportPage extends BasePage {
    constructor(page) {
        super(page);
    }

    // ==================== NAVIGATION ====================

    /**
     * Navigates to the Emergency Response Report screen via the left menu link.
     */
    async navigateToEmergencyResponseReport() {
        await allure.step('Navigate to Emergency Response Report screen', async () => {
            await this.click(EMERGENCY_RESPONSE_PAGE.NAV_EMERGENCY_RESPONSE_LINK);
            // SPA navigation — wait for the page heading or date input to appear
            await this.page.waitForSelector(
                'input[type="date"], input[placeholder="MM/DD/YYYY"], button:has-text("Submit")',
                { state: 'visible', timeout: TIMEOUTS.LONG }
            );
            Logger.info('EmergencyResponseReportPage', 'Navigated to Emergency Response Report');
        });
    }

    // ==================== SEARCH FORM METHODS ====================

    /**
     * Sets the flight date in the search form.
     * Handles both type="date" (requires YYYY-MM-DD) and text inputs (MM/DD/YYYY).
     * @param {string} date - Flight date in MM/DD/YYYY format
     */
    async setFlightDate(date) {
        await allure.step(`Set flight date: ${date}`, async () => {
            const input = this.page.locator(EMERGENCY_RESPONSE_PAGE.FLIGHT_DATE_INPUT);
            await input.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
            const inputType = await input.getAttribute('type');

            await input.click();
            if (inputType === 'date') {
                // Convert MM/DD/YYYY to YYYY-MM-DD for native date inputs
                const [month, day, year] = date.split('/');
                const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                await input.fill(isoDate);
            } else {
                await input.fill('');
                await input.fill(date);
            }

            // CRITICAL: a plain fill() does NOT make the SPA reload the flight list.
            // The flight dropdown is repopulated only when the date field fires its
            // input/change events and the field is committed (blur). Without this,
            // the dropdown keeps showing the DEFAULT (today's) flights and the
            // requested flight is never found.
            await input.dispatchEvent('input');
            await input.dispatchEvent('change');
            await input.blur().catch(() => {});
            await this.page.keyboard.press('Tab').catch(() => {});
            Logger.debug('EmergencyResponseReportPage', `Flight date set to: ${date}`);
        });
    }

    /**
     * Selects a flight number from the dropdown.
     * Waits for the flight list to reload for the chosen date, then selects the
     * option whose leading flight-number token matches (leading zeros ignored,
     * so NTM "0106" matches dropdown "106 (JFK→LHR)").
     * @param {string} flightNumber - Flight number (e.g., "2761"/"0106") or full label.
     */
    async selectFlightNumber(flightNumber) {
        await allure.step(`Select flight number: ${flightNumber}`, async () => {
            const dropdown = this.page.locator(EMERGENCY_RESPONSE_PAGE.FLIGHT_NUMBER_DROPDOWN);

            // Wait for dropdown to be enabled (options load after date change)
            await dropdown.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
            await this.page.waitForTimeout(TIMEOUTS.V_SHORT);

            // Re-locate to get the enabled dropdown (may re-render after date change)
            const enabledDropdown = this.page.locator('select:not([disabled])').first();
            await enabledDropdown.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });

            // Strip leading zeros for comparison (NTM gives "0106", dropdown shows "106").
            const normalizedFlight = flightNumber.replace(/^0+/, '');

            // Wait for the SPECIFIC flight to appear after the date-driven reload.
            // (The dropdown may still hold the previous date's options momentarily,
            // so waiting only for "options.length > 1" is not enough.)
            await this.page.waitForFunction(
                (norm) => {
                    const el = document.querySelector('select:not([disabled])');
                    if (!el || !el.options) return false;
                    return Array.from(el.options).some((o) => {
                        const lead = (o.textContent || '').trim().split(/[\s(]/)[0].replace(/^0+/, '');
                        return lead === norm;
                    });
                },
                normalizedFlight,
                { timeout: TIMEOUTS.LONG }
            ).catch(() => {
                Logger.warn('EmergencyResponseReportPage', `Flight "${flightNumber}" did not appear in options within timeout`);
            });

            const options = await enabledDropdown.locator('option').allInnerTexts();
            Logger.info('EmergencyResponseReportPage', `Available flight options: ${JSON.stringify(options)}`);

            // Match by leading flight-number token (precise: avoids "106" matching "2106").
            const matchingOption = options.find((opt) => {
                const lead = opt.trim().split(/[\s(]/)[0].replace(/^0+/, '');
                return lead === normalizedFlight;
            });

            if (matchingOption) {
                await enabledDropdown.selectOption({ label: matchingOption });
                Logger.info('EmergencyResponseReportPage', `Selected flight: ${matchingOption}`);
            } else {
                // Try by value as fallback (strip leading zeros)
                Logger.warn('EmergencyResponseReportPage', `Flight "${flightNumber}" not found in options, trying by value`);
                await enabledDropdown.selectOption(normalizedFlight).catch(async () => {
                    await enabledDropdown.selectOption(flightNumber);
                });
            }
        });
    }

    /**
     * Selects an origin from the dropdown.
     * Waits for the dropdown to be enabled after flight number selection.
     * Supports partial match — finds the option containing the origin code.
     * @param {string} origin - Origin code (e.g., "DFW") or full label (e.g., "DFW - DALLAS FO")
     */
    async selectOrigin(origin) {
        await allure.step(`Select origin: ${origin}`, async () => {
            // Origin is the second select dropdown
            const dropdowns = this.page.locator('select:not([disabled])');
            const dropdownCount = await dropdowns.count();
            // Use the second enabled select for origin (first is flight number)
            const dropdown = dropdownCount > 1 ? dropdowns.nth(1) : dropdowns.first();
            await dropdown.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });

            const options = await dropdown.locator('option').allInnerTexts();
            Logger.info('EmergencyResponseReportPage', `Available origin options: ${JSON.stringify(options)}`);

            const matchingOption = options.find(opt =>
                opt.includes(origin) || opt.trim().startsWith(origin)
            );

            if (matchingOption) {
                await dropdown.selectOption({ label: matchingOption });
                Logger.info('EmergencyResponseReportPage', `Selected origin: ${matchingOption}`);
            } else {
                await dropdown.selectOption(origin);
            }
        });
    }

    /**
     * Gets the auto-populated destination value.
     * @returns {Promise<string>} Destination text
     */
    async getDestination() {
        const el = this.page.locator(EMERGENCY_RESPONSE_PAGE.DESTINATION_INPUT);
        return (await el.inputValue()).trim();
    }

    /**
     * Clicks the Submit button and waits for the report to load.
     */
    async clickSubmit() {
        await allure.step('Click Submit on Emergency Response Report', async () => {
            await this.click(EMERGENCY_RESPONSE_PAGE.SUBMIT_BUTTON);
            // SPA: submit triggers an AJAX call — wait for a report indicator or exit button
            // rather than a load event which never fires on SPA route changes
            await this.page.waitForSelector(
                'button:has-text("Exit"), text=End of Emergency Response Report, text=Flight:',
                { state: 'visible', timeout: TIMEOUTS.LONG }
            ).catch(async () => {
                // Fallback: if no specific indicator appears, wait for network to settle
                await this.page.waitForTimeout(TIMEOUTS.SHORT);
            });
            Logger.info('EmergencyResponseReportPage', 'Submit clicked, waiting for report');
        });
    }

    /**
     * Performs a full search with provided criteria and submits.
     * @param {Object} criteria - Search parameters
     * @param {string} criteria.flightDate - Flight date (MM/DD/YYYY)
     * @param {string} criteria.flightNumber - Flight number dropdown label
     * @param {string} criteria.origin - Origin dropdown label
     */
    async searchAndSubmit({ flightDate, flightNumber, origin }) {
        await allure.step('Fill Emergency Response Report search criteria and submit', async () => {
            if (flightDate) {
                await this.setFlightDate(flightDate);
                // Wait for dropdowns to populate after date change
                await this.page.waitForTimeout(TIMEOUTS.V_SHORT);
            }
            if (flightNumber) {
                await this.selectFlightNumber(flightNumber);
                // Wait for origin dropdown to populate after flight selection
                await this.page.waitForTimeout(TIMEOUTS.V_SHORT);
            }
            if (origin) await this.selectOrigin(origin);
            await this.clickSubmit();
        });
    }

    // ==================== REPORT DATA EXTRACTION ====================

    /**
     * Checks if the report has been rendered (report content visible).
     * Uses multiple indicators: report title text, flight info row, or exit button.
     * @returns {Promise<boolean>}
     */
    async isReportVisible() {
        // Check for the "End of Emergency Response Report" footer or flight info or Exit button
        const exitButton = this.page.locator(EMERGENCY_RESPONSE_PAGE.EXIT_BUTTON);
        const flightLabel = this.page.locator('text=Flight:').first();
        const endReport = this.page.locator('text=End of Emergency Response Report').first();

        const isExit = await exitButton.isVisible({ timeout: TIMEOUTS.V_SHORT }).catch(() => false);
        const isFlight = await flightLabel.isVisible({ timeout: TIMEOUTS.V_SHORT }).catch(() => false);
        const isEnd = await endReport.isVisible({ timeout: TIMEOUTS.V_SHORT }).catch(() => false);

        return isExit || isFlight || isEnd;
    }

    /**
     * Extracts the flight info header from the report.
     * Parses the first data row of the report table containing flight, date, from, to, unit num, bin location.
     * @returns {Promise<Object>} Flight info object
     */
    async getReportFlightInfo() {
        return allure.step('Extract flight info from report header', async () => {
            const flightInfoCells = this.page.locator('table tr').filter({ hasText: 'Flight:' }).first();
            const cellTexts = await flightInfoCells.locator('td, th').allInnerTexts();
            const rawText = cellTexts.join(' | ');
            Logger.debug('EmergencyResponseReportPage', 'Raw flight info', { rawText });

            // Parse structured data from all visible table cells in the flight row
            const allText = await this.page.locator('table').first().innerText();
            const flightInfo = this._parseFlightInfoFromTable(allText);

            await allure.attachment('Report Flight Info',
                JSON.stringify(flightInfo, null, 2), 'application/json');
            return flightInfo;
        });
    }

    /**
     * Extracts all hazmat detail rows from the report.
     * Each row contains: sequence, properShippingName, classDivision, unIdNumber,
     * rq, ltdQty, numPcs, netQty, totalWeight, height, packingGroup, exemption.
     * @returns {Promise<Array<Object>>} Array of hazmat row objects
     */
    async getHazmatDetailRows() {
        return allure.step('Extract hazmat detail rows from report', async () => {
            const tables = this.page.locator('table');
            const tableCount = await tables.count();
            const hazmatRows = [];

            for (let t = 0; t < tableCount; t++) {
                const table = tables.nth(t);
                const rows = table.locator('tr');
                const rowCount = await rows.count();

                for (let i = 0; i < rowCount; i++) {
                    const row = rows.nth(i);
                    const cells = row.locator('td');
                    const cellCount = await cells.count();

                    // Hazmat data rows typically have 12+ cells
                    if (cellCount >= 10) {
                        const cellTexts = [];
                        for (let c = 0; c < cellCount; c++) {
                            cellTexts.push((await cells.nth(c).innerText()).trim());
                        }

                        // Skip header-like rows
                        if (cellTexts[0].includes('Airbill') || cellTexts[0].includes('Flight:')) continue;
                        // Skip rows with "Emergency Contact" or "Verified By"
                        if (cellTexts.join(' ').match(/Emergency|Verified|Loaded|Emp Num/i)) continue;

                        // Detect sequence pattern like "1 of 2"
                        if (cellTexts[0].match(/\d+\s+of\s+\d+/i)) {
                            hazmatRows.push({
                                sequence: cellTexts[0],
                                properShippingName: cellTexts[1] || '',
                                classDivision: cellTexts[2] || '',
                                unIdNumber: cellTexts[3] || '',
                                rq: cellTexts[4] || '',
                                ltdQty: cellTexts[5] || '',
                                numPcs: cellTexts[6] || '',
                                netQty: cellTexts[7] || '',
                                totalWeight: cellTexts[8] || '',
                                height: cellTexts[9] || '',
                                packingGroup: cellTexts[10] || '',
                                exemption: cellTexts[11] || '',
                            });
                        }
                    }
                }
            }

            Logger.info('EmergencyResponseReportPage', `Extracted ${hazmatRows.length} hazmat detail rows`);
            await allure.attachment('Hazmat Detail Rows',
                JSON.stringify(hazmatRows, null, 2), 'application/json');
            return hazmatRows;
        });
    }

    /**
     * Extracts AWB group headers from the report (e.g., "001DFW23417553 (Total Packages=3)").
     * @returns {Promise<Array<{awbNumber: string, totalPackages: string}>>}
     */
    async getAwbGroupHeaders() {
        return allure.step('Extract AWB group headers', async () => {
            const colspanCells = this.page.locator('td[colspan]');
            const count = await colspanCells.count();
            const headers = [];

            for (let i = 0; i < count; i++) {
                const text = (await colspanCells.nth(i).innerText()).trim();
                const match = text.match(/^(\S+)\s*\(Total\s*Packages\s*=\s*(\d+)\)/i);
                if (match) {
                    headers.push({ awbNumber: match[1], totalPackages: match[2] });
                }
            }

            await allure.attachment('AWB Group Headers',
                JSON.stringify(headers, null, 2), 'application/json');
            return headers;
        });
    }

    /**
     * Extracts the verified-by and loaded-by information from the report.
     * @returns {Promise<Object>} { verifiedByName, verifiedByEmpNum, loadedByName, loadedByEmpNum }
     */
    async getVerificationInfo() {
        return allure.step('Extract verification info from report', async () => {
            const allText = await this.page.innerText('body');
            const info = {
                verifiedByName: this._extractBetween(allText, 'Verified By:', 'Loaded By:'),
                loadedByName: this._extractAfterLabel(allText, 'Loaded By:'),
                verifiedByEmpNum: '',
                loadedByEmpNum: '',
                allItemsOk: allText.includes('All items OK for Passenger and Cargo Aircraft'),
            };

            // Extract emp nums from rows containing "Emp Num:"
            const empNums = allText.match(/Emp\s*Num:\s*(\S+)/gi) || [];
            if (empNums.length >= 1) {
                info.verifiedByEmpNum = empNums[0].replace(/Emp\s*Num:\s*/i, '').trim();
            }
            if (empNums.length >= 2) {
                info.loadedByEmpNum = empNums[1].replace(/Emp\s*Num:\s*/i, '').trim();
            }

            await allure.attachment('Verification Info',
                JSON.stringify(info, null, 2), 'application/json');
            return info;
        });
    }

    /**
     * Extracts the emergency contact numbers from the report.
     * @returns {Promise<Object>} { domestic, international, picNotice }
     */
    async getEmergencyContactInfo() {
        return allure.step('Extract emergency contact info', async () => {
            const allText = await this.page.innerText('body');
            const domesticMatch = allText.match(/Domestic\s*[-–]\s*([\d][\d\s\-]*\d)/i);
            const intlMatch = allText.match(/International\s*[-–]\s*(\(\+\)[\d\s\-]+)/i);

            const info = {
                domestic: domesticMatch ? domesticMatch[1].replace(/\s+/g, ' ').trim() : '',
                international: intlMatch ? intlMatch[1].replace(/\s+/g, ' ').trim() : '',
                picNotice: allText.includes('PIC must notify Operations Control'),
            };

            await allure.attachment('Emergency Contact Info',
                JSON.stringify(info, null, 2), 'application/json');
            return info;
        });
    }

    /**
     * Extracts the end-of-report footer text.
     * @returns {Promise<string>}
     */
    async getEndOfReportText() {
        const allText = await this.page.innerText('body');
        // Capture the full footer line including flight date / number / origin / destination,
        // e.g. "**** End of Emergency Response Report Flt Date 06/12/2026 Flt Num 327 From ORD To LGA ****"
        const match = allText.match(/.*End of Emergency Response Report.*/i);
        if (match) return match[0].replace(/\*/g, '').replace(/\s+/g, ' ').trim();

        const el = this.page.locator('text=End of Emergency Response Report').first();
        if (await el.isVisible({ timeout: TIMEOUTS.SHORT })) {
            return (await el.innerText()).trim();
        }
        return '';
    }

    /**
     * Extracts the static notice texts that appear on every Emergency Response
     * Report regardless of flight/booking. Returns the full body text so callers
     * can assert the presence of each static block.
     * @returns {Promise<string>} Full report body text
     */
    async getStaticNoticesText() {
        const allText = await this.page.innerText('body');
        return allText.replace(/\s+/g, ' ').trim();
    }

    /**
     * Extracts bin location from the report header.
     * @returns {Promise<string>} Bin location text (e.g., "Not Available" or "A1")
     */
    async getReportBinLocation() {
        return allure.step('Extract bin location from report', async () => {
            const allText = await this.page.innerText('body');
            const match = allText.match(/Bin\s*Location:\s*(.+?)(?:\n|Cargo)/i);
            const binLocation = match ? match[1].trim() : '';
            Logger.info('EmergencyResponseReportPage', `Bin location: ${binLocation}`);
            return binLocation;
        });
    }

    /**
     * Extracts the unit number from the report header.
     * @returns {Promise<string>}
     */
    async getReportUnitNumber() {
        const allText = await this.page.innerText('body');
        const match = allText.match(/Unit\s*Num:\s*(\S+)/i);
        return match ? match[1].trim() : '';
    }

    /**
     * Extracts the Special Handling Info value from the report.
     * The report only renders a value here when the source XSDG carries one,
     * otherwise this section is blank.
     * @returns {Promise<string>}
     */
    async getSpecialHandlingInfo() {
        const allText = await this.page.innerText('body');
        const match = allText.match(/Special\s*Handling\s*(?:Info|Information)?\s*:?[^\S\r\n]*([^\t\r\n]*)/i);
        let value = match ? match[1].trim() : '';
        // If the captured text is actually the next field's label (because the
        // special-handling cell is empty), treat it as empty.
        if (/^(Verified\s*By|Loaded\s*By|Emp\s*Num|All\s*items|Emergency)/i.test(value)) {
            value = '';
        }
        return value;
    }

    /**
     * Extracts the radionuclide detail rows from the report. Each hazmat item that
     * is radioactive renders a sub-section with the labels
     * "Radionuclide Symbol | Chemical/Physical Form | Activity Level | Unit of Measure"
     * followed by a value row. Values are classified by pattern so empty cells do not
     * shift the mapping.
     * @returns {Promise<Array<{radionuclideSymbol: string, chemicalPhysicalForm: string, activityLevel: string, unitOfMeasure: string}>>}
     */
    async getRadionuclideRows() {
        return allure.step('Extract radionuclide detail rows from report', async () => {
            const rows = this.page.locator('tr');
            const rowCount = await rows.count();
            const result = [];

            for (let i = 0; i < rowCount; i++) {
                const labelText = (await rows.nth(i).innerText()).trim();
                const isLabelRow = /Radionuclide\s*Symbol/i.test(labelText)
                    && /Activity\s*Level/i.test(labelText)
                    && /Unit\s*of\s*Measure/i.test(labelText);
                if (!isLabelRow || i + 1 >= rowCount) continue;

                // Nested tables cause the outer wrapper row to also match the label
                // keywords while ALSO containing the values. Only the inner, pure label
                // row (whose text is just the four labels) should drive extraction.
                const stripped = labelText
                    .replace(/Radionuclide\s*Symbol/ig, '')
                    .replace(/Chemical\s*\/?\s*Physical\s*Form/ig, '')
                    .replace(/Activity\s*Level/ig, '')
                    .replace(/Unit\s*of\s*Measure/ig, '')
                    .trim();
                if (/[A-Za-z0-9]/.test(stripped)) continue; // wrapper row — contains values, skip

                const valueCells = rows.nth(i + 1).locator('td');
                const cellCount = await valueCells.count();
                const values = [];
                for (let c = 0; c < cellCount; c++) {
                    const v = (await valueCells.nth(c).innerText()).trim();
                    if (v) values.push(v);
                }

                // Classify the non-empty values by pattern
                let radionuclideSymbol = '';
                let activityLevel = '';
                let unitOfMeasure = '';
                const leftovers = [];
                for (const v of values) {
                    if (!radionuclideSymbol && /^[A-Za-z]{1,3}-\d+$/.test(v)) {
                        radionuclideSymbol = v;            // e.g. I-123
                    } else if (!activityLevel && /^\d+(\.\d+)?$/.test(v)) {
                        activityLevel = v;                 // e.g. 742.25
                    } else if (!unitOfMeasure && /^[A-Za-z0-9]{1,4}$/.test(v)) {
                        unitOfMeasure = v;                 // e.g. 4N / GBQ
                    } else {
                        leftovers.push(v);
                    }
                }

                result.push({
                    radionuclideSymbol,
                    chemicalPhysicalForm: leftovers.join(' '),
                    activityLevel,
                    unitOfMeasure,
                });
            }

            await allure.attachment('Radionuclide Detail Rows',
                JSON.stringify(result, null, 2), 'application/json');
            Logger.info('EmergencyResponseReportPage', `Extracted ${result.length} radionuclide rows`);
            return result;
        });
    }

    /**
     * Scrolls the full report from top to bottom and back, ensuring every
     * per-ULD box is laid out/rendered before extraction.
     * @private
     */
    async _scrollFullPage() {
        await this.page.evaluate(async () => {
            await new Promise(resolve => {
                let total = 0;
                const step = 500;
                const timer = setInterval(() => {
                    window.scrollBy(0, step);
                    total += step;
                    if (total >= document.body.scrollHeight) {
                        clearInterval(timer);
                        window.scrollTo(0, 0);
                        resolve();
                    }
                }, 40);
            });
        });
    }

    /**
     * Segments the Emergency Response Report into per-ULD boxes.
     *
     * A report that covers multiple ULDs renders one box per ULD, each with its
     * own "Unit Num:" header, an AWB group header ("<AWB> (Total Packages=N)")
     * and the hazmat detail rows for that ULD. This walks the report's rows in
     * document order, scrolling the whole page first so nothing is missed, and
     * groups the hazmat rows under the box they belong to.
     *
     * @returns {Promise<Array<{unitNum: string, awbNumber: string, totalPackages: string, hazmatRows: Array<Object>}>>}
     */
    async getReportBoxes() {
        return allure.step('Extract per-ULD report boxes', async () => {
            await this._scrollFullPage();

            const rows = this.page.locator('table tr');
            const rowCount = await rows.count();
            const boxes = [];
            let currentBox = null;
            let pendingUnit = '';

            for (let i = 0; i < rowCount; i++) {
                const row = rows.nth(i);
                const rowText = (await row.innerText()).trim();

                // 1. Flight-info header row carries the Unit Num for the box that follows.
                //    The ULD value can be preceded by stray tokens (e.g. a wrapped "F"
                //    flag) in the same cell, so prefer matching the IATA ULD code pattern
                //    (3 letters + 4-5 digits + 2-3 letter owner code) anywhere in the row.
                if (/Unit\s*Num:/i.test(rowText)) {
                    const uldMatch = rowText.match(/\b([A-Z]{3}\d{4,5}[A-Z]{2,3})\b/);
                    if (uldMatch) {
                        pendingUnit = uldMatch[1].trim();
                    } else {
                        const unitMatch = rowText.match(/Unit\s*Num:\s*([A-Z0-9]+)/i);
                        if (unitMatch) {
                            pendingUnit = unitMatch[1].trim();
                        }
                    }
                }

                // 2. AWB group header row starts a new box.
                const awbMatch = rowText.match(/(\S+)\s*\(Total\s*Packages\s*=\s*(\d+)\)/i);
                if (awbMatch) {
                    currentBox = {
                        unitNum: pendingUnit,
                        awbNumber: awbMatch[1],
                        totalPackages: awbMatch[2],
                        hazmatRows: [],
                    };
                    boxes.push(currentBox);
                    continue;
                }

                // 3. Hazmat data row belongs to the current box.
                const cells = row.locator('td');
                const cellCount = await cells.count();
                if (cellCount >= 10) {
                    const cellTexts = [];
                    for (let c = 0; c < cellCount; c++) {
                        cellTexts.push((await cells.nth(c).innerText()).trim());
                    }
                    if (/^\d+\s+of\s+\d+/i.test(cellTexts[0])) {
                        const hazmatRow = {
                            sequence: cellTexts[0],
                            properShippingName: cellTexts[1] || '',
                            classDivision: cellTexts[2] || '',
                            unIdNumber: cellTexts[3] || '',
                            rq: cellTexts[4] || '',
                            ltdQty: cellTexts[5] || '',
                            numPcs: cellTexts[6] || '',
                            netQty: cellTexts[7] || '',
                            totalWeight: cellTexts[8] || '',
                            height: cellTexts[9] || '',
                            packingGroup: cellTexts[10] || '',
                            exemption: cellTexts[11] || '',
                        };
                        if (!currentBox) {
                            // Hazmat row encountered before any AWB header — open an implicit box.
                            currentBox = { unitNum: pendingUnit, awbNumber: '', totalPackages: '', hazmatRows: [] };
                            boxes.push(currentBox);
                        }
                        currentBox.hazmatRows.push(hazmatRow);
                    }
                }
            }

            Logger.info('EmergencyResponseReportPage',
                `Extracted ${boxes.length} report box(es): ${boxes.map(b => `${b.unitNum}[${b.hazmatRows.length}]`).join(', ')}`);
            await allure.attachment('Report Boxes (per ULD)',
                JSON.stringify(boxes, null, 2), 'application/json');
            return boxes;
        });
    }

    /**
     * Extracts all report data into a single structured object for validation.
     * @returns {Promise<Object>} Complete report data
     */
    async extractFullReportData() {
        return allure.step('Extract full Emergency Response Report data', async () => {
            const [flightInfo, hazmatRows, awbHeaders, verificationInfo, emergencyContact] =
                await Promise.all([
                    this.getReportFlightInfo(),
                    this.getHazmatDetailRows(),
                    this.getAwbGroupHeaders(),
                    this.getVerificationInfo(),
                    this.getEmergencyContactInfo(),
                ]);

            const radionuclideRows = await this.getRadionuclideRows();
            const binLocation = await this.getReportBinLocation();
            const unitNumber = await this.getReportUnitNumber();
            const specialHandlingInfo = await this.getSpecialHandlingInfo();
            const endOfReport = await this.getEndOfReportText();
            const staticNoticesText = await this.getStaticNoticesText();
            const boxes = await this.getReportBoxes();

            const reportData = {
                flightInfo,
                hazmatRows,
                radionuclideRows,
                awbHeaders,
                boxes,
                verificationInfo,
                emergencyContact,
                binLocation,
                unitNumber,
                specialHandlingInfo,
                endOfReport,
                staticNoticesText,
            };

            await allure.attachment('Full Report Data',
                JSON.stringify(reportData, null, 2), 'application/json');
            Logger.info('EmergencyResponseReportPage', 'Full report data extracted');
            return reportData;
        });
    }

    // ==================== ACTION BUTTON METHODS ====================

    /**
     * Clicks "Export to PDF" and captures the downloaded file.
     * @param {string} downloadDir - Directory path to save the downloaded PDF
     * @returns {Promise<string>} Absolute path to the downloaded PDF file
     */
    async exportToPdf(downloadDir) {
        return allure.step('Export Emergency Response Report to PDF', async () => {
            const [download] = await Promise.all([
                this.page.waitForEvent('download', { timeout: TIMEOUTS.LONG }),
                this.click(EMERGENCY_RESPONSE_PAGE.EXPORT_PDF_BUTTON),
            ]);

            const filePath = `${downloadDir}/${download.suggestedFilename()}`;
            await download.saveAs(filePath);
            Logger.info('EmergencyResponseReportPage', `PDF downloaded to: ${filePath}`);
            await allure.attachment('Downloaded PDF Path', filePath, 'text/plain');
            return filePath;
        });
    }

    /**
     * Clicks the Laser print button.
     */
    async clickLaserPrint() {
        await allure.step('Click Laser print', async () => {
            await this.click(EMERGENCY_RESPONSE_PAGE.LASER_BUTTON);
        });
    }

    /**
     * Clicks the Sabre Hardcopy button.
     */
    async clickSabreHardcopy() {
        await allure.step('Click Sabre Hardcopy', async () => {
            await this.click(EMERGENCY_RESPONSE_PAGE.SABRE_HARDCOPY_BUTTON);
        });
    }

    /**
     * Clicks the Exit button to return to the main menu.
     */
    async clickExit() {
        await allure.step('Click Exit on Emergency Response Report', async () => {
            await this.click(EMERGENCY_RESPONSE_PAGE.EXIT_BUTTON);
            await this.waitForPageLoad();
            Logger.info('EmergencyResponseReportPage', 'Exited Emergency Response Report');
        });
    }

    /**
     * Takes a full-page screenshot and attaches it to Allure.
     * @param {string} name - Screenshot name for Allure attachment
     */
    async captureScreenshot(name = 'Emergency Response Report') {
        const screenshot = await this.takeScreenshot();
        await allure.attachment(name, screenshot, 'image/png');
    }

    // ==================== PRIVATE HELPERS ====================

    /**
     * Parses flight info from table text content.
     * @param {string} tableText - Inner text of the report table
     * @returns {Object} Parsed flight info
     * @private
     */
    _parseFlightInfoFromTable(tableText) {
        const info = {
            flightNumber: '',
            date: '',
            from: '',
            to: '',
            unitNum: '',
            binLocation: '',
            cargoType: '',
        };

        const flightMatch = tableText.match(/Flight:\s*(\S+)/i);
        if (flightMatch) info.flightNumber = flightMatch[1];

        const dateMatch = tableText.match(/Date:\s*(\S+)/i);
        if (dateMatch) info.date = dateMatch[1];

        const fromMatch = tableText.match(/From:\s*(\S+)/i);
        if (fromMatch) info.from = fromMatch[1];

        const toMatch = tableText.match(/To:\s*(\S+)/i);
        if (toMatch) info.to = toMatch[1];

        const unitMatch = tableText.match(/Unit\s*Num:\s*(\S+)/i);
        if (unitMatch) info.unitNum = unitMatch[1];

        const binMatch = tableText.match(/Bin\s*Location:\s*(.+?)(?:\t|\n|Cargo)/i);
        if (binMatch) info.binLocation = binMatch[1].trim();

        const cargoMatch = tableText.match(/Cargo\s*$/im);
        if (cargoMatch) info.cargoType = 'Cargo';

        return info;
    }

    /**
     * Extracts text between two labels in a block of text.
     * @param {string} text - Full text content
     * @param {string} startLabel - Start label
     * @param {string} endLabel - End label
     * @returns {string} Extracted text
     * @private
     */
    _extractBetween(text, startLabel, endLabel) {
        const regex = new RegExp(`${startLabel}\\s*(.+?)\\s*${endLabel}`, 'is');
        const match = text.match(regex);
        return match ? match[1].trim() : '';
    }

    /**
     * Extracts text after a label.
     * @param {string} text - Full text content
     * @param {string} label - Label to search for
     * @returns {string} Extracted text
     * @private
     */
    _extractAfterLabel(text, label) {
        const regex = new RegExp(`${label}\\s*(.+?)(?:\\n|$)`, 'i');
        const match = text.match(regex);
        return match ? match[1].trim() : '';
    }
}



//cd c:\Hazraps\cgodangergds-test-automation; npx playwright test tests/notoc/e2e/EmergencyResponseReport.sample.e2e.spec.js --project="E2E - API → UI → DB Validation Suite" --reporter=list
//node node_modules\allure-commandline\bin\allure generate allure-results --clean -o allure-report
//node node_modules\allure-commandline\bin\allure open allure-report