# view = $ '.form.content'
# $ document
# 	.on 'mousemove', (e) ->
# 		$ view
# 			.css {
# 				'background-position-x': (e.clientX / $(document).width() * 50) + '%'
# 				'background-position-y': (e.clientY / $(document).height() * 50) + '%'
# 			}

if typeof WOW == 'function'
	new WOW().init()

$ document
	.ready () ->
		$ document
			.foundation()