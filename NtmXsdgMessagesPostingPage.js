import { TIMEOUTS } from "../../../utils/constants/Constants";
import * as allure from 'allure-js-commons';
import { getEnvVariable } from "../../../utils/config/EnvLoader";
import { ENV_CONFIG_KEYS } from "../../../utils/constants/Constants";

export const NTM_XSDG_MESSAGES_POSTING_PAGE = {
    POST_NTM_MESSAGE_HYPERLINK: 'xpath=//a[normalize-space()="Post NTM Message"]',
    POST_XSDG_MESSAGE_HYPERLINK: 'xpath=//a[normalize-space()="Post XSDG Message"]',
    XSDG_MESSAGE_TEXTAREA: 'textarea[name="message1"]',
    NTM_MESSAGE_TEXTAREA: 'textarea[name="message"]',
    POST_TO_MQ_BUTTON: 'input[value="Post to MQ"]',
    POST_ONE_MORE_MESSAGE_BUTTON: 'xpath=//a[normalize-space()="Post one more message"]'
}

export class NtmXsdgMessagesPostingPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.postNtmMessageHyperlink = this.page.locator(NTM_XSDG_MESSAGES_POSTING_PAGE.POST_NTM_MESSAGE_HYPERLINK);
        this.postXsdgMessageHyperlink = this.page.locator(NTM_XSDG_MESSAGES_POSTING_PAGE.POST_XSDG_MESSAGE_HYPERLINK);
    }

    async refreshPageUntilProperlyLoaded() {
        const refreshRetryLimit = 10;
        await allure.step('Refresh the page until "Post XSDG Message" link is visible to ensure the page is properly loaded', async () => {
            for (let refreshRetryCounter = 0; refreshRetryCounter < refreshRetryLimit; refreshRetryCounter++) {
                try {
                    await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.LONG });
                    const isPageLoaded = await this.postXsdgMessageHyperlink.isVisible({ timeout: TIMEOUTS.LONG });
                    if (isPageLoaded) {
                        break; // Exit the loop if the element is found
                    }
                    //reload the same url
                    await this.page.goto(getEnvVariable(ENV_CONFIG_KEYS.URL_AUTONOTOC_LEGACY_INTERFACEAPP_STAGE));
                } catch (error) {
                    console.warn(`Attempt ${refreshRetryCounter + 1}: "Post XSDG Message" link not found. Reloading the page.`, error?.message || error);
                    try {
                        await this.page.goto(getEnvVariable(ENV_CONFIG_KEYS.URL_AUTONOTOC_LEGACY_INTERFACEAPP_STAGE), { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.MEDIUM });
                    } catch (reloadError) {
                        console.warn(`Reload attempt ${refreshRetryCounter + 1} failed:`, reloadError?.message || reloadError);
                    }
                }
            }
        });
    }
}
