//======PSEUDOCODE======
// ==WHAT THE USER WILL SEE
// Upon load, the page will be populated with a list of buttons, a blank main area, and a side panel with a submission form.
// When the user presses on a button, a gallery of relevant still gifs load, with info on the rating of each gif.
// The user can click on a gif to animate, and click again to freeze.
// Pressing another button reloads the gallery with gifs relevant to the new topic.
// Putting a term in the search bar will load another button into the list. It will behave like the other buttons.

//==ORDERED FOR CODING THIS PROCESS
// STYLING NEEDED, FUNCTIONALITY DONE -- Upon load, the page will be populated with a list of buttons, a blank main area, and a side panel with a submission form.
// DONE -- Putting a term in the search bar will load another button into the list. It will behave like the other buttons.
// DONE When the user presses on a button, a gallery of relevant still gifs load, with info on the rating of each gif.
// DONE Pressing another button reloads the gallery with gifs relevant to the new topic.
// DONE The user can click on a gif to animate, and click again to freeze.


//ACTUAL CODING//

//UNIVERSAL VARIABLES//

//putting all artists (and other search terms) into an array
var artists = ['Jenny Holzer', 'Andy Warhol', 'Barbara Kruger', 'Yayoi Kusama'];

$(document).ready(function () {

function makeButtons () {
	//clears the div to avoid repeat buttons
	$('.artist-buttons').empty();
	//loops through artist array, creates a new button
	//assigns an artist class and data attribute
	//puts the artist name value into the button label
	//adds the button to the containing div
	for (var i = 0; i < artists.length; i++) {
		var b = $('<button>');
		b.addClass('artist');
		b.attr('data-name', artists[i]);
		b.text(artists[i]);
		$('.artist-buttons').append(b);
	};
//end makeButtons
};

function addButtons() {
	//When a new artist is typed in and submitted, the value is added to a variable
	//the variable is added to the artists array
	//makeButtons is rendered again with the new addition.
	var newArtist = $('#artist-input').val().trim();
	artists.push(newArtist);
	makeButtons();
//end addButtons
};

function imageRetrieve() {
 	var thisArtist = $(this).attr('data-name');
 	// console.log (thisArtist);
 	//setting up the query URL
      var queryURL = "http://api.giphy.com/v1/gifs/search?q=" +
        thisArtist + "&api_key=dc6zaTOxFJmzC&limit=10";
     //running the ajax query
      $.ajax(
      {
        url: queryURL,
        method: "GET"
      }).done(function(response) {

      	// console.log(response);
      	//creating a variable for the retrieved data
      	var results = response.data;

        console.log(queryURL);

//clears the artist view so we just see the results from the most recent query2
      	$('.artist-view').empty();
//for loop that populates artist-view with the results of the query
      	for (var i = 0; i < results.length; i++) {

      	 	var gifDiv = $('<div></div>');
      	 	gifDiv.addClass('gif-div');
         //creating the html element for the rating
      	 	var printRating = $('<p></p>');
      	 	printRating.text('Rating: ' + results[i].rating);

          //creating the html for the image
      	 	var gifImage = $('<img>');
          //adds attributes for the image, the data state, and the point in the array. the array position is collected as reference for the still/animate gif array later.
      	 	gifImage.attr('src', results[i].images.fixed_height_still.url)
          .attr('data-state', 'still')
          .attr('data-still', results[i].images.fixed_height_still.url)
          .attr('data-animate', results[i].images.fixed_height.url)
          ;

          //adding the rating and image to the gif div
      	 	gifDiv.append(printRating).append(gifImage);
          //adding the gif div to the div holding all the images
      	 	$('.artist-view').append(gifDiv);

      	 } 

      });
};

//playGifs will make the function where clicking a gif will animate if still
// or still if animated.
function playGifs () {

    var state = $(this).attr('data-state')

      if (state == 'still') {

        $(this).attr('src', $(this).attr('data-animate'));
        $(this).attr('data-state', 'animate');
      } else {
        //another way to do it
        $(this).attr('src', $(this).attr('data-still'));
        $(this).attr('data-state', 'still');
      };

  };



//===== VIEWABLE TO USER =====//

makeButtons();

$('#add-artist').on('click', function(event) {
	event.preventDefault();
	addButtons();
//NTS if time, figure out how to clear the input after submission.
});

//runs the function to run the giphy query and retrieve images when a button is clicked
$('.artist-buttons').on('click', '.artist', imageRetrieve);
//runs the funtion to play or pause gifs when an image is clicked.
$('.artist-view').on('click', 'img', playGifs);

//end document ready
});