import mongoose from "mongoose";
import dotenv from "dotenv";
import Station from "../models/Station.js";

dotenv.config();


const stations = [

  {
    name: "TotalEnergies Acacia Mall EV Station",
    address: "Acacia Avenue, Kampala",
    country: "Uganda",
    city: "Kampala",

    latitude: 0.3476,
    longitude: 32.5906,

    chargerType: "DC Fast Charging",
    chargingSpeed: 120,
    price: 20000,

    totalChargers: 4,
    availableChargers: 3,

    queueTime: 10,
    status: "active",

    rating: 4.8,

    operator: "TotalEnergies Uganda",
    solarPowered: false,

    phoneNumber: "+256700000001"
  },


  {
    name: "Village Mall Bugolobi Charging Hub",
    address: "Village Mall, Bugolobi, Kampala",
    country: "Uganda",
    city: "Kampala",

    latitude: 0.3195,
    longitude: 32.6135,

    chargerType: "Level 2",
    chargingSpeed: 50,
    price: 25000,

    totalChargers: 3,
    availableChargers: 2,

    queueTime: 5,
    status: "active",

    rating: 4.5,

    operator: "ChargeFlow Uganda",
    solarPowered: true,

    phoneNumber:"+256700000002"
  },
  {
    name: "Kyanja Road Solar Charging Station",
    address: "Kisasi Road, Kikaya",
    country:"Uganda",
    city:"Kampala",

    latitude:0.3949,
    longitude:32.5999,

    chargerType:"DC Slow Charging",
    chargingSpeed:100,

    price:14000,

    totalChargers:5,
    availableChargers:4,

    queueTime:8,

    status:"active",

    rating:4.7,

    operator:"ChargeFlow Uganda",

    solarPowered:true,

    phoneNumber:"+256700000003"
  },
  {
    name:"Makerere City EV Charging Point",
    address:"Main Street, Kampala",

    country:"Uganda",
    city:"Kampala",

    
latitude:0.3325,longitude:32.5701,

    chargerType:"Level 2",

    chargingSpeed:60,

    price:15000,


    totalChargers:2,

    availableChargers:2,


    queueTime:0,

    status:"active",

    rating:4.3,

    operator:"Kampala EV Network",

    solarPowered:true,

    phoneNumber:"+256700000004"
  },

  {
    name: "Kyanja Road Solar Charging Station",
    address: "Kisasi Road, Kikaya",
    country:"Uganda",
    city:"Kampala",

    latitude:0.3949,
    longitude:32.5999,

    chargerType:"DC Slow Charging",
    chargingSpeed:100,

    price:14000,

    totalChargers:5,
    availableChargers:4,

    queueTime:8,

    status:"active",

    rating:4.7,

    operator:"ChargeFlow Uganda",

    solarPowered:true,

    phoneNumber:"+256700000003"
  },
  {
    name:"Muyenga City EV Charging Point",
    address:"Main Street, Kampala",

    country:"Uganda",
    city:"Kampala",

    
latitude:0.3325,longitude:32.5701,

    chargerType:"Level 1",

    chargingSpeed:60,

    price:16000,


    totalChargers:2,

    availableChargers:2,


    queueTime:0,

    status:"active",

    rating:4.3,

    operator:"Muyenga EV Network",

    solarPowered:true,

    phoneNumber:"+256700000004"
  },
  

  {
    name:"  Nsambya City EV Charging Point",
    address:"Main Street, Kampala",

    country:"Uganda",
    city:"Kampala",

    latitude:0.3011,longitude:32.5878,


    chargerType:"Level 1",

    chargingSpeed:60,

    price:16000,


    totalChargers:2,

    availableChargers:2,


    queueTime:0,

    status:"active",

    rating:4.3,

    operator:"Nsambya EV Network",

    solarPowered:true,

    phoneNumber:"+256700000004"
  },

  {
    name:"  Bukoto City EV Charging Point",
    address:"Main Street, Kampala",

    country:"Uganda",
    city:"Kampala",

    latitude:0.3541,longitude:32.5833,


    chargerType:"Level 1",

    chargingSpeed:60,

    price:16000,


    totalChargers:2,

    availableChargers:2,


    queueTime:0,

    status:"active",

    rating:4.3,

    operator:"Bukoto EV Network",

    solarPowered:true,

    phoneNumber:"+256700000004"
  },


  {
    name: "Kyanja Road Solar Charging Station",
    address: "Kisasi Road, Kikaya",
    country:"Uganda",
    city:"Kampala",

    latitude:0.3949,
    longitude:32.5999,

    chargerType:"DC Slow Charging",
    chargingSpeed:100,

    price:14000,

    totalChargers:5,
    availableChargers:4,

    queueTime:8,

    status:"active",

    rating:4.7,

    operator:"ChargeFlow Uganda",

    solarPowered:true,

    phoneNumber:"+256700000003"
  },
  {
    name:"Jinja City EV Charging Point",
    address:"Main Street, Jinja",

    country:"Uganda",
    city:"Jinja",

    latitude:0.4479,
    longitude:33.2026,


    chargerType:"Level 2",

    chargingSpeed:60,

    price:15000,


    totalChargers:2,

    availableChargers:2,


    queueTime:0,

    status:"active",

    rating:4.3,

    operator:"Jinja EV Network",

    solarPowered:true,

    phoneNumber:"+256700000004"
  },




  {
    name:"Jinja City EV Charging Point",
    address:"Main Street, Jinja",

    country:"Uganda",
    city:"Jinja",

    latitude:0.4479,
    longitude:33.2026,


    chargerType:"Level 2",

    chargingSpeed:60,

    price:15000,


    totalChargers:2,

    availableChargers:2,


    queueTime:0,

    status:"active",

    rating:4.3,

    operator:"Jinja EV Network",

    solarPowered:true,

    phoneNumber:"+256700000004"
  },



  {
    name:"Mbarara EV Mobility Station",

    address:"High Street, Mbarara",

    country:"Uganda",
    city:"Mbarara",


    latitude:-0.6072,
    longitude:30.6545,


    chargerType:"DC Fast Charging",

    chargingSpeed:90,


    price:14500,


    totalChargers:3,

    availableChargers:1,


    queueTime:20,


    status:"active",


    rating:4.2,


    operator:"Western Uganda EV",

    solarPowered:false,


    phoneNumber:"+256700000005"
  }



];



const seedStations = async()=>{

try{


await mongoose.connect(
process.env.MONGO_URI
);


console.log("MongoDB connected");


// remove old stations
await Station.deleteMany();


await Station.insertMany(stations);


console.log(
"🇺🇬 Uganda charging stations added successfully"
);


process.exit();


}
catch(error){

console.error(error);

process.exit(1);

}

};



seedStations();