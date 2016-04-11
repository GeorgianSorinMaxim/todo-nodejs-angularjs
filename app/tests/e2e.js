describe('Protractor and Selenium test', function() {

  browser.ignoreSynchronization = true;

  it('Opens the page', function() {
    browser.get('http://localhost:3000/');
    expect(browser.getTitle()).toEqual('ToDo App');  
  });

  it('Adds a new Todo', function() {
    $('.addtodo').sendKeys('e2e test');
    $('.btn').click();
	expect($('.addtodo').val=='');
  });

  it('Deletes a Todo', function() {
  	var nr = $('#len').val;
    $('.ion-close-round').click();
    var nrUpdate = $('#len').val;
	expect(nr != nrUpdate);
  });

});   