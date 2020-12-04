var Navicon = Navicon || {};

Navicon.nav_agreement_ribbon = (function() {

    /**
     * Ключи атрибутов
     */
    const sumKey = "nav_sum";
    const firstPaymentKey = "nav_initialfee";
    const creditKey = "nav_creditid";
    const creditPeriodKey = "nav_creditperiod";
    const creditSumKey = "nav_creditamount";
    const creditFullSumKey = "nav_fullcreditamount";
    const persentKey = "nav_percent";

    const creditEntityKey = "nav_credit";

    /**
     * объект состояния
     */
    const state = {};

    /**
     * Функция расчета суммы кредита
     * @param {number} sum предварительная сумма кредита
     * @param {number} firstPayment сумма первого платежа
     * @returns {number} итоговая сумма кредита
     */
    function calcCreditSum(sum, firstPayment) {
        return sum - firstPayment;
    }

    /**
     * Функция расчета полной суммы кредита
     * @param {number} creditSum сумма кредита
     * @param {number} percent процент
     * @param {number} creditPeriod преиод кредита
     * @returns {number} сумма полного кредита
     */
    function calcCreditFullSum(creditSum, percent, creditPeriod) {
        if(creditSum && percent && creditPeriod) {
            return percent/100*creditPeriod*creditSum + creditSum;
        }
    }

    /**
     * функция загрузки данных о кредитной программе
     * @param {string} creditid id кредитной программы
     * @param {function} success обработчик успешной загрузки
     * @param {function} error обработчик неудачной загрузки
     */
    function loadCredit(creditid, success, error) {
        if (credit && 
            typeof success === 'function' && 
            typeof error === 'function') {
            Xrm.WebApi
               .retrieveRecord(creditEntityKey, creditid)
               .then(success, error);
        }   
    }

    /**
     * Функция вставляет значения сумм в соответствующие им поля на форме
     * @param {number} creditSum сумма кредита
     * @param {number} creditFullSum полная сумма кредита
     */
    function showCreditSums(creditSum, creditFullSum) {
        state.formContext.getAttribute(creditSumKey).setValue(creditSum);
        state.formContext.getAttribute(creditFullSumKey).setValue(creditFullSum);
    }

    /**
     * Функция расчета сумм кредита и вывода их в поля
     */
    function calcCreditSums() {
        const creditPeriod = state.formContext.getAttribute(creditPeriodKey).getValue();
        const firstPayment = state.formContext.getAttribute(firstPaymentKey).getValue();
        const sum = state.formContext.getAttribute(sumKey).getValue();
        const credits = state.formContext.getAttribute(creditKey).getValue();

        if(sum && creditPeriodKey && firstPayment && credits) {
            loadCredit(credits[0].id.replace(/[{}]/g, ''), 
                result => {
                    const creditSum = calcCreditSum(sum, firstPayment);
                    const creditFullSum = calcCreditFullSum(creditSum, result.nav_percent, creditPeriod);
                    showCreditSums(creditSum, creditFullSum);
                }, 
                error => {
                    console.log(error);
                }
            );
        }
    }

    return {
            calcCredit : function() {
                state.formContext = executionContext.getFormContext();
                calcCreditSums();
        }
    }
})();