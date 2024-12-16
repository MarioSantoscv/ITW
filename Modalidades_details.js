var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;

    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/Sports/');
    self.Id = ko.observable("Unavailable");
    self.Name = ko.observable("Unavailable");
    self.Sport_url = ko.observable("Unavailable");
    self.Pictogram = ko.observable("Unavailable");
    self.Athletes = ko.observable([]); // Should hold full objects
    self.Coaches = ko.observable([]);
    self.Teams = ko.observable([]);
    self.Venues = ko.observable([]);
    self.Competitions = ko.observable([]);

    self.Text = ko.computed(function () {
        let txt =
            "Id: " + self.Id() + "<hr/>" +
            "Name: " + self.Name() + "<hr/>" +
            "URL: " + self.Sport_url() + "<hr/>";

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
                self.Id(data.Id);
                self.Name(data.Name);
                self.Sport_url(data.Sport_url);
                self.Pictogram(data.Pictogram);

               

                // Populate Athletes with full objects (Name and Id)
                self.Athletes(data.Athletes);

                // Populate Coaches with only the names
                self.Coaches(data.Coaches);



                // Populate Medals with only the types or names (adjust based on your data structure)
                self.Competitions(data.Competitions);

                // Populate Teams with only the names
                self.Teams(data.Teams);
                self.Venues(data.Venues);

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

