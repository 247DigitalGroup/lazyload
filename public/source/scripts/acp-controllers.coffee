ACP = angular.module 'ACP', ['infinite-scroll']
ACP.value 'THROTTLE_MILLISECONDS', 250

ACP.filter 'toArray', () ->
	(obj) ->
		result = []
		angular.forEach obj, (val, key) ->
			result.push
				key: key
				value: val
		result

ACP.factory 'APIService', ($http) ->

	apiService = () ->
		@root = 'http://192.168.1.17:6969'
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

	$scope.query = '{"link_type": "article"}'
	# $scope.query = '{"url": "http://money.cnn.com/2015/01/08/news/soros-ukraine-europe-50-billion/index.html?iid=HP_LN"}'
	$scope.results = []
	$scope.currentItem =
		html: ''

	previewModal = $ '#article-preview-modal'

	parser = (results) ->
		output = []
		compare = (a, b) ->
			if a.score > b.score
				return -1
			if b.score > a.score
				return 1
			return 0
		for item in results
			item.categories = []
			for id, score of item.contextual_scores
				item.categories.push
					id: id
					score: score
			item.categories.sort compare
			output.push item
		output

	$scope.categories = []
	$scope.categories[1] = 'Retailers & General Merchandise'
	$scope.categories[2] = 'Dining & Nightlife'
	$scope.categories[3] = 'Media & Publications'
	$scope.categories[4] = 'Real Estate'
	$scope.categories[5] = 'Telecom'
	$scope.categories[6] = 'Occasions & Gifts'
	$scope.categories[7] = 'Jobs & Education'
	$scope.categories[8] = 'Travel & Tourism'
	$scope.categories[9] = 'Beauty & Personal Care'
	$scope.categories[10] = 'Vehicles'
	$scope.categories[11] = 'Law & Government'
	$scope.categories[12] = 'Food & Groceries'
	$scope.categories[13] = 'Apparel'
	$scope.categories[14] = 'Finance'
	$scope.categories[15] = 'Arts & Entertainment'
	$scope.categories[16] = 'Family & Community'
	$scope.categories[17] = 'Sports & Fitness'
	$scope.categories[18] = 'Home & Garden'
	$scope.categories[19] = 'Digital Technology'
	$scope.categories[21] = 'Health'
	$scope.categories[22] = 'Business & Industrial'

	$scope.reload = () ->
		$scope.sendQuery()
		null

	$scope.sendQuery = () ->
		$ previewModal
			.foundation 'reveal', 'close'
		$scope.results = []
		sc = (data, status, header, config) ->
			$scope.results = parser data.results
		$scope.apiService.searchStart $scope.query, sc, null
		null

	$scope.nextPage = () ->
		sc = (data, status, header, config) ->
			$scope.results = $scope.results.concat parser(data.results)
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

	$scope.checkScores = (e) ->
		$ e.currentTarget
			.toggleClass 'expanded'
		e.stopPropagation()
		e.preventDefault()
		null

	$scope.sendQuery()
	null

ACP.directive 'clFaceImage', ($window) ->
	{
		link: (scope, e, attrs) ->
			scope.faceDetect = () ->
				if scope.item.face_coordinates
					img = new Image()
					img.src = scope.item.image_url
					img.onload = () ->
						imageWoh = img.width / img.height
						itemWoh = scope.item_width / scope.item_height
						scale = {}
						if imageWoh > itemWoh
							scale.by = 'w'
							scale.r = scope.item_width / img.width
							scale.w = scope.item_width
							scale.h = scope.item_width / img.width * img.height
							scale.x = 0
							scale.y = (scope.item_height - scale.h) / 2
						else
							scale.by = 'h'
							scale.w = scope.item_height / img.height * img.width
							scale.r = scope.item_height / img.height
							scale.h = scope.item_height
							scale.x = (scope.item_width - scale.w) / 2
							scale.y = 0
						scale.face =
							x: "#{scope.item.face_coordinates.x * scale.r / scale.w * 100}%"
							y: "#{scope.item.face_coordinates.y * scale.r / scale.h * 100}%"
							w: "#{scope.item.face_coordinates.w * scale.r / scale.w * 100}%"
							h: "#{scope.item.face_coordinates.h * scale.r / scale.h * 100}%"
						scope.item.scale = scale
					null
			scope.onResize = () ->
				scope.item_width = e.width()
				scope.item_height = e.height()
				scope.faceDetect()
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