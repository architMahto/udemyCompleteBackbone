
// In the first few sections, we do all the coding here.
// Later, you'll see how to organize your code into separate
// files and modules.

// Vehicle model
var Vehicle = Backbone.Model.extend();

var Vehicles = Backbone.Collection.extend({
    model: Vehicle
});

var VehicleView = Backbone.View.extend({
    tagName: "li",

    className: "vehicle",

    initialize: function(options) {
        this.eventAggregator = options.eventAggregator;
        this.model.on("remove", this.onVehicleRemoved, this);
    },

    events: {
		"click .delete": "onVehicleRemoved"
    },

    onVehicleRemoved: function(vehicle) {
		this.remove();
    },
    
    render: function() {
		this.$el.html(this.model.get("registrationNumber") + 
                                     ' <button class="delete">Delete</button>');
			      					
		this.$el.attr("id", this.model.id);
		this.$el.attr("data-color", this.model.get("color"));
		return this;
    }
});

var NewVehicleView = Backbone.View.extend({

    initialize: function(options) {
        this.eventAggregator = options.eventAggregator;
    },

    events: {
        'click .addVehicle': 'onAddVehicle'
    },

    onAddVehicle: function() {
        var $input = this.$el.find('.entryVehicle');
        var newVehicle = $input.val();
        $input.val("");
        //this.eventAggregator.trigger("onAddVehicle", newVehicle);
        console.log("Vehicle " + newVehicle +" Entered!");
    },

    render: function() {
        this.$el.html('<input type="text" class="entryVehicle" placeholder="Registration Number"/>' +
                      ' <input type="submit" class="addVehicle" value="Add">');
        return this;
    }
});

var VehiclesView = Backbone.View.extend({
    tagName: "ul",

    initialize: function(options) {
        this.eventAggregator = options.eventAggregator;
        //this.eventAggregator.on("onAddVehicle", this.onVehicleAdded, this);
    },

    /*onVehicleAdded: function(vehicle) {
        concole.log("Vehicle entered!")
    },*/
    
    render: function() {
		var self = this;
		this.model.each(function(vehicle){
		    var vehicleView = new VehicleView({ model: vehicle });
		    self.$el.append(vehicleView.render().$el);
		});
    }
});

var eventAggregator = _.extend({}, Backbone.Events);

var vehicles = new Vehicles([
    new Vehicle({ id: 1, registrationNumber: "XLI887", color: "Blue" }),
    new Vehicle({ id: 2, registrationNumber: "ZNP123", color: "Blue" }),
    new Vehicle({ id: 3, registrationNumber: "XUV456", color: "Gray" })
]);

var newVehicleView = new NewVehicleView({ el: "#vehicleentry" });
newVehicleView.render();

var vehiclesView = new VehiclesView({ el: "#vehicles", model: vehicles });
vehiclesView.render();
