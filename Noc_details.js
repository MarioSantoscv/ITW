var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;


    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/Api/NOCs/');
    self.Id = ko.observable("Unavailable");
    self.Name = ko.observable("Unavailable");
    self.Photo = ko.observable("Unavailable");
    self.Url = ko.observable("Unavailable");
    self.Athletes = ko.observable([]);
    self.Coaches = ko.observable([]);
    self.Medals = ko.observable([]);
    self.Teams = ko.observable([]);



    self.Text = ko.computed(function () {
        let txt =
            "Id: " + self.Id() + "<hr/>" +
            "Name: " + self.Name() + "<hr/>" +
            "URL: " + self.Url() + "<hr/>";

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
                self.Name(data.Name);
                self.Url(data.Url);
                self.Photo(data.Photo);
                // Populate Athletes with only the names
                const athletes = data.Athletes.map(athlete => athlete.Name);
                self.Athletes(athletes);

                // Populate Coaches with only the names
                const coaches = data.Coaches.map(coach => coach.Name);
                self.Coaches(coaches);

                // Populate Medals with only the types or names (adjust based on your data structure)
                const medals = data.Medals.map(medal => medal.Name);
                self.Medals(medals);

                // Populate Teams with only the names
                const teams = data.Teams.map(team => team.Name);
                self.Teams(teams);
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
