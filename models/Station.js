import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({

  name:{
    type:String,
    required:[true,"Station name is required"],
    trim:true
  },


  address:{
    type:String,
    required:[true,"Address is required"],
    trim:true
  },


  // Uganda information
  country:{
    type:String,
    default:"Uganda"
  },


  city:{
    type:String,
    enum:[
      "Kampala",
      "Entebbe",
      "Jinja",
      "Mbarara",
      "Gulu",
      "Mbale",
      "Other"
    ],
    default:"Kampala"
  },



  latitude:{
    type:Number,
    required:true,
    min:-90,
    max:90
  },


  longitude:{
    type:Number,
    required:true,
    min:-180,
    max:180
  },



  chargerType:{
    type:String,
    enum:[
      "Level 1",
      "Level 2",
      "DC Fast Charging",
      "Tesla Supercharger"
    ],
    default:"Level 2"
  },



  chargingSpeed:{
    type:Number,
    required:true,
    description:"Charging speed in kW"
  },



  // UGX price per kWh
  price:{
    type:Number,
    required:true,
    description:"Charging price in UGX per kWh"
  },



  totalChargers:{
    type:Number,
    required:true,
    min:1
  },


  availableChargers:{
    type:Number,
    required:true,
    min:0,

    validate:{
      validator:function(value){

        return value <= this.totalChargers;

      },

      message:
      "Available chargers cannot exceed total chargers"

    }

  },



  queueTime:{
    type:Number,
    default:0,
    description:"Estimated waiting time in minutes"
  },



  status:{
    type:String,
    enum:[
      "active",
      "maintenance",
      "offline"
    ],

    default:"active"
  },



  rating:{
    type:Number,
    min:0,
    max:5,
    default:4
  },


  imageUrl:{
    type:String,
    default:""
  },


  // Extra Uganda features
  operator:{
    type:String,
    default:"ChargeFlow Uganda"
  },


  solarPowered:{
    type:Boolean,
    default:false
  },


  phoneNumber:{
    type:String,
    default:""
  }


},
{
 timestamps:true
});



// Faster searching
stationSchema.index({
 latitude:1,
 longitude:1
});


stationSchema.index({
 city:1,
 country:1
});


export default mongoose.model(
"Station",
stationSchema
);