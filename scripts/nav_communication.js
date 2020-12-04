var Navicon = Navicon || {};

Navicon.nav_communication = (function(){

    /**
     * Ключи атрибутов
     */
    const contactKey = "nav_contactid";
    const emailKey = "nav_email";
    const phoneKey = "nav_phone";
    const typeKey = "nav_type";
    const isBaseKey = "nav_main";

    /**
     * типы связи
     */
    const typeOptions = {
        phone : 1,
        email : 2,
    }

    /**
     * Обработчик события измениения типа связи
     * @param {object} executionContext контекст выполнения
     */
    function onTypeValueChanged(executionContext) {
        const formContext = executionContext.getFormContext();
        checkConntectionTypeSetted(formContext);
    }

    /**
     * Функция обрабатывающая состояние типа связи 
     * @param {object} formContext контекст формы
     */
    function checkConntectionTypeSetted(formContext) {
        const keyValue = formContext.getAttribute(typeKey).getValue();
        if(keyValue === typeOptions.phone) {
            changeEmailPhoneVisibility(true, false);
        } else if (keyValue === typeOptions.email) {
            changeEmailPhoneVisibility(false, true);
        } else {
            changeEmailPhoneVisibility(false, false);
        }
    }

    /**
     * Функция изменяющая видимость полей Email и Телефон
     * @param {boolean} isPhoneVisible видно ли поле Телефон
     * @param {boolean} isEmailVisible видно ли поле Email
     */
    function changeEmailPhoneVisibility(isPhoneVisible, isEmailVisible) {
        formContext.getControl(emailKey).setVisible(isEmailVisible);
        formContext.getControl(phoneKey).setVisible(isPhoneVisible);
    }

    /**
     * Функция подписывающая обработчики на события изменеиния значений в полях формы
     * @param {object} formContext контекст формы
     */
    function subcribeAttributesChanges(formContext) {
        formContext.getAttribute(typeKey)
                   .addOnChange(onTypeValueChanged);
    }

    return {
        onLoad: function(executionContext) {
            const formContext = executionContext.getFormContext();
            subcribeAttributesChanges(formContext);
            checkConntectionTypeSetted(formContext);
        }
    }
})();