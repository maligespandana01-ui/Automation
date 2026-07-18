import { TIMEOUTS } from "../../../utils/constants/Constants";
import { getEnvVariable } from "../../../utils/config/EnvLoader";
import { ENV_CONFIG_KEYS } from "../../../utils/constants/Constants";
import * as allure from 'allure-js-commons';

export const LOGIN_PAGE = {
    USERNAME_FIELD: '#username',
    PASSWORD_FIELD: '#password',
    SUBMIT_BUTTON: 'button[type="submit"]',
    INTERFACE_APP_WELCOME: 'css=[action="/iCargoInterfaceApp/welcome"]'
}

export class LoginPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.usernameInput = this.page.locator(LOGIN_PAGE.USERNAME_FIELD);
        this.passwordInput = this.page.locator(LOGIN_PAGE.PASSWORD_FIELD);
        this.loginButton = this.page.locator(LOGIN_PAGE.SUBMIT_BUTTON);
        this.interfaceAppWelcome = this.page.locator(LOGIN_PAGE.INTERFACE_APP_WELCOME);
    }

    // Methods
    async loginToNotocInterfaceApp(username, password) {
        await allure.step('Navigate to AutoNotoc Legacy InterfaceApp login page and perform login', async () => {
            await this.page.goto(getEnvVariable(ENV_CONFIG_KEYS.URL_AUTONOTOC_LEGACY_INTERFACEAPP_STAGE));
            //wait for page to load
            await new Promise(resolve => setTimeout(resolve, TIMEOUTS.SHORT));
            await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.LONG });
            const status = await this.interfaceAppWelcome.isVisible();
            if (!status) {
                await this.usernameInput.fill(username);
                await this.loginButton.click();
                await this.passwordInput.fill(password);
                await this.loginButton.click();
                //wait for page to load
                await new Promise(resolve => setTimeout(resolve, TIMEOUTS.SHORT));
                await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.LONG });
            }
        });
    }
}
