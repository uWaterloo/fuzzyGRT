angular.module('PortalApp')

.controller('fuzzyGRTCtrl', ['$scope', '$http', '$q', 'fuzzyGRTFactory', function ($scope, $http, $q,
fuzzyGRTFactory) {

    // Widget Configuration
    $scope.portalHelpers.config = {
        // make 'widgetMenu.html' the template for the top right menu
        "widgetMenu": "widgetMenu.html"
    };

    // Import variables and functions from service
    $scope.insertValue = fuzzyGRTFactory.insertValue;
    $scope.loading = fuzzyGRTFactory.loading;
    $scope.links = fuzzyGRTFactory.links;
    $scope.openDataExampleData = fuzzyGRTFactory.openDataExampleData;
    $scope.dbData = fuzzyGRTFactory.dbData;
    $scope.item = fuzzyGRTFactory.item;

    // Model for the search and list example
    $scope.model = [{
        intersection: "Columbia / Beechlawn",
        bus_stop_data: "..."
    }, {
        intersection: "University / Seagram",
        bus_stop_data: "..."
    }, {
        intersection: "U.W. - Davis Centre",
        bus_stop_data: "..."
    }, {
        intersection: "University / King",
		bus_stop_data: "..."
    }, {
        intersection: "U.W. - South Campus Hall",
		bus_stop_data: "..."
    }, {
        intersection: "The Boardwalk Terminal",
		bus_stop_data: "..."
    }];

    // initialize the service
    fuzzyGRTFactory.init($scope);

    // watch for changes in the loading variable
    $scope.$watch('loading.value', function () {
        // if loading
        if ($scope.loading.value) {
            // show loading screen in the first column, and don't append it to browser history
            $scope.portalHelpers.showView('loading.html', 1, false);
            // show loading animation in place of menu button
            $scope.portalHelpers.toggleLoading(true);
        } else {
            $scope.portalHelpers.showView('main.html', 1);
            $scope.portalHelpers.toggleLoading(false);
        }
    });

    // Create table, invoked by a button press from database test example
    $scope.createTable = function () {
        $scope.portalHelpers.invokeServerFunction('createTable').then(function (
            result) {
            $scope.dbData.value = [];
        });
    }

    // Handle form submit in the database test example
    $scope.insertData = function () {
        if ($scope.insertValue.value.length > 50)
            alert('value should be less than 50 characters');
        else {
            $scope.portalHelpers.invokeServerFunction('insert', {
                value: $scope.insertValue.value
            }).then(function (result) {
                $scope.dbData.value = result;
            });
            $scope.insertValue.value = "";
        }
    };

    // Handle click on an item in the list and search example
    $scope.showDetails = function (item) {
        // Set which item to show in the details view
        $scope.item.value = item;
        // Show details view in the second column
        $scope.portalHelpers.showView('details.html', 2);
    };

    // Handle "previous item" click from the details page
    $scope.prevItem = function () {
        // get previous items in the list
        var prevItem = $scope.portalHelpers.getPrevListItem();
        // refresh details view with the new item
        $scope.showDetails(prevItem);
    }

    $scope.nextItem = function () {
        var nextItem = $scope.portalHelpers.getNextListItem();
        $scope.showDetails(nextItem);
    }

}])
    // Factory maintains the state of the widget
    .factory('fuzzyGRTFactory', ['$http', '$rootScope', '$filter', '$q', function ($http, $rootScope,
        $filter, $q) {
        var initialized = {
            value: false
        };

        // Your variable declarations
        var loading = {
            value: true
        };
        var insertValue = {
            value: null
        };
        var links = {
            value: null
        };
        var openDataExampleData = {
            value: null
        };
        var dbData = {
            value: null
        };
        var item = {
            value: null
        };
        var sourcesLoaded = 0;

        var init = function ($scope) {
            if (initialized.value)
                return;
            initialized.value = true;

            // Place your init code here:

            // Get data for the widget
            $http.get('/ImportantLinks/JSONSource').success(function (data) {
                links.value = data;
                sourceLoaded();
            });

            // OPEN DATA API EXAMPLE
            $scope.portalHelpers.invokeServerFunction('getOpenData').then(function (
                result) {
                console.log('getopendata data: ', result);
                openDataExampleData.value = result.data;
                sourceLoaded();
            });

            $scope.portalHelpers.invokeServerFunction('getData').then(function (result) {
                dbData.value = result;
                sourceLoaded();
            });
        }

        function sourceLoaded() {
            sourcesLoaded++;
            if (sourcesLoaded == 3)
                loading.value = false;
        }

        return {
            init: init,
            loading: loading,
            insertValue: insertValue,
            links: links,
            openDataExampleData: openDataExampleData,
            dbData: dbData,
            item: item
        };

    }])
    // Custom directive example
    .directive('fuzzyGRTDirectiveName', ['$http', function ($http) {
        return {
            link: function (scope, el, attrs) {

            }
        };
    }])
    // Custom filter example
    .filter('fuzzyGRTFilterName', function () {
        return function (input, arg1, arg2) {
            // Filter your output here by iterating over input elements
            var output = input;
            return output;
        }
    });