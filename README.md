# ASSIGNMENT

##

---- ---------HOW TO START THE SERVER -------------

- first of all run the command ( cd src )
- then run the command ( node cluster.js)

---------------- HOW TO TEST THE API CALLS RATE LIMIT -----------------------------

- There is index.html file in src folder which is configured to request the userId
- fill the form with user id ( ex : 111 )
- Then hit the send buttong

----------------- RESULTS -------------------------------------------------------

- the server with response with message " Task queued for processing"

* if there is rate limit exceed server response with message "Rate limit exceeded. Task queued with delay of delaytime ms"

  NOTE -- All the request after rate limit exceeded will be resolve after the delay time
