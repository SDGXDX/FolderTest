// Normally I would split these up into controller & service directories, but this is a simple example.
// Brevity and all that good stuff.
(function iife() {


    /// jQuery event handling
/*
    var $folders = $('.folder');
    $folders.on('click' ,function() {
        var $sub = $(this).first();
        console.log($sub);
        if ($sub.hasClass('ng-hide')) { $sub.removeClass('ng-hide'); $sub.addClass('ng-show'); }
        else { $sub.removeClass('ng-show'); $sub.addClass('ng-show'); }

    });
*/




/// ANGULAR

var folderApp = angular.module('folderApp',[]);

// CONTROLLERS
folderApp.controller('folderController', ['$scope', 'folderService' , function folderController($scope, folderService) {
    console.log(folderService);
    $scope.folders = [];
    folderService.getJson().then(
        function(data) {
            $scope.folders = data.data;
        }
    );

    for(var i=0; i<$scope.folders.length; i++ ) {
        $scope.folders[i].showSubFolders = false;
    }

    $scope.toggleSubs = function(id) {
        id = id-1; // starting at 1....
        // again, nesting is an issue here - this only really works at the top level. Should be a way to do this better.
        $scope.folders[id].showSubFolders = $scope.folders[id].showSubFolders === false ? true : false;
    };

    console.log($scope.folders);

}]);

//SERVICES
folderApp.factory('folderService', ['$http',  function folderFactory($http) {

    return  {
        getJson: function() {
            return $http.get('http://agileproapi.azurewebsites.net/api/MyFolders')
                .success(function(json) { return json; })
                .error(function(err)  { return err; })
        }
    }


}]);

})();