class Verb
  constructor: (name, description, requirements, test) ->
    @name = name
    @description = description
    @requirements = requirements
    @test = test

  getName: ->
    @name
    
  getDescription: ->
    @description
    
  getRequirements: ->
    @requirements
    
  canBePerformedBy: (player) ->
    if @test
      @test(player)
    else
      true
      
  getCapitalizeName: ->
    @getName().capitalize()
    
  getCallbackName: ->
    "onVerb#{@getCapitalizeName()}"
  
Verb.mow = new Verb "Mow", "Gathers compost", "Requires clippers", (player) =>
  player.inventory.findByName("clippers")

Verb.dig = new Verb "Dig", "Gathers dirt"

Verb.bash = new Verb "Bash", "Bashes with your fists"

this.Verb = Verb