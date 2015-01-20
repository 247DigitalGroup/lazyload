ACP = angular.module 'ACP', ['infinite-scroll']
ACP.value 'THROTTLE_MILLISECONDS', 250

ACP.factory 'APIService', ($http) ->

	apiService = () ->
		@root = 'http://192.168.1.214:3000'
		@search =
			url: "#{@root}/articles"
			session: null
			busy: false
			error: 0
		null

	apiService.prototype.searchStart = (query, sc, ec) ->
		try
			postData =
				query: JSON.parse query
				count: 20
				page: 1
			@search.busy = true
			@search.error = 0
			that = @
			$http.post @search.url, postData
				.success (data, status, header, config) ->
					that.search.session = postData
					sc(data, status, header, config) if typeof sc is 'function'
					that.search.busy = false
				.error (data, status, header, config) ->
					ec(data, status, header, config) if typeof ec is 'function'
					that.search.busy = false
					that.search.error = 404
		catch e
			console.log e
		null

	apiService.prototype.searchNextPage = (sc, ec) ->
		try
			if @search.session?
				@search.busy = true
				postData = @search.session
				postData.page++
				that = @
				$http.post @search.url, postData
					.success (data, status, header, config) ->
						that.search.error = 0
						that.search.session = postData
						if data.results.length == 0
							that.search.error = 204
						else
							sc(data, status, header, config) if typeof sc is 'function'
						that.search.busy = false
					.error (data, status, header, config) ->
						ec(data, status, header, config) if typeof ec is 'function'
						that.search.error = 404
						that.search.busy = false
		catch e
			console.log e
		null

	apiService

ACP.controller 'ArticlesController', ($scope, APIService, $http, $sce) ->

	$scope.apiService = new APIService()

	$scope.query = '{"link_type": "article", "domain": "cnn.com"}'
	# $scope.query = '{"url": "http://money.cnn.com/2015/01/08/news/soros-ukraine-europe-50-billion/index.html?iid=HP_LN"}'
	$scope.results = []
	$scope.currentItem =
		html: ''

	previewModal = $ '#article-preview-modal'

	$scope.sendQuery = () ->
		$ previewModal
			.foundation 'reveal', 'close'
		$scope.results = []
		sc = (data, status, header, config) ->
			$scope.results = data.results
		$scope.apiService.searchStart $scope.query, sc, null
		null

	$scope.nextPage = () ->
		sc = (data, status, header, config) ->
			$scope.results = $scope.results.concat data.results
		$scope.apiService.searchNextPage sc, null
		null

	$scope.cancelCurrent = () ->
		$scope.results[i].isCurrent = false for i in [0 .. length]
		null

	$scope.setCurrent = (item) ->
		$scope.cancelCurrent()
		item.isCurrent = true
		$scope.currentItem = item
		$scope.currentItem.trustedUrl = $sce.trustAsResourceUrl item.url
		$ previewModal
			.foundation 'reveal', 'open'
		null

	$scope.calcSizeRatio = ($event, item) ->
		# image = new Image()
		# image.src = item.image_url
		# w = image.width
		# h = image.height
		# console.log $($event.target).closest('div.image')
		# holder = $($event.target).closest('.image')
		# item.imageRatio = "#{w}x#{h} / #{$(holder).width()x#{$(holder).height()}"
		null

	$scope.sendQuery()
	null

ACP.directive 'clFaceImage', ($window) ->
	{
		link: (scope, e, attr) ->
			console.log scope.item
			scope.onResize = () ->
			  e.attr 'data-width', e.width()
			  e.attr 'data-height', e.height()
			scope.onResize()
			angular.element($window).bind 'resize', () ->
			  scope.onResize()
			  scope.$apply()
			null
	}

ACP.run () ->
	$ document
		.ready () ->
			previewModal = $ '#article-preview-modal'
			$ previewModal
				.foundation 'reveal',
					animation: false
			$ document
				.on 'opened.fndtn.reveal', previewModal, () ->
					$ 'body'
						.addClass 'modal-open'
					$ previewModal
						.css 'top', "#{$(window).scrollTop()}px"
						.find 'div.data, div.source'
						.height $(window).height() - 80
				.on 'closed.fndtn.reveal', previewModal, () ->
					$ 'body'
						.removeClass 'modal-open'