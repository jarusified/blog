(function(){
	new Headroom(document.querySelector('#header'),{
		tolerance:10,
		offset:205,
		classes:{
			initial:"animated",
			pinned:"slideDown",
			unpinned:"slideUp"
		}
	}).init();
	new Headroom(document.querySelector('#top_button'),{
		offset:500,
		classes:{
			initial:"slide",
			pinned:"slide--reset",
			uninned:"slide--down"
		}
	}).init();
}());