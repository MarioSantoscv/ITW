var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;

    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Athletics/');
    self.ParticipantType = ko.observable("Unavailable");
    self.ParticipantCode = ko.observable("Unavailable");
    

   

    // Function to activate and fetch data
    self.active = function (id, name) {
        let composedUri = self.baseUri() + "?EventId=" + id + "&StageId=" + name;
        console.log("Accessing: " + composedUri);
        self.EventId(id);
        self.StageId(name);

        $.ajax({
            type: "GET",
            url: composedUri,
            dataType: "json",
            success: function (data) {
                console.log("API Response:", data);

                // Safely assign data to observables
                self.ParticipantType(data.ParticipantType || "Unavailable");
                self.ParticipantCode(data.ParticipantCode || "Unavailable");
                
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
