var ArticleImage,ArticleInfiniteList,ArticleLink,ArticleList,ArticleListItem,ArticleView,mountNode;ArticleLink=React.createClass({displayName:"Article Link",handleClick:function(e){$(".overlay-modal, #article-modal").removeClass("h");$(".overlay-modal").unbind("click").click(function(){return $('.overlay-modal, [id$="-modal"]').addClass("h")});return React.render(React.createElement(ArticleView,{data:this.props.data},null),document.getElementById("article-modal"))},render:function(){return React.createElement("a",{onClick:this.handleClick.bind(this,this.props.data)},this.props.children)}});ArticleImage=React.createClass({displayName:"Article Image",render:function(){var e;e={backgroundImage:"url("+this.props.data.image_url+")"};if(typeof this.props.data.image_url==="undefined"){e={backgroundColor:"#ccc"}}return React.createElement("div",{className:"image",style:e})}});ArticleListItem=React.createClass({displayName:"Article List Item",render:function(){return React.createElement("li",null,React.createElement("div",{className:"article"},React.createElement(ArticleLink,{data:this.props.data},React.createElement(ArticleImage,{data:this.props.data})),React.createElement("h3",{className:"title"},this.props.data.title)))}});ArticleList=React.createClass({displayName:"Article List",render:function(){if(typeof this.props.data!=="undefined"){return React.createElement("ul",{className:"article-list bg sm-2 md-3 lg-4"},this.props.data.map(function(e){return React.createElement(ArticleListItem,{data:this.props.data})}))}else{return null}}});ArticleInfiniteList=React.createClass({getInitialState:function(){window.addEventListener("scroll",this.handleScroll);return{articles:[],page:0,isLoading:false,url:"http://192.168.1.17:6969/articles"}},getData:function(){var e,t;e=that.state.page+1;t={query:{link_type:"article"},count:20,page:e};return $.post(this.state.url,t,function(t){if(this.isMounted){return this.setState({articles:this.state.articles.concat(t.results),isLoading:false,page:e})}}.bind(this))},componentDidMount:function(){return this.getData()},handleScroll:function(e){var t,a,i,r;t=$(document).height();a=window.innerHeight;i=$(window).scrollTop();r=i+a;if(r+100>t){if(!this.state.isLoading){this.setState({isLoading:true});return this.getData()}}},render:function(){return React.createElement("ul",{className:"article-list bg sm-2 md-3 lg-4"},this.state.articles.map(function(e){return React.createElement(ArticleListItem,{data:e})}))}});ArticleView=React.createClass({render:function(){return React.createElement("div",{className:"rw sp-30"},React.createElement("div",{className:"cl md-4"},React.createElement("div",{id:"overview"},React.createElement("h3",{className:"title"},this.props.data.title),React.createElement("p",{className:"published"},this.props.data.pubdate),React.createElement("a",{className:"url"},this.props.data.url),React.createElement("img",{className:"image",src:this.props.data.image_url}),React.createElement("p",{className:"body"},this.props.data.body))),React.createElement("div",{className:"cl md-8"},React.createElement("div",{id:"preview"},React.createElement("iframe",{className:"preview",src:this.props.data.url,sandbox:"sandbox"}))))}});mountNode=document.getElementById("articles");React.render(React.createElement(ArticleInfiniteList),mountNode);