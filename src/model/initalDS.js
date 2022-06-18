import {v4 as uuidv4} from 'uuid';

const initalData = {
    [uuidv4()]: {
        name: "To-do",
        items: []
    },
    [uuidv4()]: {
        name: "In Progress",
        items: []
    },
    [uuidv4()]: {
        name: "Done",
        items: []
    }
}

export default initalData