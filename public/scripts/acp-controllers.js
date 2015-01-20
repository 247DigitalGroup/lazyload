(function() {
  var ACP;

  ACP = angular.module('ACP', ['infinite-scroll']);

  ACP.value('THROTTLE_MILLISECONDS', 250);

  ACP.factory('APIService', function($http) {
    var apiService;
    apiService = function() {
      this.root = 'http://192.168.1.214:3000';
      this.search = {
        url: "" + this.root + "/articles",
        session: null,
        busy: false,
        error: 0
      };
      return null;
    };
    apiService.prototype.searchStart = function(query, sc, ec) {
      var e, postData, that;
      try {
        postData = {
          query: JSON.parse(query),
          count: 20,
          page: 1
        };
        this.search.busy = true;
        this.search.error = 0;
        that = this;
        $http.post(this.search.url, postData).success(function(data, status, header, config) {
          that.search.session = postData;
          if (typeof sc === 'function') {
            sc(data, status, header, config);
          }
          return that.search.busy = false;
        }).error(function(data, status, header, config) {
          if (typeof ec === 'function') {
            ec(data, status, header, config);
          }
          that.search.busy = false;
          return that.search.error = 404;
        });
      } catch (_error) {
        e = _error;
        console.log(e);
      }
      return null;
    };
    apiService.prototype.searchNextPage = function(sc, ec) {
      var e, postData, that;
      try {
        if (this.search.session != null) {
          this.search.busy = true;
          postData = this.search.session;
          postData.page++;
          that = this;
          $http.post(this.search.url, postData).success(function(data, status, header, config) {
            that.search.error = 0;
            that.search.session = postData;
            if (data.results.length === 0) {
              that.search.error = 204;
            } else {
              if (typeof sc === 'function') {
                sc(data, status, header, config);
              }
            }
            return that.search.busy = false;
          }).error(function(data, status, header, config) {
            if (typeof ec === 'function') {
              ec(data, status, header, config);
            }
            that.search.error = 404;
            return that.search.busy = false;
          });
        }
      } catch (_error) {
        e = _error;
        console.log(e);
      }
      return null;
    };
    return apiService;
  });

  ACP.controller('ArticlesController', function($scope, APIService, $http, $sce) {
    var previewModal;
    $scope.apiService = new APIService();
    $scope.query = '{"link_type": "article", "domain": "cnn.com"}';
    $scope.results = [];
    $scope.currentItem = {
      html: ''
    };
    previewModal = $('#article-preview-modal');
    $scope.sendQuery = function() {
      var sc;
      $(previewModal).foundation('reveal', 'close');
      $scope.results = [];
      sc = function(data, status, header, config) {
        return $scope.results = data.results;
      };
      $scope.apiService.searchStart($scope.query, sc, null);
      return null;
    };
    $scope.nextPage = function() {
      var sc;
      sc = function(data, status, header, config) {
        return $scope.results = $scope.results.concat(data.results);
      };
      $scope.apiService.searchNextPage(sc, null);
      return null;
    };
    $scope.cancelCurrent = function() {
      var i, _i;
      for (i = _i = 0; 0 <= length ? _i <= length : _i >= length; i = 0 <= length ? ++_i : --_i) {
        $scope.results[i].isCurrent = false;
      }
      return null;
    };
    $scope.setCurrent = function(item) {
      $scope.cancelCurrent();
      item.isCurrent = true;
      $scope.currentItem = item;
      $scope.currentItem.trustedUrl = $sce.trustAsResourceUrl(item.url);
      $(previewModal).foundation('reveal', 'open');
      return null;
    };
    $scope.calcSizeRatio = function($event, item) {
      return null;
    };
    $scope.sendQuery();
    return null;
  });

  ACP.directive('clFaceImage', function() {
    return {
      link: function(scope, e, attr) {
        console.log("" + (e.width()) + "x" + (e.height()));
        return null;
      }
    };
  });

  ACP.run(function() {
    return $(document).ready(function() {
      var previewModal;
      previewModal = $('#article-preview-modal');
      $(previewModal).foundation('reveal', {
        animation: false
      });
      return $(document).on('opened.fndtn.reveal', previewModal, function() {
        $('body').addClass('modal-open');
        return $(previewModal).css('top', "" + ($(window).scrollTop()) + "px").find('div.data, div.source').height($(window).height() - 80);
      }).on('closed.fndtn.reveal', previewModal, function() {
        return $('body').removeClass('modal-open');
      });
    });
  });

}).call(this);
