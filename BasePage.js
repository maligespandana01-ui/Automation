import { TIMEOUTS } from '../../../utils/constants/Constants.js';

/**
 * BasePage - Abstract base class for all AutoNOTOC page objects.
 * Provides shared interaction methods to eliminate duplication across page objects.
 */
export class BasePage {
    /**
     * @param {import('@playwright/test').Page} page - Playwright page instance
     * @param {string|null} contentFrameSelector - Optional iframe selector if page uses frames
     */
    constructor(page, contentFrameSelector = null) {
        this.page = page;
        this.frame = contentFrameSelector
            ? this.page.frameLocator(contentFrameSelector)
            : this.page;
    }

    /**
     * Types text into an input field after clearing it.
     * @param {string} selector - CSS/XPath selector for the input field
     * @param {string} text - Text to type into the field
     */
    async typeText(selector, text) {
        const element = this.frame.locator(selector);
        await element.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        await element.fill('');
        await element.pressSequentially(text);
    }

    /**
     * Fills an input field with text (faster than typeText, no sequential key presses).
     * @param {string} selector - CSS/XPath selector for the input field
     * @param {string} text - Text to fill into the field
     */
    async fillText(selector, text) {
        const element = this.frame.locator(selector);
        await element.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        await element.fill(text);
    }

    /**
     * Clicks on an element. Accepts either a string selector or a Playwright Locator.
     * @param {string|import('@playwright/test').Locator} selectorOrLocator
     */
    async click(selectorOrLocator) {
        const element = typeof selectorOrLocator === 'string'
            ? this.frame.locator(selectorOrLocator)
            : selectorOrLocator;
        await element.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        await element.click();
    }

    /**
     * Checks if an element is visible on the page.
     * @param {string} selector - CSS/XPath selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<boolean>}
     */
    async isVisible(selector, timeout = TIMEOUTS.V_SHORT) {
        return this.frame.locator(selector).isVisible({ timeout });
    }

    /**
     * Waits for an element to become visible.
     * @param {string} selector - CSS/XPath selector
     */
    async waitForVisible(selector) {
        await this.frame.locator(selector).first().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    }

    /**
     * Gets the inner text of an element.
     * @param {string} selector - CSS/XPath selector
     * @returns {Promise<string>}
     */
    async getText(selector) {
        const element = this.frame.locator(selector);
        await element.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        return element.innerText();
    }

    /**
     * Gets the input value of an element (for input/textarea fields).
     * @param {string} selector - CSS/XPath selector
     * @returns {Promise<string>}
     */
    async getInputValue(selector) {
        const element = this.frame.locator(selector);
        await element.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        return element.inputValue();
    }

    /**
     * Selects an option from a dropdown by its visible label.
     * @param {string} selector - CSS/XPath selector for the dropdown
     * @param {string} label - Visible label of the option to select
     */
    async selectDropdown(selector, label) {
        const element = this.frame.locator(selector);
        await element.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        await element.selectOption({ label });
    }

    /**
     * Gets all elements matching a selector.
     * @param {string} selector - CSS/XPath selector
     * @returns {Promise<import('@playwright/test').Locator>}
     */
    async getElements(selector) {
        const elements = this.frame.locator(selector);
        await elements.first().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        return elements;
    }

    /**
     * Gets the count of elements matching a selector.
     * @param {string} selector - CSS/XPath selector
     * @returns {Promise<number>}
     */
    async getElementCount(selector) {
        return this.frame.locator(selector).count();
    }

    /**
     * Gets all table row data as an array of objects.
     * @param {string} rowSelector - Selector for table rows (e.g., 'tbody tr')
     * @param {Object.<string, string>} columnMap - Map of field names to cell selectors (e.g., { flight: 'td:nth-child(1)' })
     * @returns {Promise<Array<Object>>}
     */
    async getTableData(rowSelector, columnMap) {
        const rows = this.frame.locator(rowSelector);
        const count = await rows.count();
        const data = [];
        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            const rowData = {};
            for (const [key, cellSelector] of Object.entries(columnMap)) {
                rowData[key] = (await row.locator(cellSelector).innerText()).trim();
            }
            data.push(rowData);
        }
        return data;
    }

    /**
     * Waits for navigation to complete after an action.
     * Uses 'load' state rather than 'networkidle' to avoid timeouts on pages
     * that keep background network connections open (polling, SSE, etc.).
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('load', { timeout: TIMEOUTS.LONG });
    }

    /**
     * Takes a screenshot and returns the buffer (useful for Allure attachments).
     * @returns {Promise<Buffer>}
     */
    async takeScreenshot() {
        return this.page.screenshot({ fullPage: true });
    }
}
