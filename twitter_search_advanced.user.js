// ==UserScript==
// @name         Twitter Advanced Search Button
// @name:zh-CN   Twitter高级搜索按钮
// @name:ja      Twitter高度な検索ボタン
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds an Advanced Search button next to Twitter's search box. Makes it easier to access Twitter's powerful advanced search features.
// @description:zh-CN  在Twitter搜索框旁边添加高级搜索按钮，方便快速访问Twitter强大的高级搜索功能。
// @description:ja     Twitterの検索ボックスの横に高度な検索ボタンを追加し、Twitterの強力な検索機能に素早くアクセスできます。
// @author       Your name
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Language settings
    const LANGUAGES = {
        'zh-CN': '高级搜索',
        'ja': '高度な検索',
        'en': 'Search Advanced'
    };

    // Get user's browser language
    function getUserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        const shortLang = lang.split('-')[0];
        
        // Check for exact match first
        if (LANGUAGES[lang]) {
            return LANGUAGES[lang];
        }
        // Then check for language without region
        if (LANGUAGES[shortLang]) {
            return LANGUAGES[shortLang];
        }
        // Default to English
        return LANGUAGES['en'];
    }

    // Function to add the advanced search button
    function addAdvancedSearchButton() {
        // Find the search box container
        const searchBox = document.querySelector("#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div > div > div.css-175oi2r.r-aqfbo4.r-gtdqiz.r-1gn8etr.r-1g40b8q > div.css-175oi2r.r-1e5uvyk.r-6026j > div.css-175oi2r.r-136ojw6 > div > div > div > div > div.css-175oi2r.r-1pz39u2.r-1777fci.r-15ysp7h.r-obd0qt.r-s8bhmr");
        
        if (searchBox && !document.getElementById('advanced-search-btn')) {
            // Create the button
            const button = document.createElement('button');
            button.id = 'advanced-search-btn';
            button.textContent = getUserLanguage();
            button.style.cssText = `
                margin-left: 12px;
                padding: 0 16px;
                height: 32px;
                min-height: 32px;
                border-radius: 16px;
                background-color: rgb(15, 20, 25);
                color: rgb(255, 255, 255);
                border: 1px solid rgb(15, 20, 25);
                font-weight: 700;
                cursor: pointer;
                font-size: 14px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                transition-property: background-color, box-shadow;
                transition-duration: 0.2s;
                line-height: 32px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                user-select: none;
                white-space: nowrap;
            `;

            // Add hover effect
            button.onmouseover = function() {
                this.style.backgroundColor = 'rgb(39, 44, 48)';
            };
            button.onmouseout = function() {
                this.style.backgroundColor = 'rgb(15, 20, 25)';
            };

            // Add click event
            button.addEventListener('click', function() {
                window.location.href = 'https://x.com/search-advanced';
            });

            // Insert the button after the search box
            searchBox.parentNode.insertBefore(button, searchBox.nextSibling);
            return true;
        }
        return false;
    }

    // Function to check if we should add the button
    function shouldAddButton() {
        const url = window.location.href;
        return url.includes('/explore') || url.includes('/search-advanced');
    }

    // Function to continuously check for the search box
    function startChecking() {
        if (shouldAddButton()) {
            // Initial check
            if (!addAdvancedSearchButton()) {
                // If not found, set up periodic checking
                const checkInterval = setInterval(() => {
                    if (addAdvancedSearchButton() || !shouldAddButton()) {
                        clearInterval(checkInterval);
                    }
                }, 1000);
            }
        }
    }

    // Start checking when script loads
    startChecking();

    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        if (shouldAddButton() && !document.getElementById('advanced-search-btn')) {
            startChecking();
        }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    // Also check when history events occur (back/forward navigation)
    window.addEventListener('popstate', function() {
        if (shouldAddButton()) {
            startChecking();
        }
    });

    // Check when the page visibility changes (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && shouldAddButton()) {
            startChecking();
        }
    });

    // Handle URL changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (shouldAddButton()) {
                startChecking();
            }
        }
    }).observe(document, {subtree: true, childList: true});
})();
