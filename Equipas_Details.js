﻿var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;


    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/Api/Teams/');
    self.Id = ko.observable("Unavailable");
    self.Name = ko.observable("Unavailable");
    self.Sex = ko.observable("Unavailable");
    self.Num_athletes = ko.observable(0);
    self.Athletes = ko.observableArray([]);
    self.Num_coaches = ko.observable(0);
    self.NOC = ko.observable("Unavailable");
    self.Sport = ko.observable("Unavailable");
    self.Medals = ko.observableArray([]);
    self.Coaches = ko.observableArray([]);



    self.Text = ko.computed(function () {
        let txt =
            "Id: " + self.Id() + "<hr/>" +
            "Name: " + self.Name() + "<hr/>" +
            "Sex: " + self.Sex() + "<hr/>" +
            "Num_athletes: " + self.Num_athletes() + "<hr/>" +
            "Num_coaches: " + self.Num_coaches() + "<hr/>" +
            "Sport: " + self.Sport() + "<hr/>" +
            "NOC: " + self.NOC() + "<hr/>" +
            "Athletes: " + self.Athletes() + "<hr/>"+
            "Medals: " + self.Medals() + "<hr/>" +
            "Coaches: " + self.Coaches() + "<hr/>";        
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
                self.Num_athletes(data.Num_athletes);
                self.Num_coaches(data.Num_coaches);
                self.Athletes(data.Athletes);
                self.Coaches(data.Coaches);
                self.NOC(data.NOC);
                self.Sport(data.Sport);
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