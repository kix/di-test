var showErrors = function(errors) {
	$('.error').removeClass('error');

	if (errors.indexOf('quantity') != -1) {
		$('.b-form_group__quantity').addClass('error')
	}
	if (errors.indexOf('price') != -1) {		
		$('.b-form_group__price').addClass('error')
	}
	if (errors.indexOf('name') != -1) {
		console.log('name err');
		$('.b-form_group__name').addClass('error')
	}
}

var Item = function(name, price, quantity) {
	this.name = ko.observable(name);
	this.price = ko.observable(price);
	this.quantity = ko.observable(quantity);
}

var ViewModel = function(items) {
	self = this;
	self.items = ko.observableArray(items);
	self.totalItems = ko.computed(function(){
		result = 0;
		for (item in items) {
			result += parseInt(items[item].quantity);
		}
		return result;
	});
	self.totalSum = ko.computed(function(){
		result = 0;
		for (item in items) {
			result += items[item].price * items[item].quantity;
		}
		return result;
	});
	self.formItem = ko.observable({
		id: '',
		name: 'Name',
		price: '',
		quantity: ''
	});
	self.removeDocument = function(document) {
		$.ajax({
			url: '/documents/'+document._id,
			type: 'DELETE',
			success: function(data) {
				console.log('deleted ' + document._id);
				self.items.remove(document);
				console.log(self.items());
				console.log(self.totalItems());
				ko.applyBindings(new ViewModel(docs));
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	self.editDocument = function(document) {
		console.log(self);
		self.formItem = document;
		$('#editForm').modal('show');
		console.log('edit');
	}
	self.updateDocument = function(document) {
		var isUpdate = $('.b-form_id__hidden').val();

		$.ajax({
			data: $('.b-form').serialize(),
			dataType: 'json',
			type: (isUpdate) ? "PUT" : "POST",
			url: (isUpdate) ? '/documents/' + $('.b-form_id__hidden').val() : '/documents/',
			success: function(data) {
				console.log('success', data);
				$('#editForm').modal('hide');
				self.items.push(data);
				ko.applyBindings(new ViewModel(docs));
			},
			error: function(jqXHR) {
				showErrors(JSON.parse(jqXHR.responseText).errors);
			}
		});
	}
}

var docs = [];

// ko.applyBindings(new ViewModel());

$(function(){

	$.getJSON('/documents', function(data) {
		var data;
		console.log(data);
		$(data).each(function(i){
			console.log(data[i]);
			docs.push(data[i]);
		})
		ko.applyBindings(new ViewModel(docs));
	});

	$('.b-items_item__actions a.edit').click(function(e) {
		e.preventDefault();
		var docId = $(this).parent().parent().attr('data-document-id');
		$('.modal-header > h3').html('Editing document');
		$.ajax({
			type: "GET",
			url: '/documents/'+docId,
			success: function(data) {
				console.log(data);
				$('.b-form_id__hidden').val(data._id);
				$('.b-form_name__input').val(data.name);
				$('.b-form_price__input').val(data.price);
				$('.b-form_quantity__input').val(data.quantity);
			}
		});
		$('#editForm').modal('show');
	})

	$('.b-form__close').click(function(){
		$('#editForm').modal('hide');
	})

	$('.b-items_item__actions a.delete').click(function(e){
		var docId = $(this).parent().parent().attr('data-document-id');
		console.log('delete')
		e.preventDefault();
		$.ajax({
			url: '/documents/'+docId,
			type: 'DELETE',
			success: function(data) {

			},
			error: function(data) {
				console.log(data);
			}
		})
	})


	$('.b-form__submit').click(function(e){
		e.preventDefault();

		
	})
});