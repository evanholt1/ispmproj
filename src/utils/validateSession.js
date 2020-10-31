/*
    Exports a function which checks the existence, then the validity of a session,
    based on a sessionDuration variable. this flow mimics the JWT access/refresh
    token flow, but with server-side sessions, allowing users to stay logged in,

    USED ON PROTECTED ROUTES
*/

const { Response } = require('./response')

exports.validateSession = async (req, res, next) => {
    // if user doesnt have a populated session. _id is just a common field to put in the session
    if(!req.session._id) 
        return res.status(401).json(new Response("User Is Not Logged In!", null, true))

    let { id, cookie, loginDate, ...info } = req.session;
                

    let timeDifference = Date.now() - loginDate;

    // if more time has passed than the sessionCookieDuration
    if(timeDifference > info.sessionDuration) {
        res.clearCookie("US"); 

        await regeneratePromise(req); // makes a new empty session server-side

        Object.assign(req.session, info); // adds previous session data

        req.session.loginDate = Date.now(); // adds a new loginDate (now)

        // updates the long maxAge(refresh token) as to remain the same as the old session
        req.session.cookie.maxAge = (1000 * 60 * 60 * 24) - timeDifference;

        req.session.sessionDuration = 1000;
        
        // ensures the server-side session is stored in the DB
        await saveSessionPromise(req);

        // updates the id of the client-side cookie. takes the settings from somewhere else lol (index.js)
        res.cookie(
            'US', 
            req.session.id
        );

        next();
    }
    next();
}