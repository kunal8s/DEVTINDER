AuthRouter
- POST /signup
- POST /Login
- POST /Logout

ProfileRouter
- GET /profile
- PATCH /profile # for the updation 
- PATCH /profile/password

ConnectionRequestRouter
Status - ignore , interested , rejected, accepted 

- POST /request/send/interested/:userid
- POST /request/send/ignore/:userid


- POST /request/review/accepted/:requestid
- POST /request/review/rejected/:requestid

UserRouter
- GET /user/connections
- GET /user/requests/recieved
- GET /user/feed - gets the profile of other user on the platform keep change on every swipe 

