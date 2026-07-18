import { getEnvVariable } from '../../../utils/config/EnvLoader.js';
import { ENV_CONFIG_KEYS } from '../../../utils/constants/Constants.js';
import * as allure from 'allure-js-commons';


export class ICargoLoginPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.usernameInput = this.page.locator('#username');
        this.passwordInput = this.page.locator('#password');
        this.loginButton = this.page.locator('button[type="submit"]');
        this.errorMessage = this.page.locator('.error-message');
    }

    // Methods
    async loginToICargo(username, password) {
        return await allure.step('Navigate to iCargo login page and perform login', async () => {
            await this.page.goto(getEnvVariable(ENV_CONFIG_KEYS.URL_ICARGO_EXTERNAL));
            await this.usernameInput.fill(username);
            await this.loginButton.click();
            await this.passwordInput.fill(password);
            await this.loginButton.click();
            //get context of the current page to listen for new page event
            const context = this.page.context();
            //wait for new popup window after login and switch to it
            const [newPage] = await Promise.all([context.waitForEvent('page'),]); // This promise resolves when a new page opens
            return newPage;
        });
    }
}
