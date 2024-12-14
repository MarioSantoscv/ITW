let fav = [];
let VM;
let favType = "favCoaches"; // Updated for Coaches

var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;

    // Observable variables
    self.favList = ko.observable(fav);
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Coaches'); // API for Coaches
    self.displayName = 'Paris2024 Coaches List'; // Display name
    self.error = ko.observable('');
    self.Coaches = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);

    self.previousPage = ko.computed(() => self.currentPage() - 1);
    self.nextPage = ko.computed(() => self.currentPage() + 1);
    self.fromRecord = ko.computed(() => (self.previousPage() * self.pagesize()) + 1);
    self.toRecord = ko.computed(() => Math.min(self.currentPage() * self.pagesize(), self.totalRecords()));
    self.totalPages = ko.observable(0);

    // Pagination logic
    self.pageArray = function () {
        let list = [];
        let size = Math.min(self.totalPages(), 9);
        let step = (self.currentPage() >= 5 && self.currentPage() < self.totalPages() - 4) ? self.currentPage() - 4 : 0;

        for (let i = 1; i <= size; i++) {
            list.push(i + step);
        }
        return list;
    };

    // Fetch data from API
    self.activate = function (id) {
        console.log('CALL: getCoaches...');
        let composedUri = `${self.baseUri()}?page=${id}&pageSize=${self.pagesize()}`;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.Coaches(data.Coaches);
            self.currentPage(data.CurrentPage);
            self.pagesize(data.PageSize);
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalCoaches);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            SetHearths(fav);
        });
    };

    // AJAX Helper function
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear errors
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                self.error(errorThrown);
            }
        });
    }

    // Initialization
    let page = getUrlParameter('page') || 1;
    self.activate(page);
};

// Get URL parameters
function getUrlParameter(sParam) {
    let params = new URLSearchParams(window.location.search);
    return params.get(sParam);
}

// Apply Knockout bindings on page load
$(document).ready(function () {
    console.log("ready!");
    if (localStorage.getItem(favType) != null) {
        fav = JSON.parse(localStorage.getItem(favType));
        console.log(fav)
    }
    console.log("ready!");
    VM = new vm() 
    ko.applyBindings(VM);
    ActiveAutocomplete(
        "#search",
        "http://192.168.160.58/Paris2024/api/Coaches/Search?q=",
        "./Treinadores_Details.html?id=",
        "name",
        "id"
    );
});