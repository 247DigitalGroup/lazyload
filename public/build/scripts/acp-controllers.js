(function() {
  var ACP;

  ACP = angular.module('ACP', ['infinite-scroll']);

  ACP.value('THROTTLE_MILLISECONDS', 250);

  ACP.filter('toArray', function() {
    return function(obj) {
      var result;
      result = [];
      angular.forEach(obj, function(val, key) {
        return result.push({
          key: key,
          value: val
        });
      });
      return result;
    };
  });

  ACP.factory('APIService', function($http) {
    var apiService;
    apiService = function() {
      this.root = 'http://192.168.1.17:3000';
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
    var parser, previewModal;
    $scope.apiService = new APIService();
    $scope.query = '{"link_type": "article", "domain": "cnn.com"}';
    $scope.results = [];
    $scope.currentItem = {
      html: ''
    };
    previewModal = $('#article-preview-modal');
    parser = function(results) {
      var compare, id, item, output, score, _i, _len, _ref;
      output = [];
      compare = function(a, b) {
        if (a.score > b.score) {
          return -1;
        }
        if (b.score > a.score) {
          return 1;
        }
        return 0;
      };
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        item = results[_i];
        item.categories = [];
        _ref = item.contextual_scores;
        for (id in _ref) {
          score = _ref[id];
          item.categories.push({
            id: id,
            score: score
          });
        }
        item.categories.sort(compare);
        output.push(item);
      }
      return output;
    };
    $scope.sendQuery = function() {
      var sc;
      $(previewModal).foundation('reveal', 'close');
      $scope.results = [];
      sc = function(data, status, header, config) {
        return $scope.results = parser(data.results);
      };
      $scope.apiService.searchStart($scope.query, sc, null);
      return null;
    };
    $scope.nextPage = function() {
      var sc;
      sc = function(data, status, header, config) {
        return $scope.results = $scope.results.concat(parser(data.results));
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
    $scope.checkScores = function(e) {
      console.log(e);
      $(e.currentTarget).toggleClass('expanded');
      e.stopPropagation();
      e.preventDefault();
      return null;
    };
    $scope.sendQuery();
    return null;
  });

  ACP.directive('clFaceImage', function($window) {
    return {
      link: function(scope, e, attrs) {
        scope.faceDetect = function() {
          var img;
          if (scope.item.face_coordinates) {
            img = new Image();
            img.src = scope.item.image_url;
            img.onload = function() {
              var imageWoh, itemWoh, scale;
              imageWoh = img.width / img.height;
              itemWoh = scope.item_width / scope.item_height;
              scale = {};
              if (imageWoh > itemWoh) {
                scale.by = 'w';
                scale.r = scope.item_width / img.width;
                scale.w = scope.item_width;
                scale.h = scope.item_width / img.width * img.height;
                scale.x = 0;
                scale.y = (scope.item_height - scale.h) / 2;
              } else {
                scale.by = 'h';
                scale.w = scope.item_height / img.height * img.width;
                scale.r = scope.item_height / img.height;
                scale.h = scope.item_height;
                scale.x = (scope.item_width - scale.w) / 2;
                scale.y = 0;
              }
              scale.face = {
                x: "" + (scope.item.face_coordinates.x * scale.r / scale.w * 100) + "%",
                y: "" + (scope.item.face_coordinates.y * scale.r / scale.h * 100) + "%",
                w: "" + (scope.item.face_coordinates.w * scale.r / scale.w * 100) + "%",
                h: "" + (scope.item.face_coordinates.h * scale.r / scale.h * 100) + "%"
              };
              return scope.item.scale = scale;
            };
            return null;
          }
        };
        scope.onResize = function() {
          scope.item_width = e.width();
          scope.item_height = e.height();
          return scope.faceDetect();
        };
        scope.onResize();
        angular.element($window).bind('resize', function() {
          scope.onResize();
          return scope.$apply();
        });
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
