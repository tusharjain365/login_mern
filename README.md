# login_mern

A card profile mern project which displays the profile card of user after sign in.
User can reset password with OTP sent to email id registered using nodemailer and for css part tailwind css is used.

To run it locally

## make config.js file in server folder and have following code

module.exports={

    JWT_SECRET:Your secret,
    
    EMAIL:after signing with ethereal account you get your email id,
    
    PASSWORD:ethereal account password,
    
    MONGO:after setting up mongoDB atlas, you get the database link
}

## make .env file in client folder and have following code

REACT_APP_SERVER_DOMAIN='http://localhost:8080'

Run `npm start` in both client and server folder to run the whole project.

