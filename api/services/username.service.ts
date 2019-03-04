import { queryContainer } from '../services/cosmosDb.service';

const containerId = "Users";

const colors = ["Red", "Pink", "Orange", "Yellow", "Purple", "Green", "Blue", "Brown", "White", "Black"];
const animals = [ "Bear", "Bird", "Cat", "Dog", "Dolphin", "Eagle", "Falcon", "Fish", "Fox", "Frog", 
                  "Hawk", "Horse", "Lion", "Owl", "Panda", "Panther", "Rabbit", "Raven", "Shark", 
                  "Spider", "Tiger", "Turtle", "Viper", "Wasp", "Wolf" ];

export async function getNewUsername() {

    var newUsername = generateNewUsername();

    return queryUsername(newUsername).then( (results) => {
        if(results.length === 0) {
            return newUsername;
        }
        else {
            return getNewUsername();
        }
    })
}

function generateNewUsername(): string {
    
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    var randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    var randomNumber = Math.round(1+(Math.random()*(999-1)));

    var randomNumberStr = randomNumber.toString();

    if(randomNumberStr.length === 1) {
        randomNumberStr = "00" + randomNumberStr;
    }
    else if(randomNumberStr.length === 2) {
        randomNumberStr = "0" + randomNumberStr;
    }


    var randomUsername = randomColor + randomAnimal + randomNumberStr;

    return randomUsername;
};

async function queryUsername(username: string) {
    const querySpec = {
        query: "SELECT * FROM root r WHERE r.userName=@userName",
        parameters: [
            {name: "@userName", value: username}
        ]
    };
    return queryContainer(containerId, querySpec);
}