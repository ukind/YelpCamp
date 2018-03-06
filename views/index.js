const divData = document.querySelector('.test');
// conver object server side to object client side
const camper = <%= JSON.stringify(camperHTML) %>;
console.log(camper);
