# MovieFlex - Backend side

## Website link

http://movieflexfront.herokuapp.com/

## Description

This API serves more than 25,000 movies stored in a database with comments and more.

## Languages / Frameworks / Techniques

- JavaScript
- Node.JS
- ExpressJS
- OOP
- MC
- Data Validation
- Authentication and Authorization
- Sending Emails
- Logging System [Morgan / Winston Logger]

## Routes

- Auth

  - auth/login - POST
  - auth/signup - POST > add a new user and send verification email.
  - auth/verify - GET > handle requests by links sent with emails.

- Movies
  - /movies/browse/:page - GET > serves 20 movies per page.
  - /movie/:id - GET > get a certain movie by id.
  - /movies/top-rated - GET > get top 50 movies.
  - /movies/popular - GET > get most popular 50 movies.
  - /movies/related - GET > get 6 related movies according to genres.
  - /movies/search/:search - GET > search for movies which matches input sent by the user.
- Comments

  - /getComments/:movieId - GET > get a certain comment by id.
  - /createComment/:movieId - POST > create a new comment and link it with its movie.
  - /editComment/:commentId - PUT > edit an existing comment.
  - /deleteComment/:commentId - DELETE > delete a comment.

- Watchlist
  - /watchlist/ - GET > get watchlist related to the authorized user.
  - /watchlist/:movieId - POST > add a movie to user the authorized user watchlist.
  - /watchlist/:movieId - DELETE > remove a movie from watchlist.
