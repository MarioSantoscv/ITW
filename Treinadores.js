var vm = function () {
    var self = this;
    console.log('ViewModel initiated...');
    self.favList = ko.observable(fav);
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Coaches');
    console.log('ViewModel initiated...');
    self.displayName = 'Paris2024 Coaches List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.Records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);

    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    });

    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    });

    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    });

    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    });

    self.totalPages = ko.observable(0);

    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step = size < 9 || self.currentPage() === 1 ? 0 :
            self.currentPage() >= self.totalPages() - 4 ? self.totalPages() - 9 :
                Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++) list.push(i + step);
        return list;
    };

    self.activate = function (id) {
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            hideLoading();
            self.coaches(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize);
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalCoaches);
            SetHearths(fav);
        });
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };


    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})