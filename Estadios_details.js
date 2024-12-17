var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;


    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Venues/');
    self.Id = ko.observable("Unavailable");
    self.Name = ko.observable("Unavailable");
    self.DateStart = ko.observable("Unavailable");
    self.DateEnd = ko.observable("Unavailable");
    self.Tag = ko.observable("Unavailable");
    self.Url = ko.observable("Unavailable");
    self.Sports = ko.observable("Unavailable");
    self.Lat = ko.observable("Unavailable");
    self.Lon = ko.observable("Unavailable");
    



    self.Text = ko.computed(function () {
        let txt =
            "Id: " + self.Id() + "<hr/>" +
            "Name: " + self.Name() + "<hr/>" +
            "DateStart: " + self.DateStart() + "<hr/>" +
            "DateEnd: " + self.DateEnd() + "<hr/>" +
            "Tag: " + self.Tag() + "<hr/>" +
            "Url: " + self.Url() + "<hr/>" +
            "Lon: " + self.Lon() + "<hr/>" +
            "Lat: " + self.Lat() + "<hr/>";

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
                self.DateStart(data.DateStart);
                self.DateEnd(data.DateEnd);
                self.Tag(data.Tag);
                self.Url(data.Url);
                
                self.Lat(data.Lat);
                self.Lon(data.Lon);
                const sports = data.Sports.map(sport => sport.Name);
                self.Sports(sports);
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
