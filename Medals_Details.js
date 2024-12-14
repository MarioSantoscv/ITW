var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;

    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/Api/Medals/');
    self.Id = ko.observable("Unavailable");
    self.WinnerName = ko.observable("Unavailable");
    self.SportId = ko.observable("Unavailable");
    self.MedalName = ko.observable("Unavailable");
    self.Sex = ko.observable("Unavailable");
    self.Competition = ko.observable("Unavailable");
    self.CountryName = ko.observable("Unavailable");
    self.Sport = ko.observable("Unavailable");

    
    self.MedalImage = ko.computed(function () {
        switch (self.MedalName().toLowerCase()) {
            case "gold":
                return "imagens/gold_medall.jpg"; 
            case "silver":
                return "imagens/silver_medal.jpg"; 
            case "bronze":
                return "imagens/Bronze_medal.jpeg"; 
            default:
                return null; 
        }
    });

    self.Text = ko.computed(function () {
        let txt =
            "Desporto: " + self.Sport() + "<hr/>" +
            "Nome do Vencedor: " + self.WinnerName() + "<hr/>" +
            "Sex: " + self.Sex() + "<hr/>" +
            "Competição: " + self.Competition() + "<hr/>" +
            "Pais: " + self.CountryName() + "<hr/>" +
            "Modalidade: " + self.Sport() + "<hr/>";

        return txt;
    });

    self.active = function (id) {
        let composedUri = self.baseUri() + id;
        console.log("Accessing: " + composedUri);
        self.Id(id);


        $.ajax({
            type: "GET",
            url: composedUri,
            dataType: "json",
            success: function (data) {
                self.Id(data.Id)
                self.WinnerName(data.WinnerName);
                self.Sex(data.Sex);
                self.SportId(data.SportId);
                self.MedalName(data.MedalName);
                self.Sport(data.Sport);
                self.Competition(data.Competition);
                self.CountryName(data.CountryName);
                console.log(data);
            },
            error: function () {
                console.error("Data not found!");
            },
        });
    };


    function getPage() {
        var currentUrl = String(window.location.search);
        let parameters = currentUrl.split("?")[1]?.split("&");
        if (parameters && parameters[0]) {
            let id = parameters[0].split("=")[1];
            console.log("ID extracted from URL: " + id);
            self.active(id);
        } else {
            console.error("No ID found in the URL.");
        }
    }


    getPage();
};
$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

