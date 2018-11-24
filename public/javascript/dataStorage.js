/* eslint-disable */

const DEFAULT_USER_CONST_NAME = 'defaultUser';
const USER_DATA_KEY = 'user';


class DS{

    constructor(){}

    static saveUser(user){
        let data = JSON.stringify(user);
        localStorage.setItem(USER_DATA_KEY, data);
    }

    static getUser(){
        let data = localStorage.getItem(USER_DATA_KEY);
        data = JSON.parse(data);

        return data;
    }

        // save data in local storage and send it to server
    static saveData(user, data){
        let dataset = {
            data
        };

        let jsonDataset = JSON.stringify(dataset);

        let key = DEFAULT_USER_CONST_NAME;
        if(user && user.name){
            key = user.name;
        }

        localStorage.setItem(key, jsonDataset);


        // and send request to server

    }

    static getData(user, cb){

        let key = DEFAULT_USER_CONST_NAME;
        if(user && user.name){
            key = user.name;
        }

        let data = localStorage.getItem(key);
        data = JSON.parse(data);


        cb(data);

        // request to server

    }

    static removeData(user){
        let key = DEFAULT_USER_CONST_NAME;
        if(user && user.name){
            key = user.name;
        }

        localStorage.removeItem(key);
    }

    static clearStorage(){
        localStorage.clear();
    }
}