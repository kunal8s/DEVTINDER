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

- POST /request/send/:status/:userid
- POST /request/review/:status/:userid


- POST /request/review/accepted/:requestid
- POST /request/review/rejected/:requestid

UserRouter
- GET /user/connections/accepted 
- GET /user/requests/recieved
- GET /user/feed - gets the profile of other user on the platform keep change on every swipe 

