var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;


    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/Api/Athletics/');
    self.Id = ko.observable("Unavailable");
    self.Name = ko.observable("Unavailable");
    self.Photo = ko.observable("Unavailable");
    self.Sex = ko.observable("Unavailable");
    self.Date = ko.observable("Unavailable");
    self.EventName = ko.observable("Unavailable");
    self.ParticipantName = ko.observableArray([]);
    self.CountryCode = ko.observable("Unavailable");
    self.Result = ko.observable("Unavailable");
    self.StageName = ko.observable("Unavailable");



    self.Text = ko.computed(function () {
        let txt =
            "Id: " + self.Id() + "<hr/>" +
            "Name: " + self.Name() + "<hr/>" +
            "Sex: " + self.Sex() + "<hr/>" +
            "Date: " + self.Date() + "<hr/>" +
            "EventName: " + self.EventName() + "<hr/>" +
            "CountryCode: " + self.CountryCode() + "<hr/>" +
            "Result: " + self.Result() + "<hr/>" +
            "StageName: " + self.StageName() + "<hr/>" +
            "ParticipantName " + self.ParticipantName() + "<hr/>";

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
                self.Date(data.Date);
                self.EventName(data.EventName);
                self.ParticipantName(data.ParticipantName);
                self.CountryCode(data.CountryCode);
                self.CountryCode(data.StageName);
                self.Result(data.Result);
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
