const Hospital = require('./model');

module.exports = hospitalController = {
    getMany: (limit, after) => {
      if(!limit)
        return Hospital.find().lean().exec();
      if(!after) 
        return Hospital.find().limit(limit).lean().exec();

      let hospitals = Hospital.find({ _id: { $gt:after } }).limit(limit).lean().exec();
    
    // if an _id was deleted, find the documents after the _id just before the one deleted, returning the same results.
    while(!hospitals)
    hospitals = Hospital.find({ _id: { $lt:after } }).sort({ _id: -1 }).limit(1).lean().exec();

    return hospitals;
    },

    getOneById: async(id) => {
      const hospital = await Hospital.findById(id).lean().exec();
      
      return hospital;
    },

    addMany: async(hospitalsInputs) => {
      let hospitals = []; 

      let hospitalsAdded = await Hospital.create(hospitalsInputs); // create accepts an array, and deals with it properly
    
      hospitalsAdded.forEach(hospital => {
        hospitals.push(hospital.toObject( { getters:true } ));
      });

      return hospitals;
    },

    editMany: async(hospitalsInputs) => {
      let updatedHospitals = [];

      // foreach faces issue with async/await
      for (const hospitalInput of hospitalsInputs) {
        let updatedHospital = await Hospital.findByIdAndUpdate(hospitalInput._id, hospitalInput, {new: true} ).exec();
        updatedHospitals.push(updatedHospital);
      }
      return updatedHospitals;
    },

    removeMany: async(hospitalsIds) => {
      const hospitalsToDelete = await Hospital.find({ _id: { $in:hospitalsIds } }).exec();

      hospitalsToDelete.forEach(hospital => {
        hospital.remove();
  
        hospital = hospital._doc;
      });
  
      return hospitalsToDelete;
    }
}