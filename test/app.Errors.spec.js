describe('errors', function(){
	it('should contain range error', function(){
		expect(Errors.noResults).toBeDefined();
	});
	it('should contain url error', function(){
		expect(Errors.noAccess).toBeDefined();
	});
});