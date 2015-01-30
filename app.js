// TODO: This is messy. Move to browserify/grunt workflow.

(function iife() {


/// ANGULAR
angular.module('Folder.Directives',[]);
var folderApp = angular.module('folderApp',['Folder.Directives']);

// CONTROLLERS
folderApp.controller('folderController', ['$scope', 'folderService' , function folderController($scope, folderService) {
    console.log(folderService);
    $scope.folders = [];
    folderService.getJson().then(
        function(data) {
            $scope.folders = data.data;
            console.log($scope.folders);
        }
    );

/* TODO: Refactor this to work with the directive
    for(var i=0; i<$scope.folders.length; i++ ) {
        $scope.folders[i].showSubFolders = false;
    }

    $scope.toggleSubs = function(id) {
        id = id-1; // starting at 1....
        // again, nesting is an issue here - this only really works at the top level. Should be a way to do this better.
        $scope.folders[id].showSubFolders = $scope.folders[id].showSubFolders === false ? true : false;
    };

    console.log($scope.folders);
    */

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

// folder-list is a top level piece that contains lists of folder-items
angular.module('Folder.Directives').directive('folderList', function () {
    return {
        restrict: "E",
        replace: true,
        // isolate scope for our current list of folders
        // changed to list because <folder-list folder-list=> seems a bit awkward.
        scope: {
            list: '=list'
        },
        // setup the actual repeating for all folders
        template: "<ul><folder ng-repeat='folder in list' folder='folder'></folder></ul>"
    }
});

angular.module('Folder.Directives').directive('folder', function ($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            folder: '='
        },
        template: "<li>{{folder.Name}}</li>",
        link: function (scope, element, attrs) {
            if (angular.isArray(scope.folder.Folders)) {
                // Magic! if the Folders array exists tack a new element onto it
                element.append("<folder-list list='folder.Folders'></folder-list>"); 
                // Compile the element against the scope and calls/renders the folderList directive, force refresh
                // TODO: I have concerns about performance here - perhaps transclusion would be better,
                // or maybe transclusion just calls $compile. Look into that. 
                // It is DOM manipulation, so link seems like the right place for now. 
                $compile(element.contents())(scope)

            }
        }
    }
});



})();