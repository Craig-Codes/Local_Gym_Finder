# Local Exercise Finder App

JavaScript Web App utilizing the Bing Maps API

I created this web app to practice basic HTML / CSS skills (I use Adobe Animate for UI at work so it's good to use something different in personnel practice projects!). I also wanted to try out interacting with an API I haven't had the opportunity to use before. The idea is for the project to look hand drawn on a whiteboard, inspired by my own gym setup. The map is then displayed as pinned onto the board. I chose this project to learn and practice new skills, whilst combining my hobbies of coding and exercise.

I used the Bing Maps API as Google now require credit card information to use their map API. Unfortunately the Navteq Point of Interest flags will not be supported after 2020, so this app, whilst only for practice, may well become out dated and give false information as soon as next year. UPDATE - Navteq data has been replaced with Microsofts data, this app remains relevant and upto date (April 2020)

The aim of the app was to create an easy way for someone to locate their nearest gym or exercise facility. They should be able to toggle the distance to search via buttons and click on the found gyms for more details. I've limited the max search radius to 10 miles as Bing maps will only render a maximum of 250 location pins onto the map at once. I did consider using a JavaScript slider to control the distance, but buttons look more in keeping with the whiteboard effect I was going for.
