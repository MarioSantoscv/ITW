
var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;


    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/Api/Athletes/');
    self.Id = ko.observable("Unavailable");
    self.Name = ko.observable("Unavailable");
    self.NameShort = ko.observable("Unavailable");
    self.Photo = ko.observable("Unavailable");
    self.Height = ko.observable("Unavailable");
    self.Weight = ko.observable("Unavailable");
    self.Function = ko.observable("Unavailable");
    self.Reason = ko.observable("Unavailable");
    self.Ritual = ko.observable("Unavailable");
    self.Medals = ko.observable([]);
    self.Sports= ko.observable([])

    self.Text = ko.computed(function () {
        let txt =
            "Id: " + self.Id() + "<hr/>" +
            "Name: " + self.Name() + "<hr/>" +
            "Name (Short): " + self.NameShort() + "<hr/>" +
            "Height: " + self.Height() + "<hr/>" +
            "Weight: " + self.Weight() + "<hr/>" +
            "Function: " + self.Function() + "<hr/>" +
            "Reason: " + self.Reason() + "<hr/>" +
            "Ritual: " + self.Ritual() + "<hr/>" +
            "Medals: " + self.Medals() + "<hr/>" +
            "Sports: " + self.Sports() + "<hr/>";
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
                self.NameShort(data.NameShort);
                self.Photo(data.Photo);
                self.Height(data.Height);
                self.Weight(data.Weight);
                self.Function(data.Function);
                self.Reason(data.Reason);
                self.Ritual(data.Ritual);
                self.Sports(data.Sports);
                self.Medals(data.Medals);
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
