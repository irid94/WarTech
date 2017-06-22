angular.
module('bloggerList', []).component('bloggerList', {
    templateUrl: 'blogger-list/blogger-list.template.html',
    controller: function bloggerListController($http, $scope) {
       
    var self = this;
        // This is for getting all the list of the bloggers in the database
      $http.get('wartech').then(function(response){
            self.bloggers= response.data;
            console.log(self.bloggers[0]);
            test= response.data;
            console.log(test);
            
        });
        
        
        
    }});