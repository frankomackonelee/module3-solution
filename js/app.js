(function(){
  var thisApp = angular.module('NarrowItDownApp', []);
  thisApp.controller('narrowItDownController', NarrowItDownController);
  thisApp.service('menuSearchService', MenuSearchService)
  thisApp.directive('foundItems', FoundItems);

  //TODO: is MSS the function name or the name it is registered as?
  NarrowItDownController.$inject = ['menuSearchService']
  function NarrowItDownController(menuSearchService){
    var nidc = this;

    nidc.items = [];

    nidc.clickResponse = function(){
      nidc.items = [];
      if(nidc.input == undefined || nidc.input == ""){
        alert("You must type something in the box")
      }else{
        var promise = menuSearchService.getMatchedMenuItems(nidc.input);
        promise.then(function (response) {
          for(var i = 0; i<response.data.menu_items.length; i++){
            if(response.data.menu_items[i].description.toLowerCase().indexOf(nidc.input.toLowerCase())!=-1){
                nidc.items.push(response.data.menu_items[i]);
            }
          }
          if(nidc.items.length == 0){
            alert("Nothing found")
          }
        })
        .catch(function (error) {
          console.log(error);
        })
      }
    }

    nidc.removeItem = function(itemNumber){
      console.log(this);
      nidc.items.splice(itemNumber,1);
    }
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http){
    var service = this;

    service.getMatchedMenuItems = function(searchTerm){
      return $http({
        method: "GET",
        url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
      });
    }
  }

  //FoundItems.$inject = []
  function FoundItems(){
      var ddo = {
        templateUrl: './html/found-items.html',
        scope: {
          found: '<',
          onRemove: '&'
        },
        controller: FoundItemsDirectiveController,
        controllerAs: 'list',
        bindToController: true
      };

      return ddo;
  }

  function FoundItemsDirectiveController(){
    list = this;

    list.onRemove = function(number){
      alert("The number clicked is: " + number)
    }
  }

}())
