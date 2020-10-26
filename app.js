const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

var items = ["Food list"] ;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); // gia na sundesw ton public folder

// Database adding

mongoose.connect("mongodb+srv://admin-tom:*****@cluster0.cznsp.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to my ToDo list Application"
});
const item2 = new Item({
  name: "Click the '+' button to add a new item"
});
const item3 = new Item({
  name: "<--- click here to delete an item"
});
const defaultItems = [item1,item2,item3];


app.get("/", function(req, res) {

  var today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  var day = today.toLocaleDateString("en-US", options);

  Item.find({}, function(err, foundItems){
    console.log(foundItems);
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB");
        }
      });
      res.redirect("/");
    }else {
      res.render("list", {kindOfDay: day, newListItems: foundItems});
    }
    });

 
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err) {
      console.log("Successfully");
      res.redirect("/");
    }

  });
});

// Heroku port

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started Successfully");
});

