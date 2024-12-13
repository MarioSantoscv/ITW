
var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;


    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/Api/Athletes/');
    self.Id = ko.observable("Unavailable");
    self.Name = ko.observable("Unavailable");
    self.Photo = ko.observable("Unavailable");
    self.Height = ko.observable("Unavailable");
    self.Weight = ko.observable("Unavailable");
    self.Function = ko.observable("Unavailable");
    self.Reason = ko.observable("Unavailable");
    self.Ritual = ko.observable("Unavailable");
    self.Country = ko.observable("Unavailable");
    self.Medals = ko.observable([]);
    self.Sports = ko.observable([]);
    self.Competitions = ko.observable([]);

    self.Text = ko.computed(function () {
        let txt =
            "Id: " + self.Id() + "<hr/>" +
            "Name: " + self.Name() + "<hr/>" +
            "Country: "+self.Country()+"<hr/>"+
            "Height: " + self.Height() + "<hr/>" +
            "Weight: " + self.Weight() + "<hr/>" +
            "Function: " + self.Function() + "<hr/>" +
            "Reason: " + self.Reason() + "<hr/>" +
            "Ritual: " + self.Ritual() + "<hr/>";
            
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
                self.Name(data.Name);
                self.Photo(data.Photo);
                self.Height(data.Height);
                self.Weight(data.Weight);
                self.Function(data.Function);
                self.Reason(data.Reason);
                self.Ritual(data.Ritual);
                self.Country(data.Country);

                // Map Medal_Type to its respective name
                const medals = data.Medals.map(medal => ({
                    Medal_Type:
                        medal.Medal_Type === 1
                            ? "Ouro"
                            : medal.Medal_Type === 2
                                ? "Prata"
                                : medal.Medal_Type === 3
                                    ? "Bronze"
                                    : "Desconhecido",
                    Sport_name: medal.Sport_name
                }));
                self.Medals(medals);

                // Populate Sports with only the names
                const sports = data.Sports.map(sport => sport.Name);
                self.Sports(sports);

                // Populate Competitions with only the names
                const competitions = data.Competitions.map(comp => comp.Name);
                self.Competitions(competitions);

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
