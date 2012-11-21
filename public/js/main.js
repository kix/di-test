ko.bindingHandlers.documentId = {
    init: function(element, valueAccessor) {
        $(element).attr('data-document-id', valueAccessor());
    },
    update: function(element, valueAccessor) {
        $(element).attr('data-document-id', valueAccessor());
    }
};

var showErrors = function(errors) {
	
}

var Item = function(name, price, quantity, id) {
	var self = this;

	self._id = ko.observable(id);
	self.name = ko.observable(name);
	self.price = ko.observable(price);
	self.quantity = ko.observable(quantity);

	self.sum = ko.computed(function(){
		return '$' + self.price() * self.quantity();
	})
}

var ViewModel = function(items) {
	
	var self = this;
	
	self.items = ko.observableArray([]);

	self.totalItems = ko.computed(function(){
		result = 0;
		self.items().map(function(item){
			result += parseInt(item.quantity());
		})
		return result;
	});

	self.findItemById = function(id) {
		var result;
		/** TODO: should use for-loop */
		self.items().map(function(item) {
			if (item._id() == id) {
				result = item;
			}
		});
		return result;
	};

	self.totalSum = ko.computed(function(){
		result = 0;
		self.items().map(function(item){
			result += parseInt(item.quantity()) * parseInt(item.price());
		})
		return result;
	});
	
	self.formItem = ko.observable(new Item());
	
	self.removeDocument = function(document) {
		console.log(document);
		$.ajax({
			url: '/documents/'+document._id(),
			type: 'DELETE',
			success: function(data) {
				self.items.destroy(document);
			},
			error: function(data) {
				alert('Could not delete document '+document._id());
				console.log(data);
			}
		})
	}.bind(this);

	self.editDocument = function(document) {
		console.log(document.name());

		/** TODO: this is a hack */
		$('.b-form_id__hidden').val(document._id());
		$('.b-form_name__input').val(document.name());
		$('.b-form_price__input').val(document.price());
		$('.b-form_quantity__input').val(document.quantity());

		$('#editForm').modal('show');
		console.log('edit');
	}

	self.updateDocument = function(viewModel) {
		var isUpdate = $('.b-form_id__hidden').val();

		$.ajax({
			data: $('.b-form').serialize(),
			dataType: 'json',
			type: (isUpdate) ? "PUT" : "POST",
			url: (isUpdate) ? '/documents/' + $('.b-form_id__hidden').val() : '/documents/',
			success: function(item) {
				var newItem = new Item(item.name, item.price, item.quantity, item._id);
				if (isUpdate) {
					/** TODO: this is bad code, can be done better */
					var item = self.findItemById(isUpdate);
					item.name(newItem.name());
					item.price(newItem.price());
					item.quantity(newItem.quantity());
					// item = newItem;
				} else {
					self.items.push(newItem);
				}
				self.formItem(new Item());

				/** TODO: this is a hack */
				$('.b-form_id__hidden')		.val('');
				$('.b-form_name__input')	.val('');
				$('.b-form_price__input')	.val('');
				$('.b-form_quantity__input').val('');

				$('#editForm').modal('hide');
			},
			error: function(jqXHR) {
				var errors = JSON.parse(jqXHR.responseText).errors;

				$('.error').removeClass('error');
				$('.modal-body .help-inline').hide();

				for (k in errors) {
					$('.b-form_group__'+errors[k]).addClass('error');
					$('.b-form_group__'+errors[k] + ' .help-inline').show();
				}
			}
		});
	}.bind(this);

	$.getJSON('/documents', function(data) {
		console.log(data);
		var mappedItems = $.map(data, function(item) {
                return new Item(item.name, item.price, item.quantity, item._id);
            });

		console.log(mappedItems);
		self.items(mappedItems);
	});
}

var vm;

$(function(){
	// $('.modal-body .help-inline').hide();

	vm = new ViewModel();
	ko.applyBindings(vm);

	vm.formItem.subscribe(function(newVal){
		console.log(newVal);
	})

	$('.b-add-item__button').click(function(){
		/** TODO: this is a hack */
		$('.b-form_id__hidden')		.val('');
		$('.b-form_name__input')	.val('');
		$('.b-form_price__input')	.val('');
		$('.b-form_quantity__input').val('');
	});

	$('.b-form__close').click(function(){
		$('#editForm').modal('hide');
	})


	$('.b-form__submit').click(function(e){
		e.preventDefault();
	})
});