const apiUrl = 'https://6809f2951f1a52874cde75c1.mockapi.io/cludData';
let allActivities = [];
let currentPage = 1

document.addEventListener('DOMContentLoaded', itemDetailes);
async function itemDetailes() {
    console.log("itemDetailes");
    if (!window.location.pathname.includes('item-detiles.html')) {
       return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams=",urlParams);
    const activityId = urlParams.get('id');
    console.log("THIS IS THE ID ",activityId);
    const response =await fetch(apiUrl);
    const data = await response.json();
    const activity = data.find(a => a.id === activityId);
    if(!activityId)  {
        console.error('Activity id is not  in the  URL');
        return;
    }
    
    const photo=document.getElementById('img').src= activity.photo.url;
    const alt=document.getElementById('img').alt= activity.photo.alt;
    const thiselement=document.getElementById("details-card");
    const clubName = document.getElementById('form_clubName').textContent= activity.name;
    const clubtype = document.getElementById('form_clubtype').textContent= activity.type;
    const clubday = document.getElementById('form_clubday').textContent= activity.day;
    const clubContact = document.getElementById('form_clubcontact').textContent= activity.contact;
    const clubTime = document.getElementById('form_clubtime').textContent= activity.time;
    const clubemali = document.getElementById('form_clubNemail').textContent= activity.email;
    const clubLocation = document.getElementById('form_clublocation').textContent= activity.location;
    const clubriefdescription = document.getElementById('form_clubdescription').textContent= activity.briefdescription;
    const commentsection=document.getElementById('popup-content');
    const pagecomment = activity.comments;
    console.log("pagecomment",pagecomment);
    console.log("fist name ",pagecomment[0][0]);
    for (let i = 0; i < pagecomment.length; i++) {
        
    commentsection.innerHTML+=`
                                    <div class="comment-card  ">
                                        <strong >${pagecomment[i].username}</strong>
                                        <p>${pagecomment[i].comment}</p>
                                        <p>${pagecomment[i].rating}</p>
                                    </div> `   

                                            }   
    commentsection.innerHTML+=`<input class="Close_button  col btn btn-secondary" onclick="location.href='../item-detiles/item-detiles.html'" type="button" value="Close">`;
    const closeComment= document.getElementById('input[value="Close"]');
    closeComment.addEventListener('click', function(e) {
        commentsection.style.display = 'none';
        e.preventDefault();
        e.stopPropagation();
    });
}
