
// In the first few sections, we do all the coding here.
// Later, you'll see how to organize your code into separate
// files and modules.
var app = app || {};

// Vehicle Model
app.VehicleModel = Backbone.Model.extend();

// Vehicle Collection
app.VehicleCollection = Backbone.Collection.extend({
    model: app.VehicleModel
});

// Vehicle Event Aggregator
app.eventAggregator = _.extend({}, Backbone.Events);

// Vehicle Model View
app.VehicleModelView = Backbone.View.extend({
    tagName: "li",

    className: "vehicle",

    initialize: function(options) {
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

// New Vehicle Model View
app.NewVehicleModelView = Backbone.View.extend({

    /*initialize: function(options) {
        app.eventAggregator = options.eventAggregator;
    },*/

    events: {
        'click .addVehicle': 'onAddVehicle'
    },

    onAddVehicle: function() {
        var $input = this.$el.find('.entryVehicle');
        var newVehicle = $input.val();
        $input.val("");
        app.eventAggregator.trigger("onAddVehicle", newVehicle);    },

    render: function() {
        this.$el.html('<input type="text" class="entryVehicle" placeholder="Registration Number"/>' +
                      ' <input type="submit" class="addVehicle" value="Add">');
        return this;
    }
});

// Vehicle Collection View
app.VehicleCollectionView = Backbone.View.extend({
    tagName: "ul",

    initialize: function(options) {
        app.eventAggregator.on("onAddVehicle", this.onVehicleAdded, this);
        this.model.on("add", this.prependModel, this);
    },

    onVehicleAdded: function(vehicle) {
        app.newVehicle = new app.VehicleModel ({ registrationNumber: vehicle });
        this.model.add(app.newVehicle);
    },

    prependModel: function(vehicle) {
        app.newVehicleEntryView = new app.VehicleModelView({ model: vehicle });
        this.$el.prepend(app.newVehicleEntryView.render().$el);
    },
    
    render: function() {
        var self = this;
        this.model.each(function(vehicle){
            // rendering vehicle model
            app.vehicleView = new app.VehicleModelView({ model: vehicle });
            self.$el.append(app.vehicleView.render().$el);
        });
    }
});

// Collection of Vehicles
app.vehicles = new app.VehicleCollection([
    new app.VehicleModel({ id: 1, registrationNumber: "XLI887", color: "Blue" }),
    new app.VehicleModel({ id: 2, registrationNumber: "ZNP123", color: "Blue" }),
    new app.VehicleModel({ id: 3, registrationNumber: "XUV456", color: "Gray" })
]);

// Rendering New Vehicle View
app.newVehicleView = new app.NewVehicleModelView({ el: "#vehicleentry" });
app.newVehicleView.render();

// Rendering Vehicle Collection View
app.vehiclesView = new app.VehicleCollectionView({ el: "#vehicles", model: app.vehicles });
app.vehiclesView.render();
