# ameritrade-bot
Ameritrade bot that aggregates top mover data and automatically publishes top gainer and top loser articles

# How to use
First, you'll need to obtain an API key from Ameritrade here: https://developer.tdameritrade.com/content/getting-started

Next, create a .env file in the root of the project with the following content: 
```
API_KEY=YOUR_API_KEY
```
*Be sure to replace YOUR_API_KEY with your actual Ameritrade API key.*

Then, run `npm i` in the root of the project *as well as* the /frontend directory

Finally, run either `nodemon server` or `node server` in the root directory to start the server. 

By default, the bot will run every 20 minutes and will save all articles to articles.json. 

To start the frontend and view articles the bot has created, enter the `/frontend` directory and run `npm start`.

![image](https://user-images.githubusercontent.com/6768725/190285802-a33d9a13-9af0-47b4-8168-36d411de6791.png)
