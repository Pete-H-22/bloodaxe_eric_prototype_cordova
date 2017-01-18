
$(document).ready(function() {
	
	//
	//REDIRECT TO FRONT
	//
	
	if (
		window.location.hash == "#browse"
		|| window.location.hash == "#read"
	) {
		window.location.hash = "";
	}
	
	
	//
	//SC API
	//
	
	soundcloud_id = "a00ba5d43da1e0be6a98405e062206ef";
	
	SC.initialize({
	  client_id: soundcloud_id,
	  redirect_uri: "CALLBACK_URL"
	});
	
	
	//
	// POETS INFO
	//

	//Handling NULL values in JSON database export
	var NULL = 0;
	
	/*INITIAL OFFLINE ARRAY*/
	
	/* PROBLEM - can't do a local request for 'pure' JSON file
	var home_made = new XMLHttpRequest();
		    
	home_made.open("GET", "poets_array.json", true);
	home_made.send();
				    
	home_made.onreadystatechange = function() {
		if (home_made.readyState == 4 && home_made.status == 200) {
				            
			var JSON_text = home_made.responseText;
				
			poets_array = JSON.parse(JSON_text);
		};
	};
	*/
		        	
	// TEMPORARY FIX - JSONP file included in index.html
	poets_array = local_poets_array;
	
	function connection_update(status) {
    	$('#connection_status').each(function(){
    		$(this).html("<p>"+status+"</p>");
    	});
    	console.log("Connection status: " + status);
    };
    
    array_source = "Connecting...";
    connection_update(array_source);
	
	/* RETRIEVING POETS DATA AS JSON FROM AN EXTERNAL DATABASE */
	
	//TEMPORARILY OFFLINE FOR ALPHA TESTS
    connection_update("Offline - Test mode");
	/*
    var get_remote = new XMLHttpRequest();
    
    get_remote.open("GET", "http://www.ncl.ac.uk/ncla/tests/eric_data/handler.php", true);
    get_remote.send();
    
    get_remote.onreadystatechange = function() {
    	
        if (get_remote.readyState == 4 && get_remote.status == 200) {
            
            var JSON_text = get_remote.responseText;
            console.log(get_remote);

            poets_array = JSON.parse(JSON_text);
            console.log(poets_array);
			
			array_source = "Connected";
			connection_update(array_source);
            
        } else {
        	
        	var get_over_here = new XMLHttpRequest();
        	
        	get_over_here.open("GET", "http://localhost:8888/local-handler.php", true);
		    get_over_here.send();
		    
		    get_over_here.onreadystatechange = function() {
		        if (get_over_here.readyState == 4 && get_over_here.status == 200) {
		            
		            var JSON_text = get_over_here.responseText;
					console.log(JSON_text);
		            poets_array = JSON.parse(JSON_text);
		
		            array_source = "Localhost";
		            connection_update(array_source);
		     	
		     	} else {
		        	
		        	poets_array = local_poets_array;
		        	array_source = "Offline";
		        	connection_update(array_source);
		        	
		        };
    		};
    	};
    	
    };
    */
    
    categories_array = local_categories_array;
    
    //LIST OF CURRENT CATEGORIES
    category_names = Object.keys(categories_array[0]);
    
    /* RETRIEVING CATEGORIES DATA AS JSON FROM LOCALHOST DATABASE */
	
	//TEMPORARILY OFFLINE FOR ALPHA TESTS
	/*
    var get_cat = new XMLHttpRequest();
    
    get_cat.open("GET", "http://localhost:8888/local-categories-handler.php", true);
    get_cat.send();
    
    get_cat.onreadystatechange = function() {
        if (get_cat.readyState == 4 && get_cat.status == 200) {
            
            var JSON_text = get_cat.responseText;
            console.log(JSON_text);

            categories_array = JSON.parse(JSON_text);
            
            //LIST OF CURRENT CATEGORIES
    		category_names = Object.keys(categories_array[0]);
            
        };
	};
	*/
	
	
	function article_remove(x) {
		var x_lower = x.toLowerCase();
		var x_a = x_lower.slice(0,2);
		var x_an = x_lower.slice(0,3);
		var x_the = x_lower.slice(0,4);
		if(x_a == "a " || x_an == "an " || x_the == "the ") {
			return x_lower.slice((x_lower.indexOf(" "))+1);
		} else {
			return x_lower;
		}
	}
	
	
	function sort_poets(target_array, method) {
		if (target_array == poets_array || target_array == display_poets) {
			if (method == "poem") {
				target_array.sort(function(a, b){
					var nameA = article_remove(a.poem_title);
					var nameB = article_remove(b.poem_title);
					if (nameA < nameB){ //sort string ascending
						return -1;
					} else {
						if (nameA > nameB){
					 		return 1;
						} else {
					 		return 0; //default return value (no sorting)
						}
					}
				});
			} else {
				target_array.sort(function(a, b){
					var nameA = article_remove(a.last_name); 
					var nameB = article_remove(b.last_name);
					if (nameA < nameB){ //sort string ascending
						return -1;
					} else {
						if (nameA > nameB){
					 		return 1;
						} else {
					 		return 0; //default return value (no sorting)
						}
					}
				});
			}
		} else {
			target_array.sort(function(a, b){
				var nameA = article_remove(a[method]);
				var nameB = article_remove(b[method]);
				if (nameA < nameB){ //sort string ascending
					return -1;
				} else {
					if (nameA > nameB){
				 		return 1;
					} else {
				 		return 0; //default return value (no sorting)
					}
				}
			});
		}
	}
	
    
	
	//SLIDER CLICK (update to scroll up?)
	$("#slider").click(function(){
		$("#front>div").removeClass('super_hide');
	    $(this).css("height", "0");
	    $('#slider p').addClass('hidden');
	});
	
	
	//
	// Mode-change function
	//
	
	current_mode = "front";
	
	function change_mode(mode) {
		
		if (mode == 'front') {
			$('*').removeClass('browse read browse_read');
			$('div#main, div#search, div#header').addClass('front');
		}
		
		if (mode == 'browse') {
			$('*').removeClass('front read browse_read');
			$('div#main, div#search, div#header, #top-nav').addClass('browse');
			
			$('#content-list').removeClass('themes-display categories-display search-display');
			$('.display-tab#video, #audio-frame').html("");
			$('#browse h1.ui-title').html(browse_title);
		}
		
		if (mode == 'read') {
			$('*').removeClass('front browse browse_read');
			$('#menu, #poem-nav, #poem-display, #display-meta, .display-tab').addClass('read');
			
			$('li#menu img').attr("src", "img/icons/menu.png");
		}
		
		if (mode == 'browse_read') {
			$('*').removeClass('front browse read');
			$('#menu, #poem-nav, #poem-display, #display-meta, .display-tab').addClass('browse_read');
			$('div#main, div#search, div#header, #top-nav').addClass('browse');
			
			$('#header, #top-nav, #footer').removeClass('hidden');
			if ($('ul#poem-nav').attr('width') < $('body').attr('width')) {
				$('li#menu img').attr("src", "img/icons/menu_close_left.png");
			} else {
				$('li#menu img').attr("src", "img/icons/menu_close_up.png");
			}
			
			subnav_display();
		}
		current_mode = mode;
		console.log(current_mode);
		
		connection_update(array_source);
	};
	
	
	//Basic function for silencing audio/video when navigating away from Read mode
	$('.ui-icon-back').click(function(){
		$('.display-tab#video, #audio-frame').html("");
	});
	
	
	//
	// Nav button functions
	//
	
	//THESE ARE SET BY EACH LIST ITEM WHEN CLICKED
	var selected_id_name = "";
	var selected_id_number = 0;
	var selected_array_index = 0;
	//Each button sets itself ('this') to 'selected_thing' when clicked
	var selected_thing = ""; 
	
	//Return to home page, collapse all sub-menus
	var go_home = function() {
		$('.navbar').removeClass('hidden');
		$('.sub-navbar').addClass('hidden');
	    $('.navbar li').removeClass('active ui-btn-active');
		//$('.page').addClass('hidden');
		//$('.list').addClass('hidden');
		$("#video").empty();
		$("#audio-frame").empty();
		
		$('#welcome').removeClass('hidden');
		$('#top-nav').removeClass('browse');
		$('#top-nav').addClass('front');
	};
	
	//Open a top-level menu item, clear everything else
	var top_level = function() {
		change_mode('browse');
		$('.sub-navbar').addClass('hidden');
		//$('.page').addClass('hidden');
		$('.list').addClass('hidden');
		$("#video").empty();
		$("#audio-frame").empty();
		
		$('ul#top-nav li').removeClass('active ui-btn-active');
		$(selected_thing).addClass('active ui-btn-active');
		$('#top-nav').removeClass('front');
		$('#top-nav').addClass('browse');
		
		$('#topnav-dropdown option').each(function() {
			$(this).prop("selected", false);
			console.log($(this).attr('id') + " : " + $(this).prop("selected"));
		});
		
		
	};
	
	//Displaying list of poems/poets
	var list_content = function(display) {
		$('#content-list').removeClass('hidden');
		$('#content-list').empty();
		$('#content-list').html(
			"<ul>" +
			(function() {
				//SORTING POETS_ARRAY
				if (display == "poets") {
					sort_poets(poets_array);
				} else {
					sort_poets(poets_array, 'poem');
				}
				//CREATING LIST ELEMENTS
				var gen_list = "";
				for (i = 0; i < poets_array.length; i++) {
					if (display == "poets") {
						if (array_source == "Offline" || array_source == "Connecting...") {
							gen_list = gen_list.concat(
									"<li class='ui-btn' id='" + poets_array[i].id_number + "'><a href='#read'>"
									+ "<img class='author_photo' onerror='this.style.display=\"none\"' src='img/author_photos/" + poets_array[i].id_name + ".jpg'/>"
									+ "<p>" + poets_array[i].first_name + " " + poets_array[i].last_name + "</p>"
									+ "</a></li><hr id='" + poets_array[i].id_number + "'/>"
							);
						} else {
							gen_list = gen_list.concat(
									"<li class='ui-btn' id='" + poets_array[i].id_number + "'><a href='#read'>"
									+ "<img class='author_photo' onerror='this.style.display=\"none\"' src='http://localhost:8888/author_photos/" + poets_array[i].id_name + ".jpg'/>"
									+ "<p>" + poets_array[i].first_name + " " + poets_array[i].last_name + "</p>"
									+ "</a></li><hr id='" + poets_array[i].id_number + "'/>"
							);
						}
					} else {
						gen_list = gen_list.concat(
							"<li class='ui-btn' id='" + poets_array[i].id_number + "'><a href='#read'>"
							+ "<p><strong>" + poets_array[i].poem_title + "</strong>"
							+ "<br/><em> by " + poets_array[i].first_name + " " + poets_array[i].last_name + "</em></p>"
							+ "</a></li><hr id='" + poets_array[i].id_number + "'/>"
						);
					}
				};
				return gen_list;
			})()
			+ "</ul>");
	};
	
	//Filtering a list of poets/poems  -- PROBLEM HERE - not filtering <hr /> elements!!
	var filter_content = function(media) {
		if (media == "video") {
			for (i = 0; i < poets_array.length; i++) {
				if (poets_array[i].video == 0) {
					$('div#content-list ul li#' + poets_array[i].id_number).addClass('hidden');
					$('div#content-list ul hr#' + poets_array[i].id_number).addClass('hidden');
				}
			};
		};
		if (media == "audio") {
			for (i = 0; i < poets_array.length; i++) {
				if (poets_array[i].audio == 0) {
					$('div#content-list ul li#' + poets_array[i].id_number).addClass('hidden');
					$('div#content-list ul hr#' + poets_array[i].id_number).addClass('hidden');
				}
			};
		};
	};
	
	//Filtering displayed themes in the themes section
	
	var filter_themes = function(source) {
		if (source == 'bloodaxe') {
			$('div#themes-list ul li').each(function(){
				if (bloodaxe_themes.indexOf($(this).attr('id')) == -1) {
					$(this).addClass('hidden');
				}
			});
		};
		if (source == 'my') {
			var mythemes_count = 0;
			$('div#themes-list ul li').each(function(){
				if (my_themes.indexOf($(this).attr('id')) == -1) {
					$(this).addClass('hidden');
				} else {
					mythemes_count = mythemes_count + 1;
				}
			});
			if (mythemes_count == 0) {
				$('#themes-list').html(
					"<p class='message'>You haven't tagged any poems with themes yet.</p>"
				);
			}
		};
	};
	
	//Open a poets sub-menu item
	var poets_menu = function() {
		//$('#poem-nav').addClass('hidden');
		//$('.page').addClass('hidden');
		//$('.list').addClass('hidden');
		$("#video").empty();
		$("#audio-frame").empty();
		
		$('#content-list').removeClass('hidden');
		
		$('ul#poets-nav li').removeClass('active ui-btn-active');
		$(selected_thing).addClass('active ui-btn-active');
		
		
	};
	
	//Displaying an item
	var display_item = function() {
		change_mode('read');
		//$('.page').addClass('hidden');
		//$('.list').addClass('hidden');
		
		//$('#poem-display').removeClass('hidden');
		//$('#poem-nav').removeClass('hidden');
		//$('#poem-nav li').removeClass('hidden');
		
		$('.display-tab').addClass('hidden');
		$('#text-audio').removeClass('hidden');
		
		$('#poem-nav li, #poem-nav li a').removeClass('active ui-btn-active');
		$('#text-audio-poem').addClass('active ui-btn-active');
		
		$('#display-title').empty();
		$('#display-title').html(
			"<h1>"
			+ poets_array[selected_array_index].poem_title
			+ "</h1>"
			+ "<h2>"
			+ " by " + poets_array[selected_array_index].first_name + " " + poets_array[selected_array_index].last_name
			+ "</h2>"
		);
		
		$('#text-audio').removeClass('hidden');
		$('#text-frame').html(
			poets_array[selected_array_index].poem_text
			+ "<div class='ui-btn' id='book-link'> From the collection <em>" + poets_array[selected_array_index].featured_book_title + "</em>, available from the <a target='_blank' href='" + poets_array[selected_array_index].featured_book_link + "'>Bloodaxe website</a>.</div>" 
		);
		
		var soundcloud_track = poets_array[selected_array_index].audio_embed;
		
		$('#audio-frame').addClass('hidden');
		$('#audio-frame').empty();
		if (poets_array[selected_array_index].audio == 1) {
			$('#audio-frame').removeClass('hidden');
			$('#audio-frame').html(
			'<audio controls><source src="https://api.soundcloud.com/tracks/'
			+soundcloud_track+
			'/stream?client_id='
			+soundcloud_id+
			'">Unable to load audio at this time.</audio>'
			);
			$('#text-audio-poem').html('Text and Audio');
		} else {
			$('#audio-frame').addClass('hidden');
			$('#text-audio-poem').html('Text');
		};			
		
		$("#video").addClass('hidden');	
		$("#video").empty();	
		if (poets_array[selected_array_index].video == 1) {
			$("#video-poem").removeClass('hidden');
			if (poets_array[selected_array_index].video_embed.includes("vimeo")) {
						$('#video').html(
							"<div id='vimeo_embed'></div>"
						);
		        		//VIDEO EMBED v.3:
						var options = {
					        url: poets_array[selected_array_index].video_embed,
					        width: 640,
					        loop: false
					    };
					
					    var player = new Vimeo.Player('vimeo_embed', options);
						var start_time = parseInt(poets_array[selected_array_index].video_start);
						var end_time = parseInt(poets_array[selected_array_index].video_end);
						
						if (start_time > 0) {
						    player.setCurrentTime(start_time).then(function(data){
						    	player.pause();
						    });
						}
						
						if (end_time > 0) {
								    player.on('timeupdate', function(data) {
								        if (
								        	data['seconds'] > end_time 
								        	|| 
								        	data['seconds'] < start_time
								        ) {
								        	player.pause();
								        	player.setCurrentTime(start_time);
								        }
								    });
						}
					
					    
		  } else {
		  	$('#video').html(
			//VIDEO EMBED v.1:
			poets_array[selected_array_index].video_embed
			//VIDEO EMBED v.2 (used with click event on img):
			//"<img id='play_vid' src='img/icons/play_button.png' />"
			);
		  }
		} else {
			$('#video-poem').addClass('hidden');
		};
		if ($('li#videos-button').hasClass('active ui-btn-active') || ( $('li#video-poets').hasClass('active ui-btn-active') && $('li#poets-button').hasClass('active ui-btn-active') ) ) {
			$('#text-audio').addClass('hidden');
			$("#video").removeClass('hidden');
			$('#poem-nav li, #poem-nav li a').removeClass('active ui-btn-active');
			$('#video-poem').addClass('active ui-btn-active');
		} else {
			
		};
		
		$("#bio").addClass('hidden');
		$("#bio").html(
			"<img style='float:left' class='author_photo' onerror='this.style.display=\"none\"' src='" 
			+ function() {
				if (array_source == "Offline" || array_source == "Connecting...") {
					return "img/author_photos/";
				} else {
					return "http://localhost:8888/author_photos/";
				}
			}()
			+ poets_array[selected_array_index].id_name + ".jpg'/>" 
			+ poets_array[selected_array_index].bio
			+ "<div class='ui-btn' id='author-link'><a target='_blank' href='" + poets_array[selected_array_index].author_link + "'> View on Bloodaxe website </a></div>"
		);
		
		if (fav_array.indexOf(selected_id_number) != -1) {
			//$('#favourite img').attr("src", "img/icons/star_full.png");
			$('#favourite').html("Remove from Favourites");
			$('#favourite').addClass('is_fav');
		} else {
			//$('#favourite img').attr("src", "img/icons/star_empty.png");
			$('#favourite').html("Add to Favourites");
			$('#favourite').removeClass('is_fav');
		};
		
		generate_email();
		generate_tweet();
		
		apply_display_settings();
		
		$("#settings_panel").addClass('hidden');
		$("#settings_button").removeClass('active ui-btn-active');
		
		
	};
	
	//Display the correct sub-nav back button
	function subnav_display() {
		if (selected_thing.hasClass('search_item')) {
			$('#search_results_button').removeClass('hidden');
		};
		
		if (selected_thing.hasClass('categories_item')) {
			$('#categories_results_button').removeClass('hidden');
		};
		
		if (selected_thing.hasClass('themes_item')) {
			$('#themes-nav').addClass('hidden');
			$('#theme_results_button').removeClass('hidden');
		};
		
		if (selected_thing.hasClass('favourites_item')) {
			$('#favourites_results_button').removeClass('hidden');
		};
	};
	
	//Open a poem display menu item
	var display_tab = function() {
		$('.display-tab').addClass('hidden');
		$('#poem-nav li, #poem-nav li a').removeClass('active ui-btn-active');
		$(selected_thing).addClass('active ui-btn-active');
		
		
	};


	//
	//CLICK EVENTS
	//	
	
	//HEADER CLICK
	$('#header h1, #header-home').click(function() {
	    selected_thing = $(this);
	    go_home();
	    change_mode('front');
	});
	
	$('.open_search').click(function(){
		$(this).toggleClass('active ui-btn-active');
		$('#search_panel').toggleClass('hidden');
	});
	
	// TOP-LEVEL NAV CLICKS
	
	$('#poets-button').click(function() {
		selected_thing = $(this);
	    browse_title = "Poets";
	    top_level();
	    
		$('#poets-nav').removeClass('hidden');
		//$('option[value=poets-button]').prop("selected", true);
		
		list_content("poets");
		
		$('ul#poets-nav li').removeClass('active ui-btn-active');
		$('#all-poets, #all-poets a').addClass('active ui-btn-active');
		
	});
		
	$('#poems-button').click(function() {
		selected_thing = $(this);
	   	browse_title = "Poems";
	    top_level();
	    
		//$('option[value=poems-button]').prop("selected", true);
		
		list_content("poems");
		
	});
	
	$('#videos-button').click(function() {
		selected_thing = $(this);
	    browse_title = "Videos";
	    top_level();
	    
		//$('option[value=videos-button]').prop("selected", true);
		
		list_content("poems");
		filter_content("video");
		
	});
	
	$('#audios-button').click(function() {
		selected_thing = $(this);
	    browse_title = "Audio";
	    top_level();
		
		//$('option[value=audios-button]').prop("selected", true);
		
		list_content("poems");
		filter_content("audio");
		
	});
	
	$('#about-button').click(function() {
		selected_thing = $(this);
	    top_level();	    
		
		$('#about').removeClass('hidden');
		
	});
	
	$('#categories-button').click(function() {
		selected_thing = $(this);
	    browse_title = "Categories";
	    top_level();
	    
		//$('option[value=categories-button]').prop("selected", true);
	    
	    categories_browser();
	    
	});
	
	$('#themes-button').click(function() {
		selected_thing = $(this);
	    browse_title = "Themes";
	    top_level();
	    
		//$('option[value=themes-button]').prop("selected", true);
	    
	    $('#themes-nav').removeClass('hidden');
	    $('#content-list').addClass('themes-display');
	    
	    $('#themes-list, #content-list').removeClass('hidden');
	    
	    themes_browser();
	    
	    $('ul#themes-nav li').removeClass('active ui-btn-active');
		$('#all-themes, #all-themes a').addClass('active ui-btn-active');
		
	});
	
	$('#favourites-button').click(function() {
		selected_thing = $(this);
	    browse_title = "Favourites";
	    top_level();
	    
		//$('option[value=favourites-button]').prop("selected", true);
	    
	    favourites_display();
		
	});
	
	// BROWSE DROPDOWN
	
	$('select#topnav-dropdown').change(function(){
		var selected_option = $(this).children(":selected").attr('id');
		$('#'+selected_option).trigger('click');
	});
	
	
	// POETS SUB-MENU CLICKS
	
	$('#all-poets').click(function() {
		selected_thing = $(this);
		poets_menu();
		
		list_content('poets');
		
	});
	
	$('#audio-poets').click(function() {
		selected_thing = $(this);
		poets_menu();
		
		list_content('poets');
		filter_content('audio');
		
	});
	
	$('#video-poets').click(function() {
		selected_thing = $(this);		
		poets_menu();
		
		list_content('poets');
		filter_content('video');
		
	});
	
	
	// THEMES SUB-MENU CLICKS
	
	$('#all-themes').click(function() {
		selected_thing = $(this);
		themes_browser();
	});
	
	$('#bloodaxe-themes').click(function() {
		selected_thing = $(this);
		themes_browser();
		filter_themes('bloodaxe');
	});
	
	$('#my-themes').click(function() {
		selected_thing = $(this);
		themes_browser();
		filter_themes('my');
	});
	
	
	// DISPLAY ITEM CLICKS
	
	$('#content-list').on('click','ul li',(function() {
		selected_thing = $(this);		
		
		selected_id_number = selected_thing.attr("id");		
		selected_array_index = $.map(poets_array, function(obj, index) {
		    if(obj.id_number == selected_id_number) {
		        return index;
		    }
		});
		selected_id_name = poets_array[selected_array_index].id_name;
		
		display_item();
		
	}));
	
	$('#random-front, #random-browse').click(function(){
		selected_thing = $(this);
		
		selected_array_index = Math.floor(Math.random() * poets_array.length);
		selected_id_number = poets_array[selected_array_index].id_number;
		selected_id_name = poets_array[selected_array_index].id_name;
		
		//go_home();
		change_mode('read');
		display_item();
		
	});
	
	
	// POEM DISPLAY NAV CLICKS
	
	$('#menu').click(function() {
		if (current_mode == 'read') {
			change_mode('browse_read');
		} else {
			if (current_mode == 'browse_read') {
				change_mode('read');
			};
		}
	});
	
	$('#text-audio-poem').click(function() {
		selected_thing = $(this);
		display_tab();
		
		$('#text-audio').removeClass('hidden');
		
	});
	
	$('#video-poem').click(function() {
		selected_thing = $(this);
		display_tab();
		
		$('#video').removeClass('hidden');
		
	});
	
	$('#video').on('click','img#play_vid',(function() {
		$('#video').html(
			poets_array[selected_array_index].video_embed
		);
	}));
	
	$('#bio-poem').click(function() {
		selected_thing = $(this);
		display_tab();
		
		$('#bio').removeClass('hidden');
		
	});
	
	
	//CATEGORY BROWSING
	
	function categories_browser() {
		$('#categories-list').removeClass('hidden');
		$('#content-list').addClass('categories-display');
		
		//SORTING CATEGORIES
		category_names.sort(function(a, b){
			var nameA = article_remove(a);
			var nameB = article_remove(b);
			if (nameA < nameB){ //sort string ascending
				return -1;
			} else {
				if (nameA > nameB){
			 		return 1;
				} else {
			 		return 0; //default return value (no sorting)
				}
			}
		});
		
		//DISPLAYING CATAGORIES
		gen_list = "";
		for (c in category_names) {
			if (category_names[c] != 'id_number') {
				gen_list = gen_list.concat(
					"<input type='radio' name='categories' value='" + category_names[c] + "'>"
					+ function(){
						if (category_names[c][0] == category_names[c][0].toUpperCase()) {
							return category_names[c];
						} else {
							var capitalised = category_names[c][0].toUpperCase();
							for (k = 1; k < category_names[c].length; k++) {
								capitalised = capitalised.concat(category_names[c][k]);
							}
							return capitalised;
						}
					}()
					+ "<br/>"
				);
			}
		};
		$('#categories-list').html(gen_list);
		$('#categories-list').css({"height" : "16em"});
		$("#content-list").removeClass('hidden');
		$('#content-list').html("<p class='message'>Select a category to view poets.</p>");
	};
	
	
	//CATEGORY SELECTION CLICKS
	
	$('#categories-list').on('click','input:radio',(function() {
		selected_thing = $(this);
		selected_category = selected_thing.attr('value');
		categories_results_display();
	}));
		
	function categories_results_display() {
		//$('.page').addClass('hidden');
		$('.sub-navbar').addClass('hidden');
		$('#categories-list').removeClass('hidden');
		$('#content-list').removeClass('hidden');
		
		display_poets = [];
		gen_list = "<ul>";
		for (i in categories_array) {
			if (categories_array[i][selected_category] == 1) {
				var n_id = categories_array[i]["id_number"];
				var n_index = $.map(poets_array, function(obj, index) {
					if(obj.id_number == n_id) {
						return index;
					}
				});
				display_poets = display_poets.concat(poets_array[n_index]);
			}
		};
		sort_poets(display_poets);
		for (p in display_poets) {
			gen_list = gen_list.concat(
				"<li class = 'categories_item ui-btn' id='" + display_poets[p].id_number + "'><a href='#read'>"
				+ "<p><strong>" + display_poets[p].first_name + " " + display_poets[p].last_name + "</strong></p>"
				+ "<br /><p><em> Featured poem: " + display_poets[p].poem_title + "</em></p>"
				+ "</a></li>"
			);
		}	
		if (gen_list == '<ul>') {
			$('#categories-list').css({"height" : "16em"});
			gen_list = "<p class='message'>Sorry, that category is currently empty.</p>";
		} else {
			gen_list = gen_list.concat("</ul>");
		};
		$('#categories-list').css({"height" : "8em"});
		$('#content-list').html(gen_list);
		
	};
	
	/*
	$('#categories_results_button').click( function() {
		categories_results_display();	
	});
	*/
	
	
	//THEME BUTTON CLICKS
	
	$('#themes-list').on('click','ul li',(function() {
		selected_thing = $(this);
		var selected_theme = selected_thing.html();
		$("#content-list").removeClass('hidden');
		$('#content-list').empty();
		
		//ADDING A THEME FILTER
		if (($(selected_thing).hasClass('active ui-btn-active')) == false) {
			$(selected_thing).addClass('active ui-btn-active');
			active_themes.push(selected_theme);
		}
		
		//REMOVING A THEME FILTER
		else {
			$(selected_thing).removeClass('active ui-btn-active');
			var to_remove = active_themes.indexOf(selected_theme);
			active_themes.splice(to_remove,1);

		};
		
		//COMPILING LIST OF POETS WITH THEMES
		
		poets_with_theme = [];
		
		// NO THEMES SELECTED - DISPLAY NOTHING
		if (active_themes.length == 0) {
			$('#content-list').empty();
		
		} else {
			//POPULATING DISPLAY LIST WITH FIRST SELECTED THEME
			for (p in poets_array) {
				if (poets_array[p].themes.indexOf(active_themes[0]) != -1 || poets_array[p].user_themes.indexOf(active_themes[0]) != -1) {
					poets_with_theme.push(poets_array[p].id_number);
				}
			}
			//FILTERING DISPLAY LIST WITH SUBSEQUENT SELECTED THEMES
			for (t = 1; t < active_themes.length; t++) {
				for (p in poets_array) {
					if (poets_with_theme.indexOf(poets_array[p].id_number) != -1 && (poets_array[p].themes.indexOf(active_themes[t]) === -1 && poets_array[p].user_themes.indexOf(active_themes[t]) === -1)) {
						var to_remove = poets_with_theme.indexOf(poets_array[p].id_number);
						poets_with_theme.splice(to_remove, 1);
					}
				}
			}
			//REMOVING DUPLICATES
			var filtered_id_list = [];
			
			for (var a in poets_with_theme) {
				if(filtered_id_list.indexOf(poets_with_theme[a]) === -1){
					filtered_id_list.push(poets_with_theme[a]);
				};
			};
			poets_with_theme = filtered_id_list;
		}

		
		console.log(active_themes);
		console.log(poets_with_theme);
		
		//DISPLAYING FILTERED THEME RESULTS
		
		theme_results_display();
		
		function theme_results_display() {
			//$('.page').addClass('hidden');
			$('.sub-navbar').addClass('hidden');
			$('#themes-nav').removeClass('hidden');
			$('#themes-list').removeClass('hidden');
			$('#content-list').removeClass('hidden');
			
			
			if (poets_with_theme.length <= 0) {
				$('#themes-list').css({"height" : "16em"});
				if (active_themes.length <= 0) {
					$('#content-list').html(
						"<p class='message'>Select a theme or combination of themes to browse poems.</p>"
					);
				} else {
					$('#content-list').html(
						"<p class='message'>Sorry, no poems match that combination of themes.</p>"
					);
				}
			} else {
				$('#themes-list').css({"height" : "8em"});
				$('#content-list').html(
					"<ul>" +
					(function() {
						var gen_list = "";
						for (i=0; i < poets_with_theme.length; i++) {
							
							var n_id = poets_with_theme[i];
			    			var n_index = $.map(poets_array, function(obj, index) {
							    if(obj.id_number == n_id) {
							        return index;
							    }
							});
							
			    			gen_list = gen_list.concat(
								"<li class = 'themes_item ui-btn' id='" + n_id + "'><a href='#read'>"
								+ "<p><strong>" + poets_array[n_index].first_name + " " + poets_array[n_index].last_name + "</strong></p>"
								+ "<br /><p><em> Featured poem: " + poets_array[n_index].poem_title + "</em></p>"
								+ "</a></li><hr />"
							);			
			    		};
			    		return gen_list;
					})()
					+ "</ul>"			
				);
			}
		};
		
		$('#theme_results_button').click( function() {
			theme_results_display();	
		});
	
	}));
	
	//
	// THEME BROWSING
	//
	
	function themes_browser() {
		$('ul#themes-nav li').removeClass('active ui-btn-active');
		$(selected_thing).addClass('active ui-btn-active');
		
		
		themes_list = [];
		active_themes = [];
		bloodaxe_themes = [];
		user_themes = [];
		
		for (poet in poets_array) {
			var add_themes = poets_array[poet].themes.split(",");
			var add_user_themes = poets_array[poet].user_themes.split(",");
			bloodaxe_themes = bloodaxe_themes.concat(add_themes);
			user_themes = user_themes.concat(add_user_themes);
			themes_list = themes_list.concat(add_themes);
			themes_list = themes_list.concat(add_user_themes);	
		};
		
		// FILTERING REPEATED THEMES
		
		var filtered_themes_list = [];
		
		for (var a in themes_list) {
        	if(themes_list[a] != "" && filtered_themes_list.indexOf(themes_list[a]) === -1){
            	filtered_themes_list.push(themes_list[a]);
        	};
    	};
    	
    	//SORTING FILTERED LIST
    	themes_list = filtered_themes_list.sort();
    	
    	//DISPLAYING
    	
    	$('#themes-list').removeClass('hidden');
		$('#themes-list').empty();
		$('#themes-list').html(
			"<ul>" +
			(function() {
				themes_display = "";
				for (var w = 0; w < themes_list.length; w++) {
						var list_item = "<li class='ui-btn ui-btn-inline' id='" + themes_list[w] + "'>" + themes_list[w] + "</li>";
						themes_display = themes_display.concat(list_item);
				};
				return themes_display;
			})()
			+"</ul>"
		);
		$('#content-list').removeClass('hidden');
		$('#content-list').html(
			"<p class='message'>Select a theme or combination of themes to browse poems.</p>"
		);
		
	};
	
	
	//
	// USER-TAGGING
	//
	
	// Open/Close Add Themes panel
	$('#tag_button').click(function() {
		open_meta($(this));
	});
	
	// Getting saved tags, if any
	if (localStorage.my_themes != undefined) {
			my_themes = JSON.parse(localStorage.my_themes);
	} else {
			my_themes = [];
	};
	
	// GETTING TAGS FROM UI
	$('#tag_submit').click(function(){
		var new_tags = $("#tags_box").val();
		new_tags = new_tags.toLowerCase();
		themes_cleaner = function() {
			while (new_tags[new_tags.length - 1] == " " || new_tags[new_tags.length - 1] == "," || new_tags.indexOf(", ") != -1 || new_tags.indexOf(" ,") != -1 || new_tags.indexOf(",,") != -1) {
				new_tags = new_tags.replace(", ",",");
				new_tags = new_tags.replace(" ,",",");
				new_tags = new_tags.replace(",,",",");
				if (new_tags[new_tags.length - 1] == " " || new_tags[new_tags.length - 1] == ",") {
					new_tags = new_tags.slice(0,-1);
				};
			}
		};
		themes_cleaner();
		$("#tags_box").val("");
		
		//STORING ADDED TAGS LOCALLY
		
		var new_tags_array = new_tags.split(",");
		new_tags = "";
		
		for (t in new_tags_array) {
			if (my_themes.indexOf(t) == -1) {
				my_themes = my_themes.concat(new_tags_array[t]);
			}
		}
		localStorage.my_themes = JSON.stringify(my_themes);
	
		//ADDING NEW TAGS TO POETS_ARRAY AND EXTERNAL DB
		var n_index = $.map(poets_array, function(obj, index) {
			if(obj.id_number == selected_id_number) {
				return index;
			}
		});
		
		for (n in new_tags_array) {
			if (poets_array[n_index].user_themes.indexOf(new_tags_array[n]) == -1 && poets_array[n_index].themes.indexOf(new_tags_array[n]) == -1) {
				if (new_tags == "") {
					new_tags = new_tags.concat(new_tags_array[n]);
				} else {
					new_tags = new_tags.concat("," + new_tags_array[n]);
				};
			};
		};
		
		themes_cleaner();
		if (new_tags != "") {
			if (poets_array[n_index].user_themes == "") {
				poets_array[n_index].user_themes = poets_array[n_index].user_themes.concat(new_tags);
			} else {
				poets_array[n_index].user_themes = poets_array[n_index].user_themes.concat("," + new_tags);
			};
			
			//CONNECT TO DB 
			
			console.log(selected_id_number);
			console.log(poets_array[n_index].user_themes);
			//updating localhost
			$.ajax({
				url: "http://localhost:8888/put_handler.php", 
				type: "POST",
				data: {
					id_number: selected_id_number,
					user_themes: poets_array[n_index].user_themes
				}
			});
			//updating remote server
			$.ajax({
				url: "http://www.ncl.ac.uk/ncla/tests/eric_data/put_handler.php", 
				type: "POST",
				data: {
					id_number: selected_id_number,
					user_themes: poets_array[n_index].user_themes
				}
			});
			
		};
	
	});
	
	
	//
	// SEARCH FUNCTIONS
	//	
	
	$("#search_button").click(function(){
		search_term = ($("#search_box").val()).toLowerCase();
		search_words = search_term.split(" ");
		results = [];
		console.log(search_term);
		console.log(search_words);
		
		search_cycle(search_term);
		
		for (var i = 0; i < search_words.length; i++) {
			search_cycle(search_words[i]);			
		};
		
		// FILTERING REPEATED RESULTS
		
		filtered_results = [];
		
		for (var d in results) {
        	if(filtered_results.indexOf(results[d]) === -1){
            	filtered_results.push(results[d]);
        	};
    	};
    	
    	console.log(filtered_results);
    	search_display();
    	
	});
	
	$('#search_results_button').click(function() {
		search_display();
	}); 
	
	$('#browse_button').click(function() {
		go_home();
	});
	
	function search_cycle(word) {
		//searching Poet last name
		for (i=0; i < poets_array.length; i++) {
			target = (poets_array[i].last_name).toLowerCase();
			if (target.indexOf(word) >= 0) {
				results.push(poets_array[i].id_number);
			}
		};
		//searching Poet first name
		for (i=0; i < poets_array.length; i++) {
			target = (poets_array[i].first_name).toLowerCase();
			if (target.indexOf(word) >= 0) {
				results.push(poets_array[i].id_number);
			}
		};
		//searching Poem title
		for (i=0; i < poets_array.length; i++) {
			target = (poets_array[i].poem_title).toLowerCase();
			if (target.indexOf(word) >= 0) {
				results.push(poets_array[i].id_number);
			}
		};
		//searching main Themes
		for (i=0; i < poets_array.length; i++) {
			target = (poets_array[i].themes).toLowerCase();
			if (target.indexOf(word) >= 0) {
				results.push(poets_array[i].id_number);
			}
		};
		//searching user Themes
		for (i=0; i < poets_array.length; i++) {
			target = (poets_array[i].user_themes).toLowerCase();
			if (target.indexOf(word) >= 0) {
				results.push(poets_array[i].id_number);
			}
		};
		//searching Poet bio
		for (i=0; i < poets_array.length; i++) {
			target = (poets_array[i].bio).toLowerCase();
			if (target.indexOf(word) >= 0) {
				results.push(poets_array[i].id_number);
			}
		};
		//searching Poem text
		for (i=0; i < poets_array.length; i++) {
			target = (poets_array[i].poem_text).toLowerCase();
			if (target.indexOf(word) >= 0) {
				results.push(poets_array[i].id_number);
			}
		};
		
	};
	
	function search_display() {
		console.log("search_display firing OK");
		browse_title = "Search";
		change_mode('browse');
		//$('.content').addClass('hidden');
		$('ul.navbar li').removeClass('active ui-btn-active');
    	$('.sub-navbar').addClass('hidden');
    	$('#content-list').removeClass('hidden');
    	$('#content-list').addClass('search-display');
		$('#content-list').empty();
		$('#content-list').html(
			"<p><strong><em>Search results for '" + search_term + "':</em></strong></p><br />" +
			"<ul>" +
			(function() {
				var gen_list = "";
				for (i=0; i < filtered_results.length; i++) {
	    			var n_id = filtered_results[i];
	    			var n_index = $.map(poets_array, function(obj, index) {
					    if(obj.id_number == n_id) {
					        return index;
					    }
					});
	    			gen_list = gen_list.concat(
						"<li class = 'search_item ui-btn' id='" + n_id + "'><a href='#read'>"
						+ "<p><strong>" + poets_array[n_index].first_name + " " + poets_array[n_index].last_name + "</strong></p>"
						+ "<br /><p><em> Featured poem: " + poets_array[n_index].poem_title + "</em></p>"
						+ "</a></li><hr />"
					);			
	    		};
	    		if (gen_list == "") {
	    			gen_list = "<li><p class='message'>No search results available.</p></li>";
	    		}
	    		return gen_list;
			})()
			+ "</ul>"		
		);
		$("#search_box").val("");
		
	};
	
	
	//
	// FAVOURITES
	//
	
	/*
	var ExistingFavourites = true; 
	try{ localStorage.fav_array; }
	catch(e) {
	    if(e.name == "ReferenceError") {
	        ExistingFavourites = false;
	    }
	};
	*/
	
	if (localStorage.fav_array != undefined) {
		fav_array = JSON.parse(localStorage.fav_array);
	} else {
		fav_array = [];
	};
	
	$("#favourite").on( "click", function() {
		if ($("#favourite img").attr("src") == "img/icons/star_empty.png" || $('#favourite').hasClass('is_fav') == false) {
			//$("#favourite img").attr("src", "img/icons/star_full.png");
			$('#favourite').html("Remove from Favourites");
			$('#favourite').addClass('is_fav');
			if (fav_array.indexOf(selected_id_number) == -1) {
				fav_array = fav_array.concat(selected_id_number);
			}
		} else {
			//$("#favourite img").attr("src", "img/icons/star_empty.png");
			$('#favourite').html("Add to Favourites");
			$('#favourite').removeClass('is_fav');
			if (fav_array.indexOf(selected_id_number) != -1) {
				var to_remove = fav_array.indexOf(selected_id_number);
				fav_array.splice(to_remove,1);
			}
		}
		localStorage.fav_array = JSON.stringify(fav_array);
	});
	
	function favourites_display() {
		//$('.content').addClass('hidden');
    	$('.sub-navbar').addClass('hidden');
    	$('#content-list').removeClass('hidden');
		$('#content-list').empty();
		// DOESN'T SEEM TO BE DISPLAYING ON WEB VERSION?
		$('#content-list').html(
			"<ul>" +
			(function() {
				var gen_list = "";
				if (fav_array.length <= 0) {
					gen_list = "<p class='message'>Your favourites list is empty.</p>";
				};
				for (i=0; i < fav_array.length; i++) {
	    			var n_id = fav_array[i];
	    			var n_index = $.map(poets_array, function(obj, index) {
					    if(obj.id_number == n_id) {
					        return index;
					    }
					});
	    			gen_list = gen_list.concat(
						"<li class = 'favourites_item ui-btn' id='" + n_id + "'><a href='#read'>"
						+ "<p><strong>" + poets_array[n_index].first_name + " " + poets_array[n_index].last_name + "</strong></p>"
						+ "<br /><p><em> Featured poem: " + poets_array[n_index].poem_title + "</em></p>"
						+ "</a></li><hr />"
					);			
	    		};
	    		return gen_list;
			})()
			+ "</ul>"			
		);
	};
	
	$('#favourites_results_button').click( function() {
			favourites_display();	
		});
	
	
	//
	// SETTINGS DISPLAY CONTROL
	//
	
	var display_options = {
		"size-small" 	: {
							"font-size": "0.7em",
							"line-height": "1.2em"
						},
		"size-med" 		: {
							"font-size": "1em",
							"line-height": "1.5em"
						},
		"size-large" 	: {
							"font-size": "2em",
							"line-height": "2.5em"
						},
		"font-black" 	: "black",
		"font-white" 	: "white",
		"font-gray" 	: "gray",
		"bg-black" 		: "black",
		"bg-white" 		: "white",
		"bg-paper" 		: "#ffffe6",
		"line-wrapping"	: {
							"overflow-x": "initial",
							"white-space": "initial"
						},
		"line-nowrapping": {
							"overflow-x": "auto",
							"white-space": "nowrap"
						}
	};
	
	//function for applying saved custom display settings
	function apply_display_settings() {
		$('.size_option').removeClass('active ui-btn-active');
		$('#' + display_settings['font-size']).addClass('active ui-btn-active');
		$('#text-frame p, .display-tab#bio p, #book-link').css({
			"font-size": display_options[display_settings["font-size"]]["font-size"],
			"line-height": display_options[display_settings["font-size"]]["line-height"]
		});
		$('.text_colour_option').removeClass('active ui-btn-active');
		$('#' + display_settings['color']).addClass('active ui-btn-active');
		$('#text-frame p, .display-tab#bio p, #book-link').css({
			"color": display_options[display_settings["color"]]
		});
		$('.bg_colour_option').removeClass('active ui-btn-active');
		$('#' + display_settings['background-color']).addClass('active ui-btn-active');
		$('#text-frame, .display-tab#bio, #book-link').css({
			"background-color": display_options[display_settings["background-color"]]
		});
		$('.line_option').removeClass('active ui-btn-active');
		$('#' + display_settings['line-wrapping']).addClass('active ui-btn-active');
		$('#text-frame').css({
			'overflow-x': display_options[display_settings["line-wrapping"]]["overflow-x"]
		});
		$('#text-frame p').css({
			'white-space': display_options[display_settings["line-wrapping"]]["white-space"]
		});
	}
	
	// Getting saved settings, if any
	if (localStorage.display_settings != undefined) {
		display_settings = JSON.parse(localStorage.display_settings);
		apply_display_settings();
	} else {
		display_settings = {
			"font-size": 			$(".size_option.active").attr("id"),
			"line-height": 			$(".size_option.active").attr("id"),
			"color": 				$('.text_colour_option.active').attr("id"),
			"background-color": 	$('.bg_colour_option.active').attr("id"),
			"line-wrapping": 		$('.line_option.active').attr('id')
		};
	};
	
	function open_meta(option) {
		$(option).toggleClass('active ui-btn-active');
		if($(option).hasClass('active ui-btn-active')) {
			$('#display-meta>a').removeClass('active ui-btn-active');
			$(option).addClass('active ui-btn-active');
			$('#display-meta').addClass('panel_open');
			$('#display-meta>div.panel').addClass('hidden');
			if (option.is('#settings_button')) {
				$('#settings_panel').removeClass('hidden');
			}
			if (option.is('#share_button')) {
				$('#share_panel').removeClass('hidden');
			}
			if (option.is('#tag_button')) {
				$('#tag_panel').removeClass('hidden');
			}
		} else {
			$('#display-meta>div.panel').addClass('hidden');
			$('#display-meta').removeClass('panel_open');
		}
		
	};
	
	// Open/Close Settings panel
	$('#settings_button').click(function() {
		open_meta($(this));
	});
	
	$('.settings_option').click(function() {
		
		//Selecting active setting for each option
		if($(this).hasClass("size_option")) {
			$(".size_option").removeClass('active ui-btn-active');
			$(this).addClass('active ui-btn-active');
		};
		if($(this).hasClass("text_colour_option")) {
			$(".text_colour_option").removeClass('active ui-btn-active');
			$(this).addClass('active ui-btn-active');
		};
		if($(this).hasClass("bg_colour_option")) {
			$(".bg_colour_option").removeClass('active ui-btn-active');
			$(this).addClass('active ui-btn-active');
		};
		if($(this).hasClass("line_option")) {
			$(".line_option").removeClass('active ui-btn-active');
			$(this).addClass('active ui-btn-active');
		};
		
		//Linking each display option to the poem display
			//Text size
		if($("#size-small").hasClass("active")) {
			$('#text-frame p, .display-tab#bio p, #book-link').css({
				"font-size": display_options['size-small']['font-size'],
				"line-height": display_options['size-small']['line-height']
			});		
		};
		if($("#size-med").hasClass("active")) {
			$('#text-frame p, .display-tab#bio p, #book-link').css({
				"font-size": display_options['size-med']['font-size'],
				"line-height": display_options['size-med']['line-height']
			});
		};
		if($("#size-large").hasClass("active")) {
			$('#text-frame p, .display-tab#bio p, #book-link').css({
				"font-size": display_options['size-large']['font-size'],
				"line-height": display_options['size-large']['line-height']
			});
		};
		display_settings["font-size"] = $(".size_option.active").attr("id");
		display_settings["line-height"] = $(".size_option.active").attr("id");
			//Text colour
		if($("#font-black").hasClass("active")) {
			$('#text-frame p, .display-tab#bio p, #book-link').css({
				"color": display_options['font-black']
			});
		};
		if($("#font-white").hasClass("active")) {
			$('#text-frame p, .display-tab#bio p, #book-link').css({
				"color": display_options['font-white']
			});
		};
		if($("#font-gray").hasClass("active")) {
			$('#text-frame p, .display-tab#bio p, #book-link').css({
				"color": display_options['font-gray']
			});
		};
		display_settings["color"] = $('.text_colour_option.active').attr("id");
			//Background colour
		if($("#bg-black").hasClass("active")) {
			$('#text-frame, .display-tab#bio, #book-link').css({
				"background-color": display_options['bg-black']
			});
		};
		if($("#bg-white").hasClass("active")) {
			$('#text-frame, .display-tab#bio, #book-link').css({
				"background-color": display_options['bg-white']
			});
		};
		if($("#bg-paper").hasClass("active")) {
			$('#text-frame, .display-tab#bio, #book-link').css({
				"background-color": display_options['bg-paper']
			});
		};
		display_settings["background-color"] = $('.bg_colour_option.active').attr("id");
		//Line wrapping
		if($("#line-wrapping").hasClass("active")) {
			$("#text-frame").css({
				"overflow-x": display_options['line-wrapping']['overflow-x']
			});
			$("#text-frame p").css({
				"white-space": display_options['line-wrapping']['white-space']
			});
		};
		if($("#line-nowrapping").hasClass("active")) {
			$("#text-frame").css({
				"overflow-x": display_options['line-nowrapping']['overflow-x']
			});
			$("#text-frame p").css({
				"white-space": display_options['line-nowrapping']['white-space']
			});
		};
		display_settings["line-wrapping"] = $('.line_option.active').attr("id");
		
		//Committing display changes to localStorage
		localStorage.display_settings = JSON.stringify(display_settings);
		
		
	});
	
	
	//
	// SHARING
	//
	
	// Open/close sharing panel
	$('#share_button').click(function() {
		open_meta($(this));
	});
	
	//EMAIL
	
	// Populating content of sharing email - fires with display_item()
	function generate_email() {
		$('#share_email_button').attr('href', function(){
			var email_href = 
				"mailto:?subject=Poetry recommendation from the Bloodaxe Poetry App&body="
				+ "I think you'll love " + poets_array[selected_array_index].first_name + " " + poets_array[selected_array_index].last_name + ". "
				+ "Read and hear their work on the Bloodaxe Books website: " + poets_array[selected_array_index].author_link;
			return email_href;
		});
	};
	
	//TWITTER
	
	//Getting Twitter's embed widget
	window.twttr = (function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0],
	    t = window.twttr || {};
	  if (d.getElementById(id)) return t;
	  js = d.createElement(s);
	  js.id = id;
	  js.src = "https://platform.twitter.com/widgets.js";
	  fjs.parentNode.insertBefore(js, fjs);
	  t._e = [];
	  t.ready = function(f) {
	    t._e.push(f);
	  };
	  return t;
	}(document, "script", "twitter-wjs"));
	
	//Populating the Tweet content - fires with display_item()
	function generate_tweet() {
		$('#share_tweet_button').attr('href', function(){
			var tweet_href = 
				"https://twitter.com/intent/tweet?text="
				+ "I've been enjoying the work of " + poets_array[selected_array_index].first_name + " " + poets_array[selected_array_index].last_name
				+ " on the Bloodaxe Poetry App! "
				+ poets_array[selected_array_index].author_link;
			return tweet_href;
		});
	};
	
	//FACEBOOK
	
	//Loading FB SDK
	//CURRENTLY IN SNIPPET.JS
	  
	//Facebook post generator - fires with display_item()
	/*
	ADD FACEBOOK POST FUNCTION HERE <<<<<<<<<<<<<<<<<<<
	*/
	
	$('#share_facebook_button').click(function() {
		/* WORKING EXAMPLE
		FB.ui({
		  method: 'share_open_graph',
		  action_type: 'og.likes',
		  action_properties: JSON.stringify({
		    object:'https://developers.facebook.com/docs/',
		  })
		}, function(response){
		  // Debug response (optional)
		  console.log(response);
		});
		*/
		
		FB.ui({
		  method: 'share_open_graph',
		  action_type: 'og.likes',
		  action_properties: JSON.stringify({
		    object: poets_array[selected_array_index].author_link,
		  })
		}, function(response){
		  // Debug response (optional)
		  console.log(response);
		});
		
	});
	 
	   
	
});


//
// DEBUG
//

$('div.debug p').click(function() {
	$('span.debug').toggleClass('hidden');
});

$('#clear_fav').click(function() {
	fav_array = []; 
	delete localStorage.fav_array;
	console.log("Favourites cleared: " + localStorage.fav_array);
});

$('#clear_display').click(function() {
	display_settings = {};
	delete localStorage.display_settings;
	console.log("Display settings cleared: " + localStorage.display_settings);
});

$('#clear_themes').click(function() {
	my_themes = [];
	delete localStorage.my_themes;
	console.log("Added themes cleared: " + localStorage.my_themes);
});

$('#show_localstorage').click(function() {
	console.log("Favourites UI array (fav_array): " + fav_array);
	console.log("Favourites stored array (localStorage.fav_array): " + localStorage.fav_array);
	console.log("Display settings UI array (display_settings): " + display_settings);
	console.log("Display settings stored array (localStorage.display_settings): " + localStorage.display_settings);
	console.log("My themes UI array (my_themes): " + my_themes);
	console.log("My themes stored array (localStorage.my_themes): " + localStorage.my_themes);
});

/* ATTEMPT TO FIX NAVBAR POSITION - see styles.css
$(".main-content").css({'margin-top' : (2 * ($("#navbar").height())),});
*/