Object.values = function(obj){
	var keys = Object.keys(obj);
	var values = [];
	for (var i = 0; i < keys.length; i++) {
		values.push(obj[i]);
	}
	return values;
}

describe('loader', function(){
	beforeAll(function(){
		App.loader.classList.add('hidden');
	});
	it('should show loader', function(){
		App.showLoader();
		expect(App.loader.classList[1]).not.toEqual('hidden');
	});
	it('should hide loader', function(){
		App.hideLoader();
		expect(App.loader.classList[1]).toEqual('hidden');
	});
});

describe('loader', function(){
	beforeAll(function(){
		App.resultsContainer.classList.add('hidden');
	});
	it('should show results', function(){
		App.showResults();
		expect(Object.values(App.resultsContainer.classList).indexOf('hidden')).toEqual(-1);
	});
	it('should hide results', function(){
		App.hideResults();
		expect(Object.values(App.resultsContainer.classList).indexOf('hidden')).not.toEqual(-1);
	});
});

describe('submit button', function(){
	beforeAll(function(){
		App.submitBtn.disabled = false;
	});
	it('should disable button', function(){
		App.disableForm();
		expect(App.submitBtn.disabled).toBe(true);
	});
	it('should enable button', function(){
		App.enableForm();
		expect(App.submitBtn.disabled).toBe(false);
	});
});

describe('messageElement', function(){
	it('should return message', function(){
		var message = App.messageElement('testmessage', 'messageclass');
		expect(Object.values(message.classList).indexOf('messageclass')).not.toBe(-1);
		expect(message.innerHTML).toMatch('testmessage');
	});
});

describe('getJSON', function(){
	beforeEach(function() {
		jasmine.Ajax.uninstall();
		jasmine.Ajax.install();
	 });
	it('success', function(){
		jasmine.Ajax.stubRequest('https://public-api.wordpress.com/rest/v1.1/sites/developer.wordpress.com/posts/?number=5&order_by=date&order=ASC&search=').andReturn({
			"responseText": '{"test": "test json"}',
			"contentType": 'application/json',
			"status": 200
		});
		spyOn(App, 'successHandler');
		spyOn(App, 'errorHandler');
		App.getJSON('https://public-api.wordpress.com/rest/v1.1/sites/developer.wordpress.com/posts/?number=5&order_by=date&order=ASC&search=');
		request = jasmine.Ajax.requests.mostRecent();
		expect(App.successHandler).toHaveBeenCalled();
		expect(App.errorHandler).not.toHaveBeenCalled();
	});
	it('failure', function(){
		jasmine.Ajax.stubRequest('https://public-api.wordpress.com/rest/v1.1/sites/developer.wordpress.com/posts/?number=5&order_by=date&order=ASC&search=').andReturn({
			"responseText": '{"test": "test json"}',
			"contentType": 'application/json',
			"status": 404
		});
		spyOn(App, 'successHandler');
		spyOn(App, 'errorHandler');
		App.getJSON('https://public-api.wordpress.com/rest/v1.1/sites/developer.wordpress.com/posts/?number=5&order_by=date&order=ASC&search=');
		request = jasmine.Ajax.requests.mostRecent();
		expect(App.successHandler).not.toHaveBeenCalled();
		expect(App.errorHandler).toHaveBeenCalled();
	});
});
describe('submitHandler', function(){
	it('no errors', function(){
		var event = {preventDefault: jasmine.createSpy()};

        spyOn(App, 'disableForm');
        spyOn(App, 'showLoader');
        spyOn(App, 'hideResults');
        spyOn(App, 'getJSON');

		App.submitHandler(event);
		expect(event.preventDefault).toHaveBeenCalled();
		expect(App.disableForm).toHaveBeenCalled();
		expect(App.showLoader).toHaveBeenCalled();
		expect(App.hideResults).toHaveBeenCalled();
		expect(App.getJSON).toHaveBeenCalled();
		expect(App.getJSON.calls.mostRecent().args[0]).toEqual('https://public-api.wordpress.com/rest/v1.1/sites/developer.wordpress.com/posts/?number=5&order_by=date&order=ASC&search=');
	});	
	it('no errors with non default values', function(){
		document.getElementById('url-value').value = 'test.com';
		document.getElementById('order-value').value = 'title';
		document.getElementById('search-value').value = 'searchquery';
		document.getElementById('number-value').value = 7;
		var event = {preventDefault: jasmine.createSpy()};

        spyOn(App, 'disableForm');
        spyOn(App, 'showLoader');
        spyOn(App, 'hideResults');
        spyOn(App, 'getJSON');

		App.submitHandler(event);
		expect(event.preventDefault).toHaveBeenCalled();
		expect(App.disableForm).toHaveBeenCalled();
		expect(App.showLoader).toHaveBeenCalled();
		expect(App.hideResults).toHaveBeenCalled();
		expect(App.getJSON).toHaveBeenCalled();
		expect(App.getJSON.calls.mostRecent().args[0]).toEqual('https://public-api.wordpress.com/rest/v1.1/sites/test.com/posts/?number=7&order_by=title&order=ASC&search=searchquery');
	});
	it('has errors', function(){
		document.getElementById('url-value').value = 'notadomain';
		var event = {preventDefault: jasmine.createSpy()};

        spyOn(App, 'disableForm');
        spyOn(App, 'showLoader');
        spyOn(App, 'hideResults');
        spyOn(App, 'getJSON');

		App.submitHandler(event);
		expect(event.preventDefault).toHaveBeenCalled();
		expect(App.disableForm).not.toHaveBeenCalled();
		expect(App.showLoader).not.toHaveBeenCalled();
		expect(App.hideResults).not.toHaveBeenCalled();
		expect(App.getJSON).not.toHaveBeenCalled();
	});
});
describe('createRawElement', function(){
	it('should createElement', function(){
		expect(App.createRawElement({"URL": "http://test.com", "title": "title", "excerpt": "excerpt", "modified": "2016-07-07"}).outerHTML).toEqual('<div class="post__item"><h2><a target="_blank" href="http://test.com">title</a></h2><p>excerpt</p><div class="post__date">07.06.2016</div></div>');
	});
});
describe('formatDate', function(){
	it('should format date', function(){
		expect(App.formatDate('2016-07-07')).toEqual('07.06.2016');
	});
	it('should format date', function(){
		expect(App.formatDate('2016-07-17')).toEqual('17.06.2016');
	});
	it('should format date', function(){
		expect(App.formatDate('2016-11-17')).toEqual('17.10.2016');
	});
});
describe('clearResults', function(){
	it('should clear one result', function(){
		document.getElementById('results-container').appendChild(App.createRawElement({"URL": "http://test.com", "title": "title", "excerpt": "excerpt", "modified": "2016-07-07"}));
		App.clearResults();
		expect(document.getElementById('results-container').firstChild).toEqual(null);
	});
	it('should clear all results', function(){
		document.getElementById('results-container').appendChild(App.createRawElement({"URL": "http://test.com", "title": "title", "excerpt": "excerpt", "modified": "2016-07-07"}));
		document.getElementById('results-container').appendChild(App.createRawElement({"URL": "http://test.com", "title": "title", "excerpt": "excerpt", "modified": "2016-07-07"}));
		App.clearResults();
		expect(document.getElementById('results-container').firstChild).toEqual(null);
	});
});
describe('successHandler', function(){
	beforeEach(function(){
		App.clearResults();
	});
	it('should process no posts', function(){
		spyOn(App, 'clearResults');
        spyOn(App, 'hideLoader');
        spyOn(App, 'showResults');
        spyOn(App, 'enableForm');
        App.successHandler({
        	posts: []
        });
        expect(App.resultsContainer.innerHTML).toMatch(Errors.noResults);
        expect(App.clearResults).toHaveBeenCalled();
        expect(App.hideLoader).toHaveBeenCalled();
        expect(App.showResults).toHaveBeenCalled();
        expect(App.enableForm).toHaveBeenCalled();
	});
	it('should process one post', function(){
		spyOn(App, 'clearResults');
        spyOn(App, 'hideLoader');
        spyOn(App, 'showResults');
        spyOn(App, 'enableForm');
        App.successHandler({
        	posts: [{"URL": "http://test.com", "title": "title", "excerpt": "excerpt", "modified": "2016-07-07"}]
        });
        expect(App.resultsContainer.getElementsByClassName('post__item').length).toEqual(1);
        expect(App.clearResults).toHaveBeenCalled();
        expect(App.hideLoader).toHaveBeenCalled();
        expect(App.showResults).toHaveBeenCalled();
        expect(App.enableForm).toHaveBeenCalled();
	});
	it('should process few posts', function(){
		spyOn(App, 'clearResults');
        spyOn(App, 'hideLoader');
        spyOn(App, 'showResults');
        spyOn(App, 'enableForm');
        App.successHandler({
        	posts: [{"URL": "http://test.com", "title": "title", "excerpt": "excerpt", "modified": "2016-07-07"},
        	{"URL": "http://test.com", "title": "title", "excerpt": "excerpt", "modified": "2016-07-07"},
        	{"URL": "http://test.com", "title": "title", "excerpt": "excerpt", "modified": "2016-07-07"}]
        });
        expect(App.resultsContainer.getElementsByClassName('post__item').length).toEqual(3);
        expect(App.clearResults).toHaveBeenCalled();
        expect(App.hideLoader).toHaveBeenCalled();
        expect(App.showResults).toHaveBeenCalled();
        expect(App.enableForm).toHaveBeenCalled();
	});
});
describe('errorHandler', function(){
	it('should show error', function(){
		App.clearResults();
		spyOn(App, 'clearResults');
        spyOn(App, 'hideLoader');
        spyOn(App, 'showResults');
        spyOn(App, 'enableForm');
        App.errorHandler();
        expect(App.resultsContainer.innerHTML).toMatch(Errors.noAccess);
        expect(App.clearResults).toHaveBeenCalled();
        expect(App.hideLoader).toHaveBeenCalled();
        expect(App.showResults).toHaveBeenCalled();
        expect(App.enableForm).toHaveBeenCalled();
	});
});