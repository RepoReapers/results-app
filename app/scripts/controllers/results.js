'use strict';

/**
 * @ngdoc function
 * @name reaperResultsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the reaperResultsApp
 */
angular.module('reaperResultsApp')
  .controller('ResultsCtrl', ['$scope', '$http', 'ENV',
    function ($scope, $http, ENV) {
    $scope.error = false;
    $scope.errorMessage = '';

    $scope.headings = [
      'Repository',
      'Language',
      'Score',
      'Architecture',
      'Continuous Integration',
      'Community',
      'Documentation',
      'History',
      'License',
      'State',
      'Processed'
    ];

    $scope.results = [];
    $scope.totalEspResults = 0;
    $scope.totalResults = 0;
    $scope.resultsPerPage = 200;

    $scope.pagination = {
      current: 1
    };

    $scope.$watch('pagination.current', function (value) {
      getResults(value);
    });

    function getResults(page) {
      $scope.fetchPromise = $http.get(
          ENV.endpoint + '/results?page=' + page,
          { cache: true }
        )
        .then(function (response) {
          $scope.error = false;
          $scope.errorMessage = '';

          if (response.data.results[0][0] > 1) {
            $scope.previous = 'previous';
          }

          const fields = response.data.headers.length;
          for (let i = 0; i < response.data.results.length; i++) {
            const rawDate = new Date(response.data.results[i][fields - 1]);
            const date = moment.tz(rawDate, 'America/New_York');
            response.data.results[i][fields - 1] = date.calendar();
          }

          $scope.totalEspResults = response.data.esp_count;
          $scope.totalResults = response.data.count;
          $scope.headings = response.data.headers;
          $scope.results = response.data.results;

          jQuery('#resultsTable').floatThead({scrollingTop: 50});
          jQuery('#resultsTable').floatThead('reflow');
        })
        .catch(function(error) {
          $scope.error = true;
          console.log(error);
          $scope.errorMessage = 'failed to fetch results, perhaps your ' +
            'connection or the service is down?';
        });
    };
  }]);
