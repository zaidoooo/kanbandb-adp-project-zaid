import initalData from '../model/initalDS'

export function organizeKanban(data) {
    const a = data.sort((a,b) => a.status.localeCompare(b.status)).reverse().reduce((r, a) => {
        r[a.status] = r[a.status] || [];
        r[a.status].push(a)
        return r
    }, {})
    const newInital = {...initalData}
    for (const key in newInital) {
        if (Object.hasOwnProperty.call(newInital, key)) {
           if(newInital[key].name === 'To-do'){
            newInital[key].items = a['TODO']
           } else if(newInital[key].name === 'In Progress'){
            newInital[key].items = a['IN_PROGRESS']
           } else {
            newInital[key].items = a['DONE']
           }
        }
    }
    return newInital
}