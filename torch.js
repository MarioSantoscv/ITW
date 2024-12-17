// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;

    // API URL
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Torch_route');
    self.records = ko.observableArray([]);

    // Inicializar o Mapa
    var map = L.map('map').setView([48.8566, 2.3522], 5); // Posição inicial em Paris
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    var markersGroup = L.featureGroup().addTo(map);

    // Atualiza o mapa com marcadores
    self.updateMap = function () {
        markersGroup.clearLayers();
        self.records().forEach(record => {
            if (record.Lat && record.Lon) {
                const coords = [parseFloat(record.Lat), parseFloat(record.Lon)];
                const popupInfo = `<strong>${record.Title}</strong><br>City: ${record.City}<br>Stage: ${record.Stage_number}`;
                L.marker(coords).addTo(markersGroup).bindPopup(popupInfo);
            }
        });
        if (markersGroup.getLayers().length > 0) {
            map.fitBounds(markersGroup.getBounds());
        }
    };

    // Requisita dados da API
    self.activate = function () {
        console.log('CALL: getTorchRoute...');
        ajaxHelper(self.baseUri(), 'GET').done(function (data) {
            console.log(data);
            self.records(data);
            self.updateMap();
        }).fail(function (error) {
            alert("Failed to load data from API.");
            console.error(error);
        });
    };

    // Inicializa a aplicação
    self.activate();
    console.log("VM initialized!");
};

// Função AJAX
function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null
    });
}

$(document).ready(function () {
    console.log("Document ready, initializing ViewModel...");
    ko.applyBindings(new vm());
});
