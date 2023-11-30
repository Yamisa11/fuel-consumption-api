import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import flash from "express-flash";
import FuelConsumption from "./fuel-consumption.js";
import db from "./db.js";

const fuelConsumptionFunction = FuelConsumption(db);

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "Yams",
  })
);
app.use(flash());
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/vehicles", async (req, res) => {
  let results = await fuelConsumptionFunction.vehicles();
  res.render("index", {
    results: results,
  });
});
app.get("/api/NewVehicle", async (req, res) => {
    let message= req.flash("message")
    let success= req.flash("success")
  res.render("newCar",{
    message: message,
    success:success
  });
});
app.get("/api/refuel", async (req, res) => {
  res.render("refuel");
});
app.get("/api/vehicle/:id", async (req, res) => {
    let theId = req.params.id
    let theVehicle = await fuelConsumptionFunction.vehicle(theId)
    res.render("refuel", {
        theVehicle:theVehicle
    });
  });
app.post('/api/vehicle', async (req, res) => {
    let description = req.body.description
    let reg_number = req.body.registration
    let distance = req.body.distance
    let amount = req.body.amount

    // let theNewCar = {
    //     description : description,
    //     regNumber : reg_number,
    //     distance : distance,
    //     amount : amount
    // }

    let results = await fuelConsumptionFunction.addVehicle(description,reg_number)
    req.flash("message", results.message)
    req.flash("success", results.status)
   

    res.redirect("/api/vehicle")
});
app.post('/api/refuel/:id', async (req, res) => {
    let vehicleId = req.params.id
    let theDistance = req.body.theDistance
    let theAmount = req.body.theAmount
    let theLiters = req.body.theLiters
    let filledUp = req.body.filledUp
    let filledUpRes 

    if (filledUp == "notFilled") {
        filledUpRes = false
    } else {
        filledUpRes = true
    }
   
  let theRes =   await fuelConsumptionFunction.refuel(vehicleId,theLiters,theAmount,theDistance,filledUpRes)
  console.log(theRes);
   
});

app.listen(PORT, () => console.log(`App started on port: ${PORT}`));
