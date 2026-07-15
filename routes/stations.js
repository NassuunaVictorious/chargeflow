import express from 'express';
import Station from '../models/Station.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();


// GET /api/stations
// Get Uganda charging stations
router.get('/', async (req, res) => {
  try {

    const {
      status,
      chargerType,
      city,
      minSpeed,
      maxPrice
    } = req.query;


    const filter = {
      country: "Uganda"
    };


    if(status)
      filter.status = status;


    if(chargerType)
      filter.chargerType = chargerType;


    if(city)
      filter.city = city;


    if(minSpeed)
      filter.chargingSpeed = {
        $gte:Number(minSpeed)
      };


    if(maxPrice)
      filter.price = {
        $lte:Number(maxPrice)
      };



    const stations = await Station
      .find(filter)
      .sort({name:1});


    res.json({
      stations,
      count:stations.length
    });


  } catch(error){

    res.status(500).json({
      message:"Server error",
      error:error.message
    });

  }
});





// GET /api/stations/recommend
// Smart Uganda EV recommendation
router.get('/recommend', protect, async(req,res)=>{


try{


const {
battery = 50,
latitude,
longitude
}=req.query;


// Kampala fallback
const userLat =
parseFloat(latitude) || 0.3476;


const userLng =
parseFloat(longitude) || 32.5825;



const currentBattery =
Math.max(
0,
Math.min(
100,
parseFloat(battery)
)
);



const stations =
await Station.find({
country:"Uganda",
status:"active"
});



if(stations.length===0){

return res.json({

recommendation:null,

message:"No charging stations available in Uganda"

});

}





const scoredStations =
stations.map(station=>{


const latDiff =
station.latitude - userLat;


const lngDiff =
station.longitude - userLng;



const distance =
Math.sqrt(
latDiff * latDiff +
lngDiff * lngDiff
)
*
111.32;



const distanceScore =
Math.max(
0,
1-distance/100
);



const queueScore =
Math.max(
0,
1-(station.queueTime || 0)/60
);



const priceScore =
Math.max(
0,
1-(station.price || 0)/10000
);



const availabilityScore =
(station.availableChargers || 0) /
(station.totalChargers || 1);



const speedScore =
Math.min(
1,
(station.chargingSpeed || 50)/350
);



const score =

(0.30 * distanceScore)

+

(0.25 * queueScore)

+

(0.20 * priceScore)

+

(0.15 * availabilityScore)

+

(0.10 * speedScore);



return {


...station.toObject(),


distance:
Math.round(distance*100)/100,


score:
Math.round(score*1000)/1000


};



});





scoredStations.sort(
(a,b)=>b.score-a.score
);




res.json({

recommendation:
scoredStations[0],


alternatives:
scoredStations.slice(1,4),


allStations:
scoredStations,


userBattery:
currentBattery


});



}catch(error){

res.status(500).json({

message:"Server error",
error:error.message

});

}


});







// GET /api/stations/:id

router.get('/:id',async(req,res)=>{


try{


const station =
await Station.findById(req.params.id);



if(!station){

return res.status(404).json({

message:"Station not found"

});

}



res.json({station});



}catch(error){

res.status(500).json({

message:"Server error",
error:error.message

});

}


});









// CREATE station

router.post('/',
protect,
adminOnly,
async(req,res)=>{


try{


const station =
await Station.create({

...req.body,

country:"Uganda"

});



res.status(201).json({
station
});


}catch(error){


res.status(500).json({

message:"Server error",
error:error.message

});


}


});








// UPDATE station

router.put('/:id',
protect,
adminOnly,
async(req,res)=>{


try{


const station =
await Station.findByIdAndUpdate(

req.params.id,

req.body,

{
new:true,
runValidators:true
}

);



if(!station){

return res.status(404).json({

message:"Station not found"

});

}



res.json({station});



}catch(error){

res.status(500).json({

message:"Server error",
error:error.message

});

}


});








// DELETE station

router.delete('/:id',
protect,
adminOnly,
async(req,res)=>{


try{


const station =
await Station.findByIdAndDelete(
req.params.id
);



if(!station){

return res.status(404).json({

message:"Station not found"

});

}



res.json({

message:"Station deleted successfully"

});



}catch(error){


res.status(500).json({

message:"Server error",
error:error.message

});


}


});



export default router;