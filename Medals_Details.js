var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;

    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Medals/Competition');
    self.SportId = ko.observable("Unavailable");
    self.MedalName = ko.observable("Unavailable");
    self.WinnerName = ko.observable("Unavailable");
    self.Sex = ko.observable("Unavailable");
    self.CountryName = ko.observable("Unavailable");
    self.Competition = ko.observable("Unavailable");
    
    self.Text = ko.computed(function () {
        let txt =
            "SportId: " + self.SportId() + "<hr/>" +
            "Name: " + self.MedalName() + "<hr/>" +
            "Tag: " + self.WinnerName() + "<hr/>";
        return txt;
    });

    // Function to activate and fetch data
    self.active = function (id, name) {
        let composedUri = self.baseUri() + "?sportId=" + id + "&competiton=" + name;
        console.log("Accessing: " + composedUri);
        self.SportId(id);
        self.Competition(name);

        $.ajax({
            type: "GET",
            url: composedUri,
            dataType: "json",
            success: function (data) {
                console.log("API Response:", data);

                // Safely assign data to observables
                self.SportId(data.SportId || "Unavailable");
                self.MedalName(data.MedalName || "Unavailable");
                self.WinnerName(data.WinnerName || []);
                self.Sex(data.Sex || "Unavailable");
                self.CountryName(data.CountryName || "Unavailable");
                self.Competition(data.Competition || "Unavailable");
                
             

                
                
            },
            error: function () {
                console.error("Data not found!");
            },
        });
    };

    // Function to get URL parameters
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
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});
