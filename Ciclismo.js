// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Cycling_Tracks/Events');
    self.displayName = 'Paris 2024 Torch Route';
    self.records = ko.observableArray([]);
    self.EventId = ko.observable("Unavailable");
    self.StagesId = ko.observable("Unavailable");
    //--- Page Events
    self.activate = function (id,name) {
        console.log('CALL: getRoutes...');
        let composedUri = self.baseUri() + "?EventId=" + id + "&StageId=" + name;
        self.EventId(id);
        self.StagesId(name);
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.records(data);
        });
    };

    //--- start ....
    self.activate(1);
    console.log("VM initialized!");
}
//--- Internal functions
function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            alert("AJAX Call[" + uri + "] Fail...");
        }
    });
}
function getPage() {
    var currentUrl = String(window.location.search);
    let parameters = currentUrl.split("?")[1]?.split("&");
    if (parameters && parameters[0]) {
        let id = parameters[0].split("=")[1];
        let name = parameters[1].split("=")[1];
        console.log("ID extracted from URL: " + id);
        self.active(id, name);
    } else {
        console.error("No ID found in the URL.");
    }
}

getPage();

$('document').ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});
