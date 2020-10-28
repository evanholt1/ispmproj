ISPM Project 
=
---
Root: www.ispmproj.herokuapp.com
-
---
## Routes:
* ## User
    * #### POST /signup
            Input: email, password, passwordConfirmation, name (optional)
            Result: signs a user up, creating a new user account 
    * #### POST /signin
            Input: email, password
            Result: signs a user in, creating a session on the server and 
                    cookie on the browser
    * #### POST /signout
             Input: none
             Result: signs a user out, clearing the session and session cookie 