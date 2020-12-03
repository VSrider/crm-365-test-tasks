var Navicon = Navicon || {}

Navicon.nav_auto = (function() {

    const amountKey = "nav_amount";
    const brandKey = "nav_brandid";
    const detailsKey = "nav_details";
    const isDamagedKey =  "nav_isdamaged";
    const kmKey = "nav_km";
    const modelKey = "nav_modelid";
    const ownersCountKey = "nav_ownerscount";
    const usedKey = "nav_used";
    const vechcleNumberKey = "nav_vechclenumber";
    const vinKey = "nav_vin";

    function onUsedCarValeChanged(executionContext) {
        const formContext = executionContext.getFormContext();
        const usedValue = formContext.getAttribute(usedKey).getValue();
        if(usedValue) {
            formContext.getControl(isDamagedKey).setVisible(true);
            formContext.getControl(kmKey).setVisible(true);
            formContext.getControl(ownersCountKey).setVisible(true);
        } else {
            formContext.getControl(isDamagedKey).setVisible(false);
            formContext.getControl(kmKey).setVisible(false);
            formContext.getControl(ownersCountKey).setVisible(false);
        }
    }

    function subscribeOnAttributesChanges(formContext) {
        formContext.getAttribute(usedKey)
                   .addOnChange(onUsedCarValeChanged);
    }


    return {
        onLoad(executionContext) {
            const formContext = executionContext.getFormContext();
            subscribeOnAttributesChanges(formContext);
        }
    }
})();


