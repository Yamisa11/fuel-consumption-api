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
app.get("/api/vehicle", async (req, res) => {
    let message= req.flash("message")
  res.render("newCar",{
    message: message
  });
});
app.get("/api/refuel", async (req, res) => {
  res.render("refuel");
});
app.post('/api/vehicle', async (req, res) => {
    let description = req.body.description
    let reg_number = req.body.registration
    let distance = req.body.distance
    let amount = req.body.amount

    let theNewCar = {
        description : description,
        regNumber : reg_number,
        distance : distance,
        amount : amount
    }

    let results = await fuelConsumptionFunction.addVehicle(description,reg_number)
    req.flash("message", results.message)
    console.log(results);
    console.log(reg_number);

    res.redirect("/api/vehicle")
});
// app.post('/api/refuel', fuelConsumptionAPI.refuel);

app.listen(PORT, () => console.log(`App started on port: ${PORT}`));
