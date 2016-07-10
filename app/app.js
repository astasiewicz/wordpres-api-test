/* jshint browser: true */
'use strict';

/** @namespace */
var Validator = {
    errors: {
        url: 'Podany adres URL jest niepoprawny',
        range: 'Podana wartość jest niepoprawna'
    },
    /**
     * Check if number is in given range
     * @param {Number} number
     * @param {Number} min lower limit of the range
     * @param {Number} max upper limit of the range
     * @returns {Boolean}
     */
    inNumberRange: function(number, min, max) {
        return (number >= min && number <= max);
    },
    /**
     * Check if given string has domain-like pattern
     * @param {String} str given string to check
     * @returns {Boolean}
     */
    isDomain: function(str) {
        return (/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/).test(str);
    },
    /**
     * Create an element node for error message
     * @returns {HTMLElement}
     */
    createErrorElement: function() {
        var errorElement = document.createElement('span');
        errorElement.classList.add('form__error');
        return errorElement;
    },
    /**
     * @param {HTMLElement} el element to be marked as invalid
     * @returns {undefined}
     */
    invalidField: function(el) {
        var errorElement = null;
        el.classList.add('form__input--invalid');
        if (el.nextElementSibling && el.nextElementSibling.classList.contains('form__error')) {
            // errorElement exists
            errorElement = el.nextElementSibling;
            errorElement.classList.remove('hidden');
        } else {
            // create errorElement
            errorElement = this.createErrorElement();
            el.parentNode.insertBefore(errorElement, el.nextSibling);
        }
        // put message based on validation type
        errorElement.innerHTML = this.errors[el.dataset.validation];
    },
    /**
     * @param {HTMLElement} el element to be marked as valid
     * @returns {undefined}
     */
    validField: function(el) {
        el.classList.remove('form__input--invalid');
        if (el.nextElementSibling) {
            el.nextElementSibling.classList.add('hidden');
        }
    },
    /**
     * Handle validation based on validation type in dataset attribute
     * @param {HTMLElement} element to be validate
     * @returns {Boolean}
     */
    validate: function(el) {
        var validationType = el.dataset.validation;
        // range validation
        if (validationType === 'range') {
            var n = parseInt(el.value);
            var min = parseInt(el.dataset.min) || 3;
            var max = parseInt(el.dataset.max) || 14;
            if (this.inNumberRange(n, min, max)) {
                // valid
                this.validField(el);
                return true;
            } else {
                //invalid
                this.invalidField(el);
                return false;
            }
        }
        // URL validation
        if (validationType === 'url') {
            var url = el.value;
            if (this.isDomain(url)) {
                this.validField(el);
                return true;
            } else {
                this.invalidField(el);
                return false;
            }
        }

    }
};

/**
 *	Errors. Error and warning message
 * @namespace
 */
var Errors = {
    noResults: 'Brak wyników',
    noAccess: 'Strona o podanym adresie nie zezwala na dostęp lub nie jest oparta o Wordpress'
};

/**
 *	App. Application main methods
 * @namespace
 */
var App = {
    /**
     * show loader spinner by removing hidden class
     * @param {undefined}
     * @returns {undefined}
     */
    showLoader: function() {
        this.loader.classList.remove('hidden');
    },
    /**
     * hide loader spinner by adding hidden class
     * @param {undefined}
     * @returns {undefined}
     */
    hideLoader: function() {
        this.loader.classList.add('hidden');
    },
    /**
     * show results by removing hidden class
     * @param {undefined}
     * @returns {undefined}
     */
    showResults: function() {
        this.resultsContainer.classList.remove('hidden');
    },
    /**
     * hide results by adding hidden class
     * @param {undefined}
     * @returns {undefined}
     */
    hideResults: function() {
        this.resultsContainer.classList.add('hidden');
    },
    /**
     * disable submit button of main form
     * @param {undefined}
     * @returns {undefined}
     */
    disableForm: function() {
        this.submitBtn.disabled = true;
    },
    /**
     * enable submit button of main form
     * @param {undefined}
     * @returns {undefined}
     */
    enableForm: function() {
        this.submitBtn.disabled = false;
    },
    /**
     * create DOM element with given message and class attribute
     * @param {String} message
     * @param {String} elementClass
     * @returns {HTMLElement}
     */
    messageElement: function(message, elementClass) {
        var el = document.createElement('p');
        el.classList.add(elementClass);
        el.innerHTML = message;
        return el;
    },
    getJSON: function(url) {
        var successHandler = this.successHandler.bind(this);
        var errorHandler = this.errorHandler.bind(this);
        /* istanbul ignore next */
        var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('get', url, true);
        xhr.onreadystatechange = function() {
            var status = null;
            var data = null;
            // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
            if (xhr.readyState == 4) { // `DONE`
                status = xhr.status;
                if (status == 200) {
                    data = JSON.parse(xhr.responseText);
                    successHandler(data);
                } else {
                    errorHandler(status);
                }
            }
        };
        xhr.send();
    },
    /*
    submitHandler
    */
    submitHandler: function(evt) {

        evt.preventDefault();
        // get all fields to create query
        this.orderElem = document.getElementById('order-value');
        this.searchElem = document.getElementById('search-value');
        this.urlElem = document.getElementById('url-value');
        this.numberElem = document.getElementById('number-value');

        //validate
        this.hasErrors = false;

        //check all fields for validation attribute
        for (var i = 0, formElementsLength = this.mainForm.elements.length; i < formElementsLength; i++) {
            var field = this.mainForm.elements[i];
            var isValid = null;
            if (field.dataset.validation) {
                isValid = this.Validator.validate(field);
                if (!isValid) {
                    this.hasErrors = true;
                }
            }
        }

        if (this.hasErrors === false) {
            // get posts
            var queryURL = 'https://public-api.wordpress.com/rest/v1.1/sites/' + this.urlElem.value + '/posts/?' +
                'number=' + this.numberElem.value + '&' +
                'order_by=' + this.orderElem.value + '&' +
                'order=ASC&' +
                'search=' + this.searchElem.value;

            //console.log('form is valid, ' + queryURL);
            this.disableForm();
            this.showLoader();
            this.hideResults();
            this.getJSON(queryURL);
        } else {
            // form invalid
            // console.warn('Form is invalid');
        }
    },
    /*
    createRawElement
    */
    createRawElement: function(JSONitem) {
        var el = document.createElement('div');
        var singlePost = '<h2><a target="_blank" href="' + JSONitem.URL + '">' + JSONitem.title + '</a></h1><p>' + JSONitem.excerpt + '</p><div class="post__date">' + this.formatDate(JSONitem.modified) + '</div>';
        el.classList.add('post__item');
        el.innerHTML = singlePost;
        return el;
    },
    /**
     * format data basing on timestamp string
     * @param {String} message
     * @param {String} elementClass
     * @returns {HTMLElement}
     */
    formatDate: function(dateStr) {
        var dateObj = new Date(dateStr);
        var day = dateObj.getDate();
        var monthIndex = dateObj.getMonth();
        var year = dateObj.getFullYear();

        if (day < 10) {
            day = '0' + day;
        }
        if (monthIndex < 10) {
            monthIndex = '0' + monthIndex;
        }
        var dateFormatted = day + '.' + monthIndex + '.' + year;
        return dateFormatted;
    },
    /**
     * remove result items
     * @param {undefined}
     * @returns {undefined}
     */
    clearResults: function() {
        while (this.resultsContainer.firstChild) {
            this.resultsContainer.removeChild(this.resultsContainer.firstChild);
        }
    },
    /**
     * handle success callback after getting JSON by API
     * @param {Object} JSON object
     * @returns {undefined}
     */
    successHandler: function(JSON) {
        // clear current results
        this.clearResults();
        this.hideLoader();
        this.showResults();
        this.enableForm();

        // unauthorized, unknown_blog {error:}
        var posts = JSON.posts;
        var postsLength = posts.length;
        if (postsLength) {
            for (var i = 0; i < postsLength; i++) {
                var postItem = this.createRawElement(posts[i]);
                this.resultsContainer.appendChild(postItem);
            }
        } else {
            // no results
            var messageElement = this.messageElement(this.Errors.noResults, 'no-results');
            this.resultsContainer.appendChild(messageElement);
        }
    },
    /**
     * handle error callback after getting JSON by API
     * @param {Object} JSON object
     * @returns {undefined}
     */
    errorHandler: function(JSON) {
        this.clearResults();
        this.hideLoader();
        this.showResults();
        this.enableForm();

        var messageElement = this.messageElement(this.Errors.noAccess, 'no-results');
        this.resultsContainer.appendChild(messageElement);

    },
    /**
     * Initialize App
     * @param {Object} Validator
     * @param {Object} Errors
     * @returns {undefined}
     */
    init: function(Validator, Errors) {

        this.Validator = Validator;
        this.Errors = Errors;

        // DOM elements
        this.loader = document.getElementById('loader');
        this.resultsContainer = document.getElementById('results-container');
        this.mainForm = document.getElementById('main-form');
        this.submitBtn = document.getElementById('submit-button');

        // attach events
        this.submitHandler = this.submitHandler.bind(this);
        this.mainForm.addEventListener('submit', this.submitHandler, false);
    }
};

//window.onload = App.init();
window.addEventListener('DOMContentLoaded', App.init(Validator, Errors), false);
