const express  = require("express");
const hash = require("object-hash");
const app = express();
const mongoose = require("mongoose");
const objectHash = require("object-hash");


//connection with database
mongoose.connect("mongodb+srv://admin-harshit:test123@cluster0.5v6tyuh.mongodb.net/blockchain");


// schema defined 
const blockSchema = mongoose.Schema({
    innerBlock : Object,
    currentHash : String
})

//collection created
const blocks = new mongoose.model("block",blockSchema);


//
const blockChain = [];




//function to create a new block or new entry
function block(previousBlock,transaction){
    const block = {
         innerBlock :
            {previousBlock : previousBlock,
            transaction : transaction},
         currentHash : null
        }
        block.currentHash = hash(block.innerBlock);
        return block;
    }
    
   
    



//first block of the chain in array
const genisisBlock = {
    innerBlock : {
        previousBlock : 0,
        transaction : null
    },
    currentHash : null
}
genisisBlock.currentHash = hash(genisisBlock.innerBlock);
blockChain.push(genisisBlock);

//first block of chain for db
const GenisisBlock = new blocks({
    innerBlock: null,
    currentHash: null
});
// GenisisBlock.save();

app.get("/",function(req,res){
    res.send("hello world");
});

//
app.post("/",function(req,res){
    
    const transaction = req.query.transaction;
    console.log(transaction);



    blocks.findOne({}, {}, { sort: { '_id': -1 } }).then(function(err, lastBlock) {
        if (err) {
            console.error("Error retrieving last block:", err);
            return;
        }
        console.log("Last inserted block:", lastBlock);
        // Here, you can work with the lastBlock document
    });



    const newBlock = block(blockChain[blockChain.length-1],transaction);
    blockChain.push(newBlock);
    const newEntry = new blocks({
        innerBlock:  newBlock.innerBlock,
        currentHash : newBlock.currentHash
    });
    newEntry.save().then(function(){
        res.send("voted sccessfully");
    });
});
app.listen(3000,function(){
    console.log("server on at 3000");
});

console.log(blockChain);