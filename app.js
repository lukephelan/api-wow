var express = require('express'); // Required to use express
var neo4j = require('node-neo4j'); // Required to communicate with the Neo4j db
var cors = require('cors'); // Required for cross-origin requests
var app = express();

app.use(cors()); // Using cors to allow cross-origin requests

// Create a db object connected to the Neo4j database
db = new neo4j(process.env['GRAPHENEDB_URL'] || 'http://localhost:8080/json');

// Create an object to store the database results
var object = {};

app.get('/json', function (req, res){

    // Retrieve all nodes from the database
    db.cypherQuery("START N=NODE(*) RETURN {name: N.name, group: N.group, img: N.img, profile: N.profile}", function(err, result){
        if(err) throw err;
        object.nodes = result.data;

        // Retrieve all relationships from the database
        db.cypherQuery("START n=node(*) MATCH (n)-[r]->(m) RETURN {source: id(n), target: id(m), value: r.value, name: r.name}", function(err, result){
            if(err) throw err;
            object.links = result.data;
            // Send the object as a response
            res.send(object);
        });
    });
});

// Set the API port to 8080
app.listen(process.env.PORT || 8080, function(){
  console.log('Winter is coming!');
});
