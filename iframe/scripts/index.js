(function(){
    
    const fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                        "<entity name='nav_credit' >" +
                            "<attribute name='nav_creditid' />" +
                            "<attribute name='nav_name' />" +
                            "<attribute name='nav_creditperiod' />" +
                            "<link-entity name='credits_auto' from='creditid' to='id' alias='ca' link-type='inner' />" +
                            "<link-entity name='auto' from='id' to='id' alias='a' link-type='inner'></link-entity>" +
                            "<link-entity name='auto' from='id' to='autoid' alias='a' link-type='outer'>" +
                            "<filter>" +
                                "<condition attribute='nav_brandid' operator='eq' value='1' />" +
                            "</filter>" +
                            "</link-entity>" +
                        "</entity>" +
                    "</fetch>";


    const gridModel = {
        defaultColDef: {
            width: 150,
            editable: true,
            resizable: true,
        },
        columnDefs: [
            {
                headerName: "ID", 
                field: "id"
            },
          ],
        rowData:[],
        pagination: true,
        paginationPageSize: 20,
    };

    function initGrid() {
        var gridElement = document.getElementById('credit-grid');
        new agGrid.Grid(gridElement, gridModel);
    }

    function onDocumentLoaded() {
        debugger;
        console.log(parent.Xrm.WebApi);
        initGrid();
    }

    function openCredit() {

    }

    document.addEventListener("DOMContentLoaded", onDocumentLoaded);
})();
