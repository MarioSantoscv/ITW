let fav = [];
let VM;
let favType = "favModalidades";

var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/Sports');
    self.displayName = 'Paris 2024 Torch Route';
    self.athletes = ko.observableArray([]);
    self.favList = ko.observable(fav);

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getRoutes...');
        var composedUri = self.baseUri();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.athletes(data);
            SetHearths(fav);
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

$(document).ready(function () {
    console.log("ready!");
    if (localStorage.getItem(favType) != null) {
        fav = JSON.parse(localStorage.getItem(favType));
        console.log(fav)
    }
    ko.applyBindings(new vm());
    ActiveAutocomplete(
        "#search",
        "http://192.168.160.58/Paris2024/api/Sports/Search?q=",
        "./Arbitros_Details.html?id=",
        "name",
        "id"
    );
});