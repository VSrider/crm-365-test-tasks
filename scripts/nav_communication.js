var Navicon = Navicon || {};

Navicon.nav_communication = (function(){

    const contactKey = "nav_contactid";
    const emailKey = "nav_email";
    const phoneKey = "nav_phone";
    const typeKey = "nav_type";
    const isBaseKey = "nav_main";

    const typeOptions = {
        phone : 1,
        email : 2,
    }

    function onTypeValueChanged(executionContext) {
        const formContext = executionContext.getFormContext();
        checkConntectionTypeSetted(formContext);
    }

    function checkConntectionTypeSetted(formContext) {
        const keyValue = formContext.getAttribute(typeKey).getValue();
        if(keyValue === typeOptions.phone) {
            formContext.getControl(phoneKey).setVisible(true);
            formContext.getControl(emailKey).setVisible(false);
        } else if (keyValue === typeOptions.email) {
            formContext.getControl(emailKey).setVisible(true);
            formContext.getControl(phoneKey).setVisible(false);
        } else {
            formContext.getControl(emailKey).setVisible(false);
            formContext.getControl(phoneKey).setVisible(false);
        }
    }

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