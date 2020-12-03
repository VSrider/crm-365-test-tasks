var Navicon = Navicon || {};

Navicon.nav_agreement = (function() {

    //ключи полей формы
    const agreementField = "nav_name";
    const carField = "nav_autoid";
    const contactField = "nav_contact";
    const dateField = "nav_date";
    const sumField = "nav_sum";
    const isPayedField = "nav_fact";
    const creditField = "nav_creditid";
    const creditPeriodField = "nav_creditperiod";
    const creditSumField = "nav_creditamount";
    const creditFullSumField = "nav_fullcreditamount";
    const firstPaymentField = "nav_initialfee";
    const payedSumField = "nav_factsumma";
    const paymentPlanDateKey = "nav_paymentplandate";


    const creditEntityKey = "nav_credit";
    const carEntityKey = "nav_auto";
    const modelEntityKey = 'nav_model';

    const carModelKey = "nav_modelid";
    const carModelAmountKey = "nav_recomendedamount";
    const carUsedKey = "nav_used";
    const carAmountKey = "nam_amount";

    //ключи вкладок формы
    const creditTab = "nav_credittab";

    function subscribeAttributesChanges(formContext) {
        formContext.getAttribute(contactField)
                   .addOnChange(onContactValueChanged);
        formContext.getAttribute(carField)
                   .addOnChange(onCarValueChanged);
        formContext.getAttribute(creditField)
                   .addOnChange(onCreditValueChanged);
        formContext.getAttribute(agreementField)
                   .addOnChange(onAgreementNameValueChanged);
        formContext.ge
    }

    function onAgreementNameValueChanged(executionContext) {
        const formContext = executionContext.getFormContext();
        const agreementNameAttr = formContext.getAttribute(agreementField);
        const agreementNameValue = agreementNameAttr.getValue();
        if(agreementNameValue) {
            const newValue = agreementNameValue.replace(/[^0-9-]/g, '');
            agreementNameAttr.setValue(newValue);
        }
    }

    function onCarValueChanged(context) {
        const formContext = context.getFormContext();
        form.car = formContext.getAttribute(carField).getValue()[0];
        checkCreditTabVisible(formContext);
        getCarActualAmount(formContext);
    }

    function onContactValueChanged(context) {
        const formContext = context.getFormContext();
        form.contact = formContext.getAttribute(contactField).getValue()[0];
        checkCreditTabVisible(formContext);
    }

    function onCreditValueChanged(executionContext) {
        const formContext = executionContext.getFormContext();
        // const firstPaymentCtrl = formContext.getControl(firstPaymentField);
        // const paymentPlanDateCtrl = formContext.getControl(paymentPlanDate);
        const creditPeriodCtrl = formContext.getControl(creditPeriodField);
        const creditFullSumCtrl = formContext.getControl(creditFullSumField);
        const creditSumCtrl = formContext.getControl(creditSumField);
        const payedSumCtrl = formContext.getControl(payedSumField);

        const creditValues = formContext.getAttribute(creditField).getValue();
        
        if(creditValues && creditValues[0]) {
            // firstPaymentCtrl.setDisabled(false);
            // paymentPlanDateCtrl.setDisabled(false);
            creditSumCtrl.setDisabled(false);
            creditPeriodCtrl.setDisabled(false);
            creditFullSumCtrl.setDisabled(false);
            payedSumCtrl.setDisabled(false);
            loadCredit(creditValues[0]);
        } else {
            // firstPaymentCtrl.setDisabled(true);
            // paymentPlanDateCtrl.setDisabled(true);
            creditSumCtrl.setDisabled(true);
            creditPeriodCtrl.setDisabled(true);
            creditFullSumCtrl.setDisabled(true);
            payedSumCtrl.setDisabled(true);
        }
    }

    function checkCreditTabVisible(formContext) {
        if(form.car && form.contact) {
            formContext.ui.tabs.get(creditTab).setVisible(true);
        } else {
            formContext.ui.tabs.get(creditTab).setVisible(false);
        }
    }

    function getCarActualAmount(car, formContext) {
        Xrm.WebApi.retrieveRecord(carEntityKey, car.id)
        .then(
            result => {
                if(result[carUsedKey]) {
                    Xrm.WebApi.retrieveRecord(modelEntityKey, result[carModelKey])
                    .then(
                        result => {
                            ShowCarAmount(result[carModelAmountKey]);
                        },
                        error => {

                        }
                    )
                } else {
                    ShowCarAmount(result[carAmountKey]);
                }
            },
            error => {

            }
        )
    }

    function loadCredit(credit, formContext) {
        Xrm.WebApi.retrieveRecord(creditEntityKey, credit.id)
        .then(
            result => {
                debugger;
                const creditDate = result.nav_enddate;
                const agreementDateAttr = formContext.getAttribute(dateField);
                if(validateCreditDate(creditDate)) {
                    agreementDateAttr.setValue(creditDate);
                }
            }, 
            error => {
            }
        );
    }

    function validateCreditDate(creditDate, agreementDate, formContext) {
        if(creditDate && agreementDate && formContext) {
            if(creditDate < agreementDate) {
                formContext.getAttribute(creditField).setIsValid(false, 'Время кредита действия истекло');
                formContext.getControl(creditField).setNotification();
            } else {
                formContext.getAttribute(creditField).setIsValid(true, '');
                formContext.getControl(creditField).clearNotification();
            }
        }
    }

    function initForm(formContext) {
        subscribeAttributesChanges(formContext);
    }

    return {
        onLoad: function(context) {
            const formContext = context.getFormContext();
            initForm(formContext);
        }
    };
})();