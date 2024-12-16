var vm = function () {
    console.log('ViewModel initiated...');

    var self = this;

    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/CountryMedals');
    self.athletes = ko.observableArray([]);
    self.currentOrder = ko.observable(1); // Default order set to 1

    // Function to fetch data based on the current Order
    self.active = function () {
        let composedUri = `${self.baseUri()}?Countries=92&Order=${self.currentOrder()}`;
        console.log("Accessing: " + composedUri);

        $.ajax({
            type: "GET",
            url: composedUri,
            dataType: "json",
            success: function (data) {
                console.log("API Response:", data);
                self.athletes(data); // Update the observable array
            },
            error: function () {
                console.error("Data not found!");
            },
        });
    };

    // Functions to set the Order to a specific number
    self.setOrder1 = function () {
        self.currentOrder(1);
        self.active();
    };

    self.setOrder2 = function () {
        self.currentOrder(2);
        self.active();
    };

    self.setOrder3 = function () {
        self.currentOrder(3);
        self.active();
    };

    self.setOrder4 = function () {
        self.currentOrder(4);
        self.active();
    };

    // Initialize with the default values
    self.active();
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});
