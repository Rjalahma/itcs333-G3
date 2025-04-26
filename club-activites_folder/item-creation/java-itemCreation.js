const apiUrl = 'https://6809f2951f1a52874cde75c1.mockapi.io/cludData';
let allActivities = [];


const form = document.getElementById('add');
form.addEventListener('click', async (event) => {
event.preventDefault(); // Prevent form submission
// form validation
const name = document.getElementById('Club_Name').value;
console.log("name", name);
const type = document.getElementById('clubtype').value;
console.log("type", type);

const time = document.getElementById('time').value;
console.log("time", time);
const locationn = document.getElementById('location').value;
console.log("locationn", locationn);
const contact = document.getElementById('Phone_Number').value;
console.log("contact", contact);
const email = document.getElementById('userEmail').value;

const p = document.getElementById('clubphoto').value;
console.log("photo", p);
console.log("email", email);
const briefdescription = document.getElementById('Club_Description').value;
console.log("briefdescription", briefdescription);


const day = document.getElementById('day_club').value;
console.log("day", day);
    async function validateForm() {
        // chack if any field is empty
    if (!name || !type || !day || !time || !locationn || !contact || !email || !briefdescription ) {
        alert('Please fill in all the  fields.');
        return false;
    }
    // chack if the name contain only latteres and spasces
    if (!name.match(/^[a-zA-Z\s]+$/)) {
        alert('Name can only contain letters and spaces.');
        return false;
    }
    // chack if the type contain only latteres and spasces
    if (!locationn.match(/^[a-zA-Z\s]+$/)) {
        alert('Name can only contain letters and spaces.');
        return false;
    }
    // chack if the type contain only numberes
    // and chack if it 8 didgits or not 
    if (!contact.match(/^\d+$/)|| (contact.length !=8)) {
        alert('Contact can only contain numbers and must be 8 digits long.');
        return false;
    }
    // chack if the email is valid or not
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Please enter a valid email address.');
        
        return false;
    }
    // chack if description contain only letters and spaces
    if (!briefdescription.match(/^[a-zA-Z\s]+$/)) {
        alert('Description can only contain letters and spaces.');
        return false;
    }
    // chack if the photo is uploaded or not
    if (!p){
        alert('Please upload a photo.');
        return false;
    }
    //  otherwise the form is valid
    else {
        alert('Form is valid!');
    }
}
// Call the validateForm function 
const isValid = validateForm();

});