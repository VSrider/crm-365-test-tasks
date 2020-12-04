var Navicon = Navicon || {};

Navicon.nav_credit = (function(){

    /**
     * Ключи атрибутов
     */
    const bankKey = "nav_bank";
    const creditPeriodKey = "nav_creditperiod";
    const endDateKey = "nav_dateend";
    const startDateKey = "nav_datestart";
    const persentKey = "nav_percent";

    /**
     * обработчик события изменения даты 
     * @param {object} executionContext контекст выполнения
     */
    function onDateChanged(executionContext) {
        const formContext = executionContext.getFormContext();
        const startDateValue = formContext.getAttribute(startDateKey).getValue();
        const endDateValue = formContext.getAttribute(endDateKey).getValue();

        if(endDateValue && startDateValue) {
            const timePeriod = endDateValue.getFullYear() - startDateValue.getFullYear();
            if(timePeriod < 1) {
                showError(formContext, endDateKey, 'Дата окончания должна быть больше даты начала минимум на 1 год');
            } else {
                hideError(formContext, endDateKey);
            }
        }
        console.log(startDateValue);
        console.log(endDateValue);
    }

    /**
     * Функция отображаюшая сообщение об ошибке
     * @param {object} formContext контекст формы
     * @param {string} attrKey имя атрибута поля 
     * @param {string} message сообщение об ошибке
     */
    function showError(formContext, attrKey, message) {
        formContext.getAttribute(attrKey).setIsValid(false, message);
        formContext.getControl(attrKey).setNotification(message);
    }

    /**
     * Функция скрывающая сообщение об ошибке
     * @param {object} formContext контекст формы
     * @param {string} attrKey имя атрибута поля 
     */
    function hideError(formContext, attrKey) {
        formContext.getAttribute(attrKey).setIsValid(true);
        formContext.getControl(attrKey).clearNotification();
    }

    /**
     * Функция подписывающая обработчики на события изменения значений полей
     * @param {object} formContext контекст формы
     */
    function subscribeAttributesChanges(formContext) {
        formContext.getAttribute(startDateKey)
                   .addOnChange(onDateChanged);
        formContext.getAttribute(endDateKey)
                   .addOnChange(onDateChanged);
    }

    return {
        onLoad : function(executionContext) {
            const formContext = executionContext.getFormContext();
            subscribeAttributesChanges(formContext);
        }
    }
})();