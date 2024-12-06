
//Controls the theme(made by teacher)
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




let SetHearths = function (list) {
    $("#place")
        .children()
        .each((index, element) => {
            let dataId = element.id;

            list.forEach((item) => {
                console.log(element)
                if (item.Id == dataId) {
                    let iElement = $(element).find(".cont .cont i");
                    iElement.removeClass("fa-heart-o");
                    iElement.addClass("fa-heart");
                    iElement.addClass("text-danger");
                }
            });
        });
};
//Remove a favorite from the list and update the viewmodel
let removeFav = function (data, $currentTarget) {
    $currentTarget.parent().remove();
    $("#place")
        .children()
        .each((index, element) => {
            console.log(data)
            if (element.id == data.Id) {
                let iElement = $(element).find(".bd .cont i");
                iElement.removeClass("fa-heart");
                iElement.removeClass("text-danger");
                iElement.addClass("fa-heart-o");
            }
        });
    manageFavs(data);
};

//Changes the heart icon and calls the manageFavs function
let swapFav = function (element, data2,) {
    if (localStorage.getItem(favType) != null) {
        fav = JSON.parse(localStorage.getItem(favType));
    }
    let heart = $(element).find("i");

    heart.toggleClass("text-danger");
    heart.toggleClass("fa-heart");
    heart.toggleClass("fa-heart-o");

    manageFavs(data2);
};

//Add or remove a favorite from the list and save it to local storage
let manageFavs = function (data2) {
    let dataId = data2.Id;
    if (fav.some((item) => item.Id === dataId)) {
        fav = fav.filter((item) => item.Id !== dataId);
    } else {
        fav.push(data2);
    }
    localStorage.setItem(favType, JSON.stringify(fav));

    // checks the correct context that can be either a page that shows the favorites or where u can only add it
    if (typeof VM.favList !== "undefined") {
        VM.favList(fav);
    }
};
