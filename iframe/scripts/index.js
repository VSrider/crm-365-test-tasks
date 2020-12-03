(function() {
    
    function buildFetch(brandId) {
        const fetch = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                        "<entity name='nav_credit' alias='credit' >" +
                            "<attribute name='nav_creditid' />" +
                            "<attribute name='nav_name' />" +
                            "<attribute name='nav_creditperiod' />" +
                            "<link-entity name='nav_nav_auto_nav_credit' from='nav_creditid' to='nav_creditid' alias='ac' link-type='inner' >" +
                                "<link-entity name='nav_auto' from='nav_autoid' to='nav_autoid' alias='a'> " +
                                    "<link-entity name='nav_model' from='nav_modelid' to='nav_modelid' alias='model' >" +
                                        "<attribute name='nav_modelid' />" +
                                        "<attribute name='nav_name' />" +
                                    "</link-entity>" +
                                    "<filter>" +
                                        "<condition attribute='nav_brandid' operator='eq' value='" + brandId + "' />" +
                                    "</filter>" +
                                "</link-entity>" +
                            "</link-entity>" +
                        "</entity>" +
                    "</fetch>";
        return "?fetchXml=" + encodeURIComponent(fetch);
    }

    const gridModel = {
        defaultColDef: {
            width: 150,
            editable: false,
            resizable: true,
        },
        columnDefs: [
            {
                headerName: "CreditId",
                field: "nav_creditid",
            },
            {
                headerName: "ModelId",
                field: "model.nav_modelid",
            },
            {
                headerName: "Кредитная программа", 
                field: "nav_name"
            },
            {
                headerName: "Модель", 
                field: "model.nav_name"
            },
            {
                headerName: "Срок кредита", 
                field: "nav_creditperiod"
            },
          ],
        rowData:[],
        pagination: true,
        paginationPageSize: 20,
    };

    function initGrid() {
        var gridElement = document.getElementById('credit-grid');
        new agGrid.Grid(gridElement, gridModel);
        gridModel.onCellClicked = onCellClicked;
    }

    function onCellClicked(data) {
        debugger
    };

    function initIframe() {
        debugger;
        console.log(parent.Xrm.WebApi);
        initGrid();
    }

    function openCredit(creditId) {
        const url = "organization.com/main.aspx?etn=nav_credit&pagetype=entityrecord&id=" + encodeURIComponent(creditId);
        window.open(url);
    }

    function openModel(modelId) {
        const url = "organization.com/main.aspx?etn=nav_credit&pagetype=entityrecord&id=" + encodeURIComponent(creditId);
        window.open(url);
    }

    function loadCredits(brand) {
        var fetch = buildFetch(brand);
        return Xrm.WebApi.retrieveMultipleRecords("nav_credit", fetch)
        
    }

    function fillGrid(brandId) {
        initGrid();
        loadCredits(brandId).then(
            result => {
                debugger;
                gridModel.api.setRowData(result.entities);
            },
            error => {
                debugger;
                const err = error;
                console.log(err);
            }
        );
    }

    
    function onDocumentLoad() {
        debugger
        const brandId = parent.Xrm.Page.data.entity.getId();
        if(brandId) {
            fillGrid(brandId);
        }
    }

    document.addEventListener('DOMContentLoaded', onDocumentLoad);
})();
