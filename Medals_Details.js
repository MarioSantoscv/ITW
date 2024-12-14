var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;


    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/Api/Medals/');
    self.Id = ko.observable("Unavailable");
    self.MedalName = ko.observable("Unavailable");
    self.WinnerId = ko.observable("Unavailable");
    self.CountryName = ko.observable("Unavailable");
    self.WinnerName = ko.observable("Unavailable");
    self.Sport = ko.observable("Unavailable");
    self.Competition = ko.observable("Unavailable");
    self.Url_event = ko.observable("Unavailable");



    self.Text = ko.computed(function () {
        let txt =
            "CountryName: " + self.CountryName() + "<hr/>" +
            "MedalName: " + self.MedalName() + "<hr/>" +
            "WinnerName: " + self.WinnerName() + "<hr/>" +
            "Sport: " + self.Sport() + "<hr/>" +
            "Competition: " + self.Competition() + "<hr/>" +
            "Url_event: " + self.Url_event() + "<hr/>";

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
                self.MedalName(data.MedalName);
                self.WinnerId(data.WinnerId);
                self.Photo(data.Photo);
                self.CountryName(data.CountryName);
                self.WinnerName(data.WinnerName);
                self.Sport(data.Sport);
                self.Competition(data.Competition);
                self.Url_event(data.Url_event);
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


