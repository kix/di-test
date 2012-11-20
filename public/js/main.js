var documents = [
	{
		name: 'Lalala',
		price: 3.23,
		quantity: 5
	},
	{
		name: 'Ololo',
		price: 5.3,
		quantity: 3
	}
];

var DocumentsModel = function(documents) {
	var self = this;
	self.items = ko.observableArray(documents);

	self.addItem = function(){
		self.items.push({
			name: "",
			price: 0,
			quantity: 0
		});
	}
}

ko.applyBindings(new DocumentsModel(documents));

$(function(){
	$.getJSON('/documents', function(data) {
		documents = data;
		console.log(data);
		for (i in data) {
			console.log(data[i]);
		}
	})
});