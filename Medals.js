(() => {
    'use strict'

    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme()
        if (storedTheme) {
            return storedTheme
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const setTheme = theme => {
        if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-bs-theme', 'dark')
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme)
        }
    }

    setTheme(getPreferredTheme())

    const showActiveTheme = (theme, focus = false) => {
        const themeSwitcher = document.querySelector('#bd-theme')

        if (!themeSwitcher) {
            return
        }

        const themeSwitcherText = document.querySelector('#bd-theme-text')
        const activeThemeIcon = document.querySelector('.theme-icon-active')
        const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)

        document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
            element.classList.add('opacity-50');
            element.setAttribute('aria-pressed', 'false');
        })

        //btnToActive.classList.add('active');
        btnToActive.setAttribute('aria-pressed', 'true');
        btnToActive.classList.remove('opacity-50')

        if (focus) {
            themeSwitcher.focus()
        }
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedTheme = getStoredTheme()
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
            setTheme(getPreferredTheme())
        }
    })

    window.addEventListener('DOMContentLoaded', () => {
        showActiveTheme(getPreferredTheme())

        document.querySelectorAll('[data-bs-theme-value]')
            .forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const theme = toggle.getAttribute('data-bs-theme-value')
                    setStoredTheme(theme)
                    setTheme(theme)
                    showActiveTheme(theme, true)
                })
            })
    })
})()





let fav = [];
let VM;
let favType = "favMedalhas";

var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.favList = ko.observable(fav);
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Medals');
    self.displayName = 'Paris2024 Athletes List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.athletes = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.PlayersArray = ko.computed(function () {
        var playersArray = self.athletes();
        var length = playersArray.length;
        var list = [];
        for (var i = 0; i < length; i++) {
            list.push({
                id: playersArray[i].WinnerId,
                label: playersArray[i].WinnerName,
            });
        }
        return list;
    });
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };


    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getAthletes...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.athletes(data.Medals);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalMedals);
            SetHearths(fav);

            //self.SetFavourites();

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
    if (localStorage.getItem(favType) != null) {
        fav = JSON.parse(localStorage.getItem(favType));
        console.log(fav)
    }
    viewModel = new vm();
    ko.applyBindings(viewModel);
   
    AutocompleteLst(viewModel.PlayersArray, "#search", "2");
});

let SetHearths = function (list) {
    $("#place")
        .children()
        .each((index, element) => {
            let dataWinnerId = element.id; // changed 'dataId' to 'dataWinnerId'

            list.forEach((item) => {
                if (item.WinnerId == dataWinnerId) { // compare 'WinnerId' instead of 'Id'

                    let iElement = $(element).find(".bd .cont i.akd");
                    console.log(iElement)
                    iElement.removeClass("fa-heart-o");
                    iElement.addClass("fa-heart");
                    iElement.addClass("text-danger");
                }
            });
        });
};

// Remove a favorite from the list and update the viewmodel
let removeFav = function (data, $currentTarget) {
    $currentTarget.parent().remove();
    $("#place")
        .children()
        .each((index, element) => {
            console.log(data)
            if (element.id == data.WinnerId) { // compare 'WinnerId' instead of 'Id'
                let iElement = $(element).find(".bd .cont i.akd");
                iElement.removeClass("fa-heart");
                iElement.removeClass("text-danger");
                iElement.addClass("fa-heart-o");
            }
        });
    manageFavs(data);
};

// Changes the heart icon and calls the manageFavs function
let swapFav = function (element, data2) {
    if (localStorage.getItem(favType) != null) {
        fav = JSON.parse(localStorage.getItem(favType));
    }
    let heart = $(element).find("i.akd");

    heart.toggleClass("text-danger");
    heart.toggleClass("fa-heart");
    heart.toggleClass("fa-heart-o");

    manageFavs(data2);
};

// Add or remove a favorite from the list and save it to local storage
let manageFavs = function (data2) {
    let dataWinnerId = data2.WinnerId; // changed 'dataId' to 'dataWinnerId'
    if (fav.some((item) => item.WinnerId === dataWinnerId)) { // check 'WinnerId' instead of 'Id'
        fav = fav.filter((item) => item.WinnerId !== dataWinnerId); // filter by 'WinnerId'
    } else {
        fav.push(data2);
    }
    localStorage.setItem(favType, JSON.stringify(fav));

    // checks the correct context that can be either a page that shows the favorites or where u can only add it
    if (typeof VM.favList !== "undefined") {
        VM.favList(fav);
    }
};

function ActiveAutocomplete(id, url, href, type, type2) {
    console.log("ActiveAutocomplete", url);

    let save = [];
    $(id).autocomplete({
        source: function (request, response) {
            if (request.term.length == 1 || save.length === 0) {
                save = [];
                SearcUri = url + request.term;
                console.log("accessing:" + SearcUri);
                $.ajax({
                    url: SearcUri,
                    method: "GET",
                    dataType: "json",
                    success: function (data) {
                        let result = [];

                        console.log("Using data: ", data.length, " items");

                        if (data.length) {
                            if (type == "id") {
                                data.forEach(function (item) {
                                    let obj = {
                                        label: item.Id,
                                        Id: item.Id,
                                        acronym: item.Acronym,
                                    };
                                    save.push(obj);
                                    if (result.length < 10) {
                                        result.push(obj);
                                    }
                                });
                            } else {
                                data.forEach(function (item) {
                                    let obj = {
                                        label: item.Name,
                                        Id: item.Id,
                                        acronym: item.Acronym,
                                    };
                                    save.push(obj);
                                    if (result.length < 10) {
                                        result.push(obj);
                                    }
                                });
                            }

                            console.log(result);
                        } else {
                            alert("No data found");
                            console.log("No data received.");
                        }
                        response(result);
                    },
                    error: function () {
                        console.log("Error ");
                    },
                });
            } else {
                console.log("using save: ", save.length, " items");
                let saveRes = $.ui.autocomplete.filter(save, request.term);
                response(saveRes.slice(0, 10));
            }
        },
        select: function (event, ui) {
            if (type2 == "id") {
                window.location.href = href + ui.item.Id;
            } else if (type2 == "name") {
                console.log(ui.item.name);
                window.location.href = href + ui.item.Name;
            } else {
                window.location.href =
                    href + ui.item.Id + "&acronym=" + ui.item.acronym;
            }
        },
    });
}
function ActiveAutocomplete(id, url, href, type, type2) {
    console.log("ActiveAutocomplete", url);

    let save = [];
    $(id).autocomplete({
        source: function (request, response) {
            if (request.term.length == 1 || save.length === 0) {
                save = [];
                SearcUri = url + request.term;
                console.log("accessing:" + SearcUri);
                $.ajax({
                    url: SearcUri,
                    method: "GET",
                    dataType: "json",
                    success: function (data) {
                        let result = [];

                        console.log("Using data: ", data.length, " items");

                        if (data.length) {
                            if (type == "id") {
                                data.forEach(function (item) {
                                    let obj = {
                                        label: item.Id,
                                        Id: item.Id,
                                        acronym: item.Acronym,
                                    };
                                    save.push(obj);
                                    if (result.length < 10) {
                                        result.push(obj);
                                    }
                                });
                            } else {
                                data.forEach(function (item) {
                                    let obj = {
                                        label: item.Name,
                                        Id: item.Id,
                                        acronym: item.Acronym,
                                    };
                                    save.push(obj);
                                    if (result.length < 10) {
                                        result.push(obj);
                                    }
                                });
                            }

                            console.log(result);
                        } else {
                            alert("No data found");
                            console.log("No data received.");
                        }
                        response(result);
                    },
                    error: function () {
                        console.log("Error ");
                    },
                });
            } else {
                console.log("using save: ", save.length, " items");
                let saveRes = $.ui.autocomplete.filter(save, request.term);
                response(saveRes.slice(0, 10));
            }
        },
        select: function (event, ui) {
            if (type2 == "id") {
                window.location.href = href + ui.item.Id;
            } else if (type2 == "name") {
                console.log(ui.item.name);
                window.location.href = href + ui.item.Name;
            } else {
                window.location.href =
                    href + ui.item.Id + "&acronym=" + ui.item.acronym;
            }
        },
    });
}
function AutocompleteLst(Array, id, mode) {
    $(id).autocomplete({
        source: function (request, response) {
            console.log(id, " is working");
            // Filter the PlayersArray based on the search term
            var results = Array().filter(function (item) {
                return item.label.toLowerCase().includes(request.term.toLowerCase());
            });
            response(results.slice(0, 10));
        },
        select: function (event, ui) {
            let url = ""
            switch (mode) {
                case "1":
                    url = "./teamDetails.html?" + ui.item.id
                    break;
                case "2":
                    url = "./Medals_Details.html?id=" + ui.item.id;
                    break;
                case "3":
                    url = "./Player_Profile.html?id=" + ui.item.id;
                    break;
                case "4":
                    url = "./Event_Schedule.html?event=" + ui.item.event;
                    break;
                case "5":
                    url = "./Game_Results.html?game=" + ui.item.gameId;
                    break;
                case "6":
                    url = "./Venue_Info.html?venue=" + ui.item.venueId;
                    break;
                case "7":
                    url = "./Official_List.html?official=" + ui.item.officialId;
                    break;
                case "8":
                    url = "./Broadcast_Schedule.html?channel=" + ui.item.channelId;
                    break;
            }
            window.location.href = url
        },
    });
}
$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})