import { TIMEOUTS } from "../../../utils/constants/Constants";

export const MSG005_LIST_MESSAGES_PAGE = {
    CONTENT_FRAME: '[name="iCargoContentFrameMSG005"]',
    MESSAGE_TYPE: '#CMP_LISTMESSAGE_MESSAGETYPE',
    INTERFACE_SYSTEM_DROPDOWN: '#CMP_LISTMESSAGE_INFSYS_COMBO',
    LIST_BUTTON: '#CMP_LISTMESSAGE_LIST_BUTTON',
    MESSAGES_LIST_ROWS: "#listmessaging tbody tr",
    SELECT_ALL_CHECKBOX: '[name="checkAll"]',
    VIEW_LIST_MESSAGES_BUTTON: '#CMP_LISTMESSAGE_VIEW_BUTTON',
    POPUP_CONTAINER_FRAME: 'iframe[name="popupContainerFrame"]',
    POPUP_CONTAINER_FRAME_TEXTAREA: '#CMP_LISTMESSAGESLOAD_RAWMSG_TXTAREA',
    POPUP_CONTAINER_FRAME_NEXT_BUTTON: '//a[normalize-space()="Next >"]',
    POPUP_CONTAINER_FRAME_CLOSE_BUTTON: '#CMP_LISTMSGS_UX_VIEW_CLOSE_BUTTON'
}

export class MSG005ListMessagesPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.contentFrame = this.page.frameLocator(MSG005_LIST_MESSAGES_PAGE.CONTENT_FRAME);
        this.popupFrame = this.contentFrame.frameLocator(MSG005_LIST_MESSAGES_PAGE.POPUP_CONTAINER_FRAME);
    }

    // Methods
    async typeTextIntoInputField(inputSelector, text) {
        const inputField = this.contentFrame.locator(inputSelector);
        await inputField.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        await inputField.pressSequentially(text);
    }

    async selectOptionFromDropdown(dropdownSelector, optionText) {
        const dropdown = this.contentFrame.locator(dropdownSelector);
        await dropdown.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        await dropdown.selectOption({ label: optionText });
    }

    async clickOnElement(elementSelector) {
        const element = this.contentFrame.locator(elementSelector);
        await element.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        await element.click();
    }

    async waitForElementToBeVisible(selector) {
        const element = this.contentFrame.locator(selector);
        await element.first().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    }

    async popupClickOnElement(elementSelector) {
        const element = this.popupFrame.locator(elementSelector);
        await element.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        await element.click();
    }

    async popupGetTextAreaValue(textAreaSelector) {
        const textArea = this.popupFrame.locator(textAreaSelector);
        await textArea.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        return await textArea.inputValue();
    }

    async popupGetElementVisibilityStatus(selector) {
        const element = this.popupFrame.locator(selector);
        const isVisible = await element.isVisible();
        return isVisible;
    }

    async popupWaitForElementToBeVisible(selector) {
        const element = this.popupFrame.locator(selector);
        await element.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    }
}
