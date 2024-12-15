var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;

    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Competitions');
    self.SportId = ko.observable("Unavailable");
    self.Name = ko.observable("Unavailable");
    self.Photo = ko.observable("Unavailable");
    self.SportInfo = ko.observableArray([]);
    self.Athletes = ko.observableArray([]);
    self.Tag = ko.observable("Unavailable");

    self.Text = ko.computed(function () {
        let txt =
            "SportId: " + self.SportId() + "<hr/>" +
            "Name: " + self.Name() + "<hr/>" +
            "Tag: " + self.Tag() + "<hr/>";
        return txt;
    });

    
    self.active = function (id, name) {
        let composedUri = self.baseUri() + "?EventId=" + id + "&StageId=" + name;
        console.log("Accessing: " + composedUri);
        self.SportId(id);
        self.Name(name);

        $.ajax({
            type: "GET",
            url: composedUri,
            dataType: "json",
            success: function (data) {
                console.log("API Response:", data);

                
                self.SportId(data.SportId || "Unavailable");
                self.Name(data.Name || "Unavailable");
                self.SportInfo(data.SportInfo || []);
                self.Photo(data.Photo || "Unavailable");
                self.Tag(data.Tag || "Unavailable");

                // Handle Athletes - ensure it's an array
                self.Athletes(data.Athletes || []);

                console.log("Athletes Data:", self.Athletes());
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
