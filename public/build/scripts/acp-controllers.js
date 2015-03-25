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
      this.root = 'http://192.168.1.17:6969';
      this.search = {
        url: "" + this.root + "/articles",
        session: null,
        busy: false,
        error: 0
      };
      this.paginate = {};
      return null;
    };
    apiService.prototype.getPaginate = function() {
      var cls, i, paginate, _i, _ref, _ref1;
      paginate = [];
      if (this.search.session !== null) {
        for (i = _i = _ref = this.search.session.page - 5, _ref1 = this.search.session.page + 5; _i <= _ref1; i = _i += 1) {
          if (i > 0 && i < (this.search.session.total / this.search.session.count).toFixed(0)) {
            cls = [];
            if (i === this.search.session.page) {
              cls = ['current'];
            }
            paginate.push({
              label: i,
              href: '#',
              "class": cls
            });
          }
        }
      }
      return paginate;
    };
    apiService.prototype.searchStart = function(query, sc, ec) {
      var e, postData, that;
      try {
        postData = {
          query: JSON.parse(query),
          count: 20,
          total: 0,
          page: 1
        };
        this.search.busy = true;
        this.search.error = 0;
        that = this;
        $http.post(this.search.url, postData).success(function(data, status, header, config) {
          that.search.session = postData;
          if (typeof data.totalResults !== 'undefined') {
            postData.total = data.totalResults;
          }
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
    apiService.prototype.getPage = function(p, sc, ec) {
      var e, postData, that;
      p = parseInt(p, 10);
      try {
        if (this.search.session != null) {
          this.search.busy = true;
          postData = this.search.session;
          postData.page = p;
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
    $scope.query = '{"link_type": "article"}';
    $scope.results = [];
    $scope.currentItem = {
      html: ''
    };
    $scope.paginate = [];
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
    $scope.categories = [];
    $scope.categories[1] = 'Retailers & General Merchandise';
    $scope.categories[2] = 'Dining & Nightlife';
    $scope.categories[3] = 'Media & Publications';
    $scope.categories[4] = 'Real Estate';
    $scope.categories[5] = 'Telecom';
    $scope.categories[6] = 'Occasions & Gifts';
    $scope.categories[7] = 'Jobs & Education';
    $scope.categories[8] = 'Travel & Tourism';
    $scope.categories[9] = 'Beauty & Personal Care';
    $scope.categories[10] = 'Vehicles';
    $scope.categories[11] = 'Law & Government';
    $scope.categories[12] = 'Food & Groceries';
    $scope.categories[13] = 'Apparel';
    $scope.categories[14] = 'Finance';
    $scope.categories[15] = 'Arts & Entertainment';
    $scope.categories[16] = 'Family & Community';
    $scope.categories[17] = 'Sports & Fitness';
    $scope.categories[18] = 'Home & Garden';
    $scope.categories[19] = 'Digital Technology';
    $scope.categories[21] = 'Health';
    $scope.categories[22] = 'Business & Industrial';
    $scope.reload = function() {
      $scope.sendQuery();
      return null;
    };
    $scope.sendQuery = function() {
      var sc;
      $(previewModal).foundation('reveal', 'close');
      $scope.results = [];
      sc = function(data, status, header, config) {
        $scope.paginate = $scope.apiService.getPaginate();
        return $scope.results = parser(data.results);
      };
      $scope.apiService.searchStart($scope.query, sc, null);
      return null;
    };
    $scope.getPage = function(p) {
      var sc;
      sc = function(data, status, header, config) {
        $scope.paginate = $scope.apiService.getPaginate();
        return $scope.results = parser(data.results);
      };
      $scope.apiService.getPage(p, sc, null);
      return null;
    };
    $scope.getFirstPage = function() {
      $scope.getPage(1);
      return null;
    };
    $scope.getLastPage = function() {
      var lastIndex;
      lastIndex = ($scope.apiService.search.session.total / $scope.apiService.search.session.count).toFixed(0);
      $scope.getPage(lastIndex);
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
