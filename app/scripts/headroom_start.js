	var elem=document.querySelector('header')
	var headroom = new Headroom(elem, {
		"tolerance": 3,
		"offset": 500,
		"classes": {
		"initial": "animated",
		"pinned": "swingInX",
		"unpinned": "swingOutX"
  }
});
headroom.init();

// to destroy
headroom.destroy();
