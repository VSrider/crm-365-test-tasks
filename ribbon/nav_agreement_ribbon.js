var Navicon = Navicon || {};

Navicon.nav_agreement_ribbon = (function() {

    const sumKey = 'nav_sum';
    const firstPaymentKey = 'nav_initialfee';
    const creditKey = 'nav_creditid';
    const creditPeriodKey = 'nav_creditperiod';
    const creditSumKey = 'nav_creditamount';
    const creditFullSumKey = "nav_fullcreditamount";
    const persentKey = "nav_percent";

    const creditEntityKey = "nav_credit";

    const state = {};

    function calcCreditSum(sum, firstPayment) {
            return sum - firstPayment;
    }

    function calcCreditFullSum(creditSum, percent, creditPeriod) {
        if(creditSum && percent && creditPeriod) {
            return percent/100*creditPeriod*creditSum + creditSum;
        }
    }

    function loadCredit(credit, success, error) {
        if (credit && 
            typeof success === 'function' && 
            typeof error === 'function') {
            Xrm.WebApi
               .retrieveRecord(creditEntityKey, credits[0].id)
               .then(success, error);
        }   
    }

    function showCreditSums(creditSum, creditFullSum) {
        state.formContext.getAttribute(creditSumKey).setValue(creditSum);
        state.formContext.getAttribute(creditFullSumKey).setValue(creditFullSum);
    }

    function calcCreditSums() {
        const creditPeriod = state.formContext.getAttribute(creditPeriodKey).getValue();
        const firstPayment = state.formContext.getAttribute(firstPaymentKey).getValue();
        const sum = state.formContext.getAttribute(sumKey).getValue();
        const credits = state.formContext.getAttribute(creditKey).getValue();
        if(sum && creditPeriodKey && firstPayment && credits) {
            loadCredit(credits[0], 
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
                debugger
                state.formContext = executionContext.getFormContext();
                calcCreditSums();
        }
    }
})();