import { BasePage } from './BasePage.js';
import { TIMEOUTS, ENV_CONFIG_KEYS } from '../../../utils/constants/Constants.js';
import { getEnvVariable } from '../../../utils/config/EnvLoader.js';
import * as allure from 'allure-js-commons';

/**
 * Selectors for the AutoNOTOC login page.
 * Update these selectors after running the Playwright MCP server against the live UI
 * to capture the actual DOM structure.
 */
export const AUTONOTOC_LOGIN_PAGE = {
    USERNAME_INPUT: '#username',
    PASSWORD_INPUT: '#password',
    NEXT_BUTTON: '//button[normalize-space()="Next"]',
    LOGIN_BUTTON: '//button[normalize-space()="Submit"]',
    LOGIN_ERROR_MESSAGE: '.error-message',
};

/**
 * AutoNotocLoginPage - Handles authentication for the AutoNOTOC application.
 * Reuses the existing AUTONOTOC_LEGACY_STAGE credentials.
 */
export class AutoNotocLoginPage extends BasePage {
    constructor(page) {
        super(page);
    }

    /**
     * Navigates to the AutoNOTOC application and performs login.
     * @param {string} username - Login username
     * @param {string} password - Login password
     */
    async login(username, password) {
        await allure.step('Navigate to AutoNOTOC and perform login', async () => {
            await this.page.goto(getEnvVariable(ENV_CONFIG_KEYS.URL_AUTONOTOC_NONPROD), {
                waitUntil: 'domcontentloaded',
                timeout: TIMEOUTS.LONG
            });
            // Wait for the login form or main app to be visible (SPA — networkidle may never fire)
            await this.page.waitForSelector(
                `${AUTONOTOC_LOGIN_PAGE.USERNAME_INPUT}, a[href="/emergency-response-report"], nav, main`,
                { state: 'visible', timeout: TIMEOUTS.LONG }
            ).catch(() => {});

            // Check if already logged in (session may persist)
            const loginRequired = await this.isVisible(AUTONOTOC_LOGIN_PAGE.USERNAME_INPUT);
            if (loginRequired) {
                await this.fillText(AUTONOTOC_LOGIN_PAGE.USERNAME_INPUT, username);
                await this.click(AUTONOTOC_LOGIN_PAGE.NEXT_BUTTON);
                await this.waitForVisible(AUTONOTOC_LOGIN_PAGE.PASSWORD_INPUT);
                await this.fillText(AUTONOTOC_LOGIN_PAGE.PASSWORD_INPUT, password);
                await this.click(AUTONOTOC_LOGIN_PAGE.LOGIN_BUTTON);
                // Wait for the post-login app shell to appear
                await this.page.waitForSelector(
                    'nav, main, a[href="/emergency-response-report"], [class*="menu"], [class*="sidebar"]',
                    { state: 'visible', timeout: TIMEOUTS.LONG }
                ).catch(() => {});
            }
        });
    }

    /**
     * Navigates directly to the Bin Location Assignment screen after login.
     */
    async navigateToBinLocationAssignment() {
        await allure.step('Navigate to Bin Location Assignment screen', async () => {
            await this.page.goto(getEnvVariable(ENV_CONFIG_KEYS.URL_AUTONOTOC_BIN_LOCATION), {
                waitUntil: 'domcontentloaded',
                timeout: TIMEOUTS.LONG
            });
            await this.waitForPageLoad();
        });
    }
}
