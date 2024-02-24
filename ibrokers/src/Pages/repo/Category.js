import axios from "axios";

var mainGroup = []
var group = []
var subGroup = []

export function getGroup(){
    if (group.length == 0){
         axios.get(`https://api.ibrokers.ir/bourse/group/group/`)
        .then((response) => {
            group = response.data
        })
        .catch((error) => {
            console.log(error);
        });
    }
    return group;
}

export function getMainGroup(){
    if (mainGroup.length ==0){
        axios.get(`https://api.ibrokers.ir/bourse/group/main-group/`)
        .then((response) => {
            group = response.data
        })
        .catch((error) => {
            console.log(error);
        });
    }
    return mainGroup;
}

export function getSubGroup(){
    if (subGroup.length ==0){
        
        axios.get(`https://api.ibrokers.ir/bourse/group/sub-group/`)
        .then((response) => {
            group = response.data
        })
        .catch((error) => {
            console.log(error);
        });
    }
    return subGroup;
}
