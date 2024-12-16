// Inicializar o mapa
var map = L.map('map').setView([48.8566, 2.3522], 5); // Posição inicial (Paris)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Marcadores para locais
var markersLayer = L.layerGroup().addTo(map);

// Requisição para a API de estádios
$.ajax({
    type: "GET",
    url: "http://192.168.160.58/Paris2024/api/Venues",
    success: function (data) {
        data.forEach(venue => {
            if (venue.Lat && venue.Lon) {
                const coords = [parseFloat(venue.Lat), parseFloat(venue.Lon)];

                // Criar marcador azul padrão
                const marker = L.marker(coords, { icon: blueIcon })
                    .addTo(markersLayer)
                    .bindPopup(`
            <b>${venue.Name}</b><br>
            Start: ${venue.DateStart || "N/A"}<br>
            End: ${venue.DateEnd || "N/A"}<br>
            Sports: ${venue.NumSports || 0}
          `);

                // Evento de clique para destacar marcador
                marker.on('click', function () {
                    map.setView(coords, 10); // Zoom ao clicar
                    markersLayer.clearLayers(); // Limpar camadas anteriores

                    // Marcar o estádio selecionado em vermelho
                    L.marker(coords, { icon: redIcon })
                        .addTo(markersLayer)
                        .bindPopup(`
              <b>${venue.Name}</b><br>
              Start: ${venue.DateStart || "N/A"}<br>
              End: ${venue.DateEnd || "N/A"}<br>
              Sports: ${venue.NumSports || 0}
            `).openPopup();

                    // Restaurar outras marcações
                    data.forEach(v => {
                        if (v.Lat && v.Lon && v.Id !== venue.Id) {
                            L.marker([parseFloat(v.Lat), parseFloat(v.Lon)], { icon: blueIcon })
                                .addTo(markersLayer)
                                .bindPopup(`
                  <b>${v.Name}</b><br>
                  Start: ${v.DateStart || "N/A"}<br>
                  End: ${v.DateEnd || "N/A"}<br>
                  Sports: ${v.NumSports || 0}
                `);
                        }
                    });
                });
            }
        });
    },
    error: function () {
        alert("Erro ao carregar dados dos estádios.");
    }
});

// Ícones personalizados
var blueIcon = L.icon({
    iconUrl: '/imagens/mapmarker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

var redIcon = L.icon({
    iconUrl: '/imagens/mapmarker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
// ViewModel KnockOut

let fav = [];
let VM;
let favType = "favEstadios";
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Venues');
    self.displayName = 'Paris 2024 Torch Route';
    self.records = ko.observableArray([]);
    self.favList = ko.observable(fav);
    

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getRoutes...');
        var composedUri = self.baseUri();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.records(data);
            SetHearths(fav);
        });
    };

    //--- start ....
    self.activate(1);
    console.log("VM initialized!");

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

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };


    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    if (localStorage.getItem(favType) != null) {
        fav = JSON.parse(localStorage.getItem(favType));
        console.log(fav)
    }
    ko.applyBindings(new vm());
    ActiveAutocomplete(
        "#search",
        "http://192.168.160.58/Paris2024/api/Venues/Search?q=",
        "./Estadios_details.html?id=",
        "name",
        "id"
    );
});


$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})
