describe('errors', function(){
	it('should contain range error', function(){
		expect(Validator.errors.range).toBeDefined();
	});
	it('should contain url error', function(){
		expect(Validator.errors.url).toBeDefined();
	});
});
describe('inNumberRange', function(){
	it('should return false for 2 to be in range 3-4', function(){
		expect(Validator.inNumberRange(2,3,4)).toBe(false);
	});
	it('should return true for 3 to be in range 3-4', function(){
		expect(Validator.inNumberRange(3,3,4)).toBe(true);
	});
	it('should return true for 4 to be in range 3-4', function(){
		expect(Validator.inNumberRange(4,3,4)).toBe(true);
	});
	it('should return true for 4 to be in range 3-5', function(){
		expect(Validator.inNumberRange(4,3,5)).toBe(true);
	});
	it('should return true for 3.5 to be in range 3-4', function(){
		expect(Validator.inNumberRange(3.5,3,4)).toBe(true);
	});
});

describe('isDomain', function(){
	it('should return false for not proper domain', function(){
		expect(Validator.isDomain('itsnotdomain')).toBe(false);
	});
	it('should return true for proper domain', function(){
		expect(Validator.isDomain('domain.co')).toBe(true);
	});
	it('should return false for domain with special characters', function(){
		expect(Validator.isDomain('domain!#_!@$#+@%@#.co')).toBe(false);
	});
});

describe('createErrorElement', function(){
	it('should return object', function(){
		expect(typeof Validator.createErrorElement()).toEqual('object');
	});
	it('should have error class', function() {
		expect(Object.values(Validator.createErrorElement().classList).indexOf('form__error')).not.toEqual(-1);
	});
	it('should contain span', function(){
		expect(Validator.createErrorElement().outerHTML).toEqual('<span class="form__error"></span>');
	});
});

describe('invalidField', function(){
	it('should invalidate input', function(){
		var test = document.createElement('div');
		var input = document.createElement('input');
		input.dataset.validation = 'range';
		test.appendChild(input);
		expect(Object.values(input.classList).indexOf('form__input--invalid')).toEqual(-1);
		Validator.invalidField(input);
		expect(Object.values(input.classList).indexOf('form__input--invalid')).not.toEqual(-1);
		expect(input.nextElementSibling.classList[0]).toEqual('form__error');
		expect(test.innerHTML).toMatch(Validator.errors.range);
	});
	it('should invalidate previously invalid input', function(){
		var test = document.createElement('div');
		var input = document.createElement('input');
		input.dataset.validation = 'url';
		test.appendChild(input);
		Validator.invalidField(input);
        input.nextElementSibling.classList.add('hidden');
		Validator.invalidField(input);
		expect(Object.values(input.nextElementSibling.classList).indexOf('hidden')).toEqual(-1);
		expect(Object.values(input.nextElementSibling.classList).indexOf('form__error')).not.toEqual(-1);
		expect(test.innerHTML).toMatch(Validator.errors.url);
	});
});
describe('validField', function(){
	it('should validate input', function(){
		var test = document.createElement('div');
		var input = document.createElement('input');
		test.appendChild(input);
		input.classList.add('form__input--invalid');
		Validator.validField(input);
		expect(Object.values(input.classList).indexOf('form__input--invalid')).toEqual(-1);
	});
	it('should validate input and hide error', function(){
		var test = document.createElement('div');
		var input = document.createElement('input');
		test.appendChild(input);
		Validator.invalidField(input);
		Validator.validField(input);
		expect(Object.values(input.classList).indexOf('form__input--invalid')).toEqual(-1);
		expect(Object.values(input.nextElementSibling.classList).indexOf('hidden')).not.toEqual(-1);
	});
});
describe('validate', function(){
	it('range validation - valid', function(){
		spyOn(Validator, 'validField');
		var test = document.createElement('div');
		var input = document.createElement('input');
		input.dataset.validation = 'range';
		input.dataset.min = 0;
		input.dataset.max = 10;
		input.value = 5;
		test.appendChild(input);
		Validator.validate(input);
		expect(Validator.validField).toHaveBeenCalled();
	});
	it('range validation - valid - default values', function(){
		spyOn(Validator, 'validField');
		var test = document.createElement('div');
		var input = document.createElement('input');
		input.dataset.validation = 'range';
		input.value = 5;
		test.appendChild(input);
		Validator.validate(input);
		expect(Validator.validField).toHaveBeenCalled();
	});
	it('range validation - invalid', function(){
		spyOn(Validator, 'invalidField');
		var test = document.createElement('div');
		var input = document.createElement('input');
		input.dataset.validation = 'range';
		input.dataset.min = 0;
		input.dataset.max = 10;
		input.value = 15;
		test.appendChild(input);
		Validator.validate(input);
		expect(Validator.invalidField).toHaveBeenCalled();
	});
	it('range validation - invalid  default values max', function(){
		spyOn(Validator, 'invalidField');
		var test = document.createElement('div');
		var input = document.createElement('input');
		input.dataset.validation = 'range';
		input.value = 15;
		test.appendChild(input);
		Validator.validate(input);
		expect(Validator.invalidField).toHaveBeenCalled();
	});
	it('range validation - invalid  default values min', function(){
		spyOn(Validator, 'invalidField');
		var test = document.createElement('div');
		var input = document.createElement('input');
		input.dataset.validation = 'range';
		input.value = 2;
		test.appendChild(input);
		Validator.validate(input);
		expect(Validator.invalidField).toHaveBeenCalled();
	});
	it('url validation - valid', function(){
		spyOn(Validator, 'validField');
		var test = document.createElement('div');
		var input = document.createElement('input');
		input.dataset.validation = 'url';
		input.value = 'domain.com';
		test.appendChild(input);
		Validator.validate(input);
		expect(Validator.validField).toHaveBeenCalled();
	});
	it('url validation -invalid', function(){
		spyOn(Validator, 'invalidField');
		var test = document.createElement('div');
		var input = document.createElement('input');
		input.dataset.validation = 'url';
		input.value = 'domain';
		test.appendChild(input);
		Validator.validate(input);
		expect(Validator.invalidField).toHaveBeenCalled();
	});
	it('no type validation', function(){
		spyOn(Validator, 'validField');
		spyOn(Validator, 'invalidField');
		var test = document.createElement('div');
		var input = document.createElement('input');
		test.appendChild(input);
		Validator.validate(input);
		expect(Validator.validField).not.toHaveBeenCalled();
		expect(Validator.invalidField).not.toHaveBeenCalled();
	});
});