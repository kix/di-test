var mongorito = require('mongorito');

var Document = (function(){
    
    function Document(){
      Document.__super__.constructor.apply(this, arguments);
    }

    Document.prototype.keys = ['name', 'quantity', 'price'];

    Document.prototype.validateName = function(callback) {
      return callback(
        typeof this.name === 'string'
            && this.name.length > 0
      );
    }

    Document.prototype.validateQuantity = function(callback) {
  		return callback(
  			typeof parseInt(this.quantity) === 'number' 
  	        && parseInt(this.quantity) % 1 == 0
            && this.quantity > 0
  		);
    };

    Document.prototype.validatePrice = function(callback) {
    	return callback(
        typeof parseFloat(this.price) === 'number'
        && parseFloat(this.price) > 0
        );
    }

    return Document;

})();

exports.Document = mongorito.bake(Document);