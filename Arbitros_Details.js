var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;


    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/Api/Technical_officials/');
    self.Id = ko.observable("Unavailable");
    self.Name = ko.observable("Unavailable");
    self.Photo = ko.observable("Unavailable");
    self.Sex = ko.observable("Unavailable");
    self.Function = ko.observable("Unavailable");
    self.Organisation = ko.observable("Unavailable");
    self.Sports = ko.observable("Unavailable");
    self.BirthDate = ko.observable("Unavailable");



    self.Text = ko.computed(function () {
        let txt =
            "Id: " + self.Id() + "<hr/>" +
            "Name: " + self.Name() + "<hr/>" +
            "Sex: " + self.Sex() + "<hr/>" +
            "Function: " + self.Function() + "<hr/>" +
            "Organisation: " + self.Organisation() + "<hr/>" +
            "Sports: " + self.Sports() + "<hr/>" +
            "BirthDate: " + self.BirthDate() + "<hr/>";

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
                self.Sex(data.Sex);
                self.Photo(data.Photo);
                self.Function(data.Function);
                self.Sports(data.Sport);
                self.Organisation(data.Organisation);
                self.BirthDate(data.BirthDate);
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
