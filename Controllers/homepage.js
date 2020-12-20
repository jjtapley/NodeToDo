const dbConnector = require('../DbConnector');

module.exports.getTodos = async (request, response) => {
    const db = await dbConnector();
    if (request.query.completed == '1') {
        const results = await db.collection('toDoItems').find({completed: "1"}).toArray();
        response.send(results);
    } else {
        const results = await db.collection('toDoItems').find({completed: {$exists: false}}).toArray();
        response.send(results);
    }
}

module.exports.createNewItem = async (request, response) => {
    //Will add a todo to the DB
    //Will parse the json from the front end that the user passed in
    const db = await dbConnector();
    const results = await db.collection('toDoItems').insertOne({name: request.body.name, date: request.body.date, category: request.body.category});
    const results2 = await db.collection('toDoItems').find({completed: {$exists: false}}).toArray();
    response.send(results2);
}

module.exports.deleteItem = async (request, response) => {
    //Will delete an item from the DB req.params.id
    const db = await dbConnector();
    const results = await db.collection('toDoItems').deleteOne({name: request.params.name});
    response.send(results);
}

module.exports.updateItem = async (request, response) => {
    const db = await dbConnector();
    const item = await db.collection('toDoItems').find({name: request.params.name}).toArray();
    if (item[0].completed === '1') {
        const results = await db.collection('toDoItems').updateOne({name: request.params.name}, {$unset: {completed: "1"}});
        response.send(results);
    } else {
        const results = await db.collection('toDoItems').updateOne({name: request.params.name}, {$set: {completed: "1"}});
        response.send(results);
    }
}

