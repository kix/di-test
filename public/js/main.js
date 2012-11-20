
var ViewModel = function(items) {
	this.items = ko.observableArray(items);
}

$(function(){
	
	$.getJSON('/documents', function(data) {
		console.log(data);

		ko.applyBindings(new ViewModel(data));
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
		req = {
			data: $('.b-form').serialize(),
			success: function(data) {
				console.log(data);
				$('#editForm').modal('hide');
			},
			error: function(data) {
				console.log(data);
			}
		}

		$('.modal-header > h3').html('Add a document');

		if ($('.b-form_id__hidden').val()) {
			req.type = "PUT";
			req.url  = '/documents/' + $('.b-form_id__hidden').val();
		} else {
			req.type = "POST";
			req.url  = '/documents';
		}
		console.log(req)
		$.ajax(req);
	})
});