(function() {
  var Verb;
  var __bind = function(func, context) {
    return function() { return func.apply(context, arguments); };
  };
  Verb = (function() {
    function Verb(name, description, requirements, test) {
      this.name = name;
      this.description = description;
      this.requirements = requirements;
      this.test = test;
      return this;
    }
    return Verb;
  })();
  Verb.prototype.getName = function() {
    return this.name;
  };
  Verb.prototype.getDescription = function() {
    return this.description;
  };
  Verb.prototype.getRequirements = function() {
    return this.requirements;
  };
  Verb.prototype.canBePerformedBy = function(player) {
    return this.test ? this.test(player) : true;
  };
  Verb.prototype.getCapitalizeName = function() {
    return this.getName().capitalize();
  };
  Verb.prototype.getCallbackName = function() {
    return "onVerb" + (this.getCapitalizeName());
  };
  Verb.mow = new Verb("Mow", "Gathers compost", "Requires clippers", __bind(function(player) {
    return player.inventory.findByName("clippers");
  }, this));
  Verb.dig = new Verb("Dig", "Gathers dirt");
  Verb.bash = new Verb("Bash", "Bashes with your fists");
  this.Verb = Verb;
}).call(this);
