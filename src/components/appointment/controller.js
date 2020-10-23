const Appointment = require('./model');

module.exports = appointmentController = {
    getMany: (limit, after, service) => {
      limit = +limit; // to make sure limit is an int not string

      if(!service) {
        if(!limit)
          return Appointment.find().lean().exec();

        if(!after) 
            return Appointment.find().limit(limit).lean().exec();
    
        let appointments = Appointment.find({ _id: { $gt:after } }).limit(limit).lean().exec();
        
        // if an _id was deleted, find the documents after the _id just before the one deleted, returning the same results.
        while(!appointments)
        appointments = Appointment.find({ _id: { $lt:after } }).sort({ _id: -1 }).limit(1).lean().exec();
    
        return appointments;
      }
      else {
        if(!limit)
        return Appointment.find({ service }).lean().exec();

        if(!after) 
          return Appointment.find({ service }).limit(limit).lean().exec();

        let appointments = Appointment.find({ service, _id: { $gt:after } }).limit(limit).lean().exec();
        
        // if an _id was deleted, find the documents after the _id just before the one deleted, returning the same results.
        while(!appointments)
          appointments = Appointment.find({ service,  _id: { $lt:after } }).sort({ _id: -1 }).limit(1).lean().exec();

        return appointments;
      }
    },

    getOneById: async(id) => {
      const appointment = await Appointment.findById(id).lean().exec();
      
      return appointment;
    },
  
    addMany: async(appointmentsInputs) => {
      let appointments = []; 

      let appointmentsAdded = await Appointment.create(appointmentsInputs); // create accepts an array, and deals with it properly
    
      appointmentsAdded.forEach(appointment => {
        appointments.push(appointment.toObject( { getters:true } ));
      });

      return appointments;
    },
  
    editMany: async(appointmentsInputs) => {
      let updatedAppointments = [];

      // foreach faces issue with async/await
      for (const appointmentInput of appointmentsInputs) {
        let updatedAppointment = await Appointment.findByIdAndUpdate(appointmentInput._id, appointmentInput, {new: true} ).exec();
        updatedAppointments.push(updatedAppointment);
      }
      return updatedAppointments;
    },
  
    removeMany: async(appointmentsIds) => {
      const appointmentsToDelete = await Appointment.find({ _id: { $in:appointmentsIds } }).exec();

      appointmentsToDelete.forEach(appointment => {
        appointment.remove();
  
        appointment = appointment._doc;
      });
  
      return appointmentsToDelete;
    }
}