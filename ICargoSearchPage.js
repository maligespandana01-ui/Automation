import * as allure from 'allure-js-commons';


export const ICARGO_SEARCH_PAGE = {
    SEARCH_INPUT: '#ic-screen-search',
    SEARCH_LIST_ITEM: 'xpath=//li[normalize-space()="${1}"]'
}

export class ICargoSearchPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.searchInput = this.page.locator(ICARGO_SEARCH_PAGE.SEARCH_INPUT);
    }

    // Methods
    async searchAndNavigateToScreen(screenName) {
        await allure.step(`Search for screen ${screenName} and navigate to it`, async () => {
            await this.page.waitForLoadState(); // Wait for the new page to load
            await this.searchInput.waitFor({ state: 'visible', timeout: 10000 }); // Wait for the search box to be available
            await this.searchInput.click();
            await this.searchInput.fill(''); // Clear the search input before typing
            await this.searchInput.fill(screenName);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.page.click(ICARGO_SEARCH_PAGE.SEARCH_LIST_ITEM.replace('${1}', screenName));
        });
    }
}
