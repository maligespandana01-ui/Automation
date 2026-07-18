import { time } from "console";
import { TIMEOUTS } from "../../../utils/constants/Constants";

export const OPR352_AWB_ENQUIRY_PAGE = {
    CONTENT_FRAME: '[id="iCargoContentFrame"][name="iCargoContentFrameOPR352"]',
    AWB_INPUT_FIELD: '[id="Awb_DocumentNumber_idx"]',
    LIST_AWB_BUTTON: '#CMP_Operations_Shipment_UX_AwbEnquiry_list',
    THREE_DOT_MESSAGES_BUTTON: 'i[class="icon more-option"]',
    XSDG_MESSAGES_EXPANDER: 'xpath=//*[contains(@id,"accordion__title")][.//*[normalize-space(text())="XSDG"]]',
    XSDG_MESSAGES_FIELDS: 'xpath=./following-sibling::*[contains(@id,"accordion__body")]//div[@class="min-height-wrap"]',
    CLOSE_AWB_BUTTON: '[class="icon ico-close-fade switchtoalt  flipper flipper-ico"]',
    EDIT_AWB_BUTTON: '[class="icon ico-pencil-rounded-orange switchtoalt"]',

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

export class OPR352AwbEnquiryPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.contentFrame = this.page.frameLocator(OPR352_AWB_ENQUIRY_PAGE.CONTENT_FRAME);
        this.popupFrame = this.contentFrame.frameLocator(OPR352_AWB_ENQUIRY_PAGE.POPUP_CONTAINER_FRAME);
    }

    // Methods
    async isLocator(obj) {
        return obj && typeof obj.locator === 'function';
    }

    async getElements(selector) {
        const elements = this.contentFrame.locator(selector);
        await elements.first().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        return elements;
    }

    async getElementVisibilityStatus(selector) {
        const element = this.contentFrame.locator(selector);
        const isVisible = await element.isVisible({ timeout: TIMEOUTS.V_SHORT });
        return isVisible;
    }

    async typeTextIntoInputField(inputSelector, text) {
        const inputField = this.contentFrame.locator(inputSelector);
        await inputField.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        await inputField.fill(''); // Clear the input field before typing
        await inputField.pressSequentially(text);
    }

    async selectOptionFromDropdown(dropdownSelector, optionText) {
        const dropdown = this.contentFrame.locator(dropdownSelector);
        await dropdown.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        await dropdown.selectOption({ label: optionText });
    }

    async clickOnElement(elementSelector) {
        //check if elementSelector is locator or not and create locator accordingly
        let element;
        if (await this.isLocator(elementSelector)) {
            element = elementSelector;
        } else {
            element = this.contentFrame.locator(elementSelector);
        }
        await element.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        await element.click();
    }

    async waitForElementToBeVisible(selector) {
        const element = this.contentFrame.locator(selector);
        await element.first().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    }

    async getElementCount(selector) {
        const elements = this.contentFrame.locator(selector);
        await elements.first().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        return await elements.count();
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
        const isVisible = await element.isVisible({ timeout: TIMEOUTS.V_SHORT });
        return isVisible;
    }

    async popupWaitForElementToBeVisible(selector) {
        const element = this.popupFrame.locator(selector);
        await element.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    }

}
