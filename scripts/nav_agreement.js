var Navicon = Navicon || {};

Navicon.nav_agreement = (function() {

    /**
     * ключи полей формы 
     */
    const agrNameKey = "nav_name";
    const agrCarIdKey = "nav_autoid";
    const agrContactIdKey = "nav_contact";
    const agrDateKey = "nav_date";
    const agrSumKey = "nav_sum";
    const agrIsPayedKey = "nav_fact";
    const creditIdKey = "nav_creditid";
    const creditPeriodKey = "nav_creditperiod";
    const agrCreditAmountKey = "nav_creditamount";
    const agrCreditFullAmountKey = "nav_fullcreditamount";
    const agrInitialfeeKey = "nav_initialfee";
    const payedSumField = "nav_factsumma";
    const agrPaymentPlanDateKey = "nav_paymentplandate";

    /**
     * ключи сущностей 
     */
    const creditEntityKey = "nav_credit";
    const carEntityKey = "nav_auto";
    const modelEntityKey = 'nav_model';

    /**
     * ключи сущности авто 
     */
    const modelAmountKey = "nav_recomendedamount";
    const autoUsedKey = "nav_used";
    const autoAmountKey = "nav_amount";

    /**
     * ключи атрибутов кредитная программа 
     */
    const creditEndDateKey = "nav_dateend";
    const creditStartDateKey = "nav_datestart";

    /**
     * ключ вкладки Кредит
     */
    const creditTab = "nav_credittab";

    /**
     * объект состояния
     */
    const state = {};

    /**
     * Функция подписывающая обработчики на события изменений 
     * значений элементов формы
     */
    function subscribeAttributesChanges() {
        state.formContext.getAttribute(agrContactIdKey)
                   .addOnChange(onContactValueChanged);
        state.formContext.getAttribute(agrCarIdKey)
                   .addOnChange(onCarValueChanged);
        state.formContext.getAttribute(creditIdKey)
                   .addOnChange(onCreditValueChanged);
        state.formContext.getAttribute(agrNameKey)
                   .addOnChange(onAgreementNameValueChanged);
        //formContext.
    }

    /**
     * Обработчик изменения значения поля имени договора
     */
    function onAgreementNameValueChanged() {
        const agreementNameAttr = state.formContext.getAttribute(agrNameKey);
        const agreementNameValue = agreementNameAttr.getValue();
        if(agreementNameValue) {
            const newValue = agreementNameValue.replace(/[^0-9-]/g, '');
            agreementNameAttr.setValue(newValue);
        }
    }

    /**
     * Обработчик изменения значения поля автомобиль
     */
    function onCarValueChanged() {
        const values = state.formContext.getAttribute(agrCarIdKey).getValue();
        state.form = state.form || {};
        state.form.car = values ? values[0] : null;
        checkCreditTabVisible(state.formContext);
        if(form.car) {
            getCarActualAmount(form.car);
        } else {
            setCreditValue(null);
        }
    }

    /**
     * Обработчик изменения значения поля контакт
     */
    function onContactValueChanged() {
        const values = state.formContext.getAttribute(agrContactIdKey).getValue();
        state.form = state.form || {};
        state.form.contact = values ? values[0] : null;
        checkCreditTabVisible();
    }

    /**
     * Обработчик изменения значения поля кредитная программа
     */
    function onCreditValueChanged(executionContext) {

        const creditValues = state.formContext.getAttribute(creditIdKey).getValue();
        
        if(creditValues && creditValues[0]) {
            loadCredit(creditValues[0]);
            setCreditDisable(false);
        } else {
            setCreditDisable(true);
            hideAttributeError(creditIdKey);S
        }
    }

    /**
     * Функция переключения доступа к редактированию полей связанных с кредитом
     * @param {boolean} isDisabled состояние редактирования значений полей на вкладке Кредит
     */
    function setCreditDisable(isDisabled) {
        state.formContext.getControl(agrInitialfeeKey).setDisabled(isDisabled);
        state.formContext.getControl(agrPaymentPlanDateKey).setDisabled(isDisabled);
        state.formContext.getControl(agrCreditAmountKey).setDisabled(isDisabled);
        state.formContext.getControl(creditPeriodKey).setDisabled(isDisabled);
        state.formContext.getControl(agrCreditFullAmountKey).setDisabled(isDisabled);
        state.formContext.getControl(payedSumField).setDisabled(isDisabled);
    }

    /**
     * Функция проверяющая доступность вкладки Кредит
     */
    function checkCreditTabVisible() {
        if(state.form && state.form.car && state.form.contact) {
            state.formContext.ui.tabs.get(creditTab).setVisible(true);
        } else {
            state.formContext.ui.tabs.get(creditTab).setVisible(false);
        }
    }

    /**
     * Функция запроса стоимости автомобиля
     * @param {string} carid объект поля автомобиль
     */
    function getCarActualAmount(carid) {
        carid = carid.replace(/[{}]/g, '');
        Xrm.WebApi.retrieveRecord(carEntityKey, carid)
        .then(
            result => {
                if(result[autoUsedKey]) {
                    Xrm.WebApi.retrieveRecord(modelEntityKey, result[carModelKey])
                    .then(
                        result => {
                            setCreditValue(result[modelAmountKey]);
                        },
                        error => {
                            console.log(error);
                        }
                    )
                } else {
                    setCreditValue(result[autoAmountKey]);
                }
            },
            error => {
                console.log(error);
            }
        )
    }

    /**
     * Функция установки суммы кредита
     * @param {number} amount значение суммы
     */
    function setCreditValue(amount) {
        state.formContext.getAttribute(agrCreditAmountKey).setValue(amount);
    }

    /**
     * Функция запроса данных о кредитной программе
     * @param {object} credit объект поля кредитная программа
     */
    function loadCredit(credit) {
        Xrm.WebApi.retrieveRecord(creditEntityKey, credit.id)
        .then(
            result => {
                debugger;
                if(validateCreditDate(result[creditStartDateKey], result[creditEndDateKey], result[creditPeriodKey])) {
                    state.formContext.getAttribute(creditPeriodKey).setValue(result[creditPeriodKey]);
                    hideAttributeError(state.formContext, creditIdKey);
                } else {
                    showAttributeError(state.formContext, creditIdKey, 'Срок кредита истек');
                }
            }, 
            error => {
                console.log(error);
            }
        );
    }

    function validateCreditDate(startCreditDate, endCreditDate, creditPeriod) {
        const creditDate = new Date(endCreditDate);
        const today = new Date();   
        return creditDate > today;
    }

    function showAttributeError(attributeKey, message) {
        state.formContext.getAttribute(attributeKey).setIsValid(false, message);
        state.formContext.getControl(attributeKey).setNotification(message);
    }

    function hideAttributeError(attributeKey) {
        state.formContext.getAttribute(attributeKey).setIsValid(true, '');
        state.formContext.getControl(attributeKey).clearNotification();
    }

    function initForm(formContext) {
        subscribeAttributesChanges();
    }

    return {
        onLoad: function(context) {
            const formContext = context.getFormContext();
            initForm(formContext);
        }
    };
})();