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
            },{
                headerName: "Node ID", 
                field: "node_id"
            },{
                headerName: "Название", 
                field: "name"
            },{
                headerName: "Полное название", 
                field: "full_name"
            },{
                headerName: "Скрыто", 
                field: "private"
            },{
                headerName: "Владелец", 
                field: "owner.login"
            },{
                headerName: "ID владельца", 
                hide: true,
                field: "owner.id"
            },{
                headerName: "Node ID владельца", 
                hide: true,
                field: "owner.node_id"
            },{
                headerName: "Avatar Url", 
                hide: true,
                field: "owner.avatar_url"
            },{
                headerName: "Gravatar ID", 
                hide: true,
                field: "owner.gravatar_id"
            },{
                headerName: "URL", 
                hide: true,
                field: "owner.url"
            },{
                headerName: "Html Url", 
                hide: true,
                field: "owner.html_url"
            },{
                headerName: "Followers Url", 
                hide: true,
                field: "owner.followers_url"
            },{
                headerName: "Following Url", 
                hide: true,
                field: "owner.following_url"
            },{
                headerName: "Gists Url", 
                hide: true,
                field: "owner.gists_url"
            },{
                headerName: "Starred Url", 
                hide: true,
                field: "owner.starred_url"
            },{
                headerName: "Subscriptions Url", 
                hide: true,
                field: "owner.subscriptions_url"
            },{
                headerName: "Organizations Url", 
                hide: true,
                field: "owner.organizations_url"
            },{
                headerName: "Repos Url", 
                hide: true,
                field: "owner.repos_url"
            },{
                headerName: "Events Url", 
                hide: true,
                field: "owner.events_url"
            },{
                headerName: "Received Events Url", 
                hide: true,
                field: "owner.received_events_url"
            },{
                headerName: "Type", 
                hide: true,
                field: "owner.type"
            },{
                headerName: "Site Admin", 
                hide: true,
                field: "owner.site_admin"
            },{
                headerName: "Описание", 
                field: "description"
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
