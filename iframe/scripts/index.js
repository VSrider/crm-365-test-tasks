(function() {
    
    /**
     * id и ключи атрибутов
     */
    const modelIdKey = "modelId";
    const creditIdKey = "creditId";
    const creditPeriodKey = "creditPeriod";
    const modelNameKey = "modelName";
    const creditNameKey = "creditName";

    const modelEntityKey = "nav_model";
    const creditEntityKey = "nav_credit";

    const gridElementId = "credit-grid";

    /**
     * Создает строку запроса кредитных программ связанных с автомобилями данной марки
     * @param {string} brandId id макри автомобиля
     * @returns {string} строка запроса
     */
    function buildFetch(brandId) {
        const fetch = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>" +
                        "<entity name='nav_credit' alias='credit' >" +
                            "<attribute name='nav_creditid' alias='creditId'/>" +
                            "<attribute name='nav_name' alias='creditName'/>" +
                            "<attribute name='nav_creditperiod' alias='creditPeriod'/>" +
                            "<link-entity name='nav_nav_auto_nav_credit' from='nav_creditid' to='nav_creditid' alias='ac' link-type='inner' >" +
                                "<link-entity name='nav_auto' from='nav_autoid' to='nav_autoid' alias='a'> " +
                                    "<link-entity name='nav_model' from='nav_modelid' to='nav_modelid' alias='model' >" +
                                        "<attribute name='nav_modelid' alias='modelId'/>" +
                                        "<attribute name='nav_name' alias='modelName'/>" +
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

    /**
     * Модель таблицы
     */
    const gridModel = {
        defaultColDef: {
            width: 150,
            editable: false,
            resizable: true,
        },
        columnDefs: [
            {
                headerName: "Кредитная программа", 
                field: creditNameKey,
                width: 200,
            },
            {
                headerName: "Модель", 
                field: modelNameKey
            },
            {
                headerName: "Срок кредита", 
                field: creditPeriodKey
            },
          ],
        rowData:[],
        pagination: true,
        paginationPageSize: 20,
    };

    /**
     * Инициализация таблицы в документе
     */
    function initGrid() {
        const gridElement = document.getElementById(gridElementId);
        new agGrid.Grid(gridElement, gridModel);
        gridModel.onCellClicked = onCellClicked;
        gridModel.rowHeight = 50;
    }

    /**
     * Обработчик события клика на ячейку
     * @param {object} data 
     */
    function onCellClicked(data) {
        if(data.column.colId === modelNameKey) {
            openRecordInNewTab(modelEntityKey, data.data[modelIdKey]);
        } else if (data.column.colId === creditNameKey) {
            openRecordInNewTab(creditEntityKey, data.data[creditIdKey]);
        }
    };

    /**
     * Функция открывающая запись в новой вкладке
     * @param {string} entityName 
     * @param {number} recordId 
     */
    function openRecordInNewTab(entityName, recordId) {
        const url = location.origin + "/main.aspx?pagetype=entityrecord&etn="+entityName+"&id="+encodeURIComponent(recordId);
        window.open(url, "_blank");
    }

    /**
     * Функция запрашивающая данные о кредитных программах в которых находятся автомобили данной марки
     * @param {string} brand id марки автомобиля
     */
    function loadCredits(brand) {
        const fetch = buildFetch(brand);
        return Xrm.WebApi.retrieveMultipleRecords(creditEntityKey, fetch);
    }
    
    /**
     * Обработчик события полной загрузки документа
     */
    function onDocumentLoad() {
        const brandId = parent.Xrm.Page.data.entity.getId();
        if(brandId) {
            initGrid();
            loadCredits(brandId).then(
                result => {
                    gridModel.api.setRowData(result.entities);
                },
                error => {
                    console.log(error);
                }
            );
        }
    }

    document.addEventListener('DOMContentLoaded', onDocumentLoad);
})();
