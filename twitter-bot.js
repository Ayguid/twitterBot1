var request = require('request');
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

var baseUrl = '';

var credentials = {
  form: {
    email: '',
    password: ''
  }
};

/**
* Sends a tweet notifying of the new course.
*
* @param course: the new course object.
*/
function sendTweet(course) {

  //(gb): use course data to build a more helpful message
  var status = 'Nuevo curso publicado en eadBox';

  client.post('statuses/update', {status: status}, function(error, tweet, response) {
    if (!error) {
      console.log(tweet);
    }

  });
}




/**
* Checks for courses indefinitely.
*

*/
function checkCourses(authKey, authToken, coursesQty) {
  console.log('Requesting /api/courses...');
  request.get(baseUrl + '/courses?' + authKey + '=' + authToken, function (err, httpResponse, bodyString) {

    // handle error
    var courses = JSON.parse(bodyString);

    // Check if a new course was added
    //
    if (coursesQty != null && courses.length > coursesQty) {

      //
      var newCourse = courses[courses.length-1];
      
      // Send a tweet notifying of the course.
      sendTweet(newCourse);
    } else {
      console.log('Nothing new under the sun.');
    }

    coursesQty = courses.length;

    setTimeout(checkCourses, 5000, authKey, authToken, coursesQty);
  })
}



console.log('Login in...');


function eadboxLogin(cb) {
  request.post(baseUrl + '/login', credentials, function (err, httpResponse, bodyString) {
    var body = JSON.parse(bodyString);
    var authKey = body.token_authentication_key;
    var authToken = body.authentication_token;
    console.log('Logged in!');


    cb(err, authKey, authToken);
  });
}



eadboxLogin(function (err, authKey, authToken) {
  var coursesQty = null;
  checkCourses(authKey, authToken, coursesQty);
});
