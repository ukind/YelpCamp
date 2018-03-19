const CamperInterface = require('./camperDatabaseInterface');

let camperCount = CamperInterface.count({}, (error, result) => {
  if (error) {
    console.log(error);
  }
  return result;
});


module.exports = camperCount;
