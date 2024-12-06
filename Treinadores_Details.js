

var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;


    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/Api/Coaches/');
    self.Id = ko.observable("Unavailable");
    self.Name = ko.observable("Unavailable");
    self.Photo = ko.observable("Unavailable");
    self.Sex = ko.observable("Unavailable");
    self.Function = ko.observable("Unavailable");
    self.Country_Code = ko.observable("Unavailable");
    self.Sports = ko.observable("Unavailable");
    self.BirthDate = ko.observable("Unavailable");
   


    self.Text = ko.computed(function () {
        let txt =
            "Id: " + self.Id() + "<hr/>" +
            "Name: " + self.Name() + "<hr/>" +
            "Sex: " + self.Sex() + "<hr/>" +
            "Function: " + self.Function() + "<hr/>" +
            "Country_Code: " + self.Country_Code() + "<hr/>" +
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
                if (data.Photo) {
                    self.Photo(data.Photo);
                } else {
                    self.Photo("C:\Users\santo\source\repos\Projeto final\wwwroot\imagens\Carousel4.png");  //ask teacher abt picture
                }
                
                self.Function(data.Function);
                self.Sports(data.Sport);
                self.Country_Code(data.Country_Code);
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
