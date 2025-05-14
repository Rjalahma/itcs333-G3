const apiUrl = 'https://85a9004b-6f70-4270-987e-d532d17c45e5-00-jmf0e13pp2ab.pike.replit.dev/';
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

const photo_url = document.getElementById('Club Photo url').value;
console.log("photo", photo_url);
const photo_alt = document.getElementById('Club Photo alt').value;
console.log("photo", photo_url);
console.log("email", email);
const briefdescription = document.getElementById('Club_Description').value;
console.log("briefdescription", briefdescription);
 

const day = document.getElementById('day_club').value;
console.log("day", day);
    async function validateForm() {
        
        // chack if any field is empty
    if (!name || !type || !day || !time || !locationn || !contact || !email || !briefdescription  || !photo_url || !photo_alt) {
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
   if (!photo_url.match(/^https:\/\/.+/) ) {
    alert('Please enter a valid image URL.');
    return false;
}
    if (!photo_alt.match(/^[a-zA-Z\s]+$/)) {
        alert('Photo alt can only contain letters and spaces.');
        return false;
    }
    //  otherwise the form is valid
    else {
        
        console.log('Form is valid!');
        try{
        fetch("https://85a9004b-6f70-4270-987e-d532d17c45e5-00-jmf0e13pp2ab.pike.replit.dev/add-club.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: name,
                type: type,
                briefdescription :briefdescription,
                day: day,
                time: time,
                location: locationn,
                contact : contact,
                email: email,
                photo: {
                    url: photo_url,
                    alt: photo_alt
                },
               
                briefdescription: briefdescription
                
        
            
        
            })
          })
          .then(res => res.json())
          .then(data => alert( "Club added successfully!"))
          .catch(err => console.error("Error adding comment:", err));
          

        }
            catch (error) {
                console.error('Error:', error);
            }
        alert("Club added successfully!");
        window.location.replace("../Club_Activities/Club_Activities.html");
    }
}
// Call the validateForm function 
const isValid = validateForm();






});