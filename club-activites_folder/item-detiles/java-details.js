const apiUrl = 'https://6809f2951f1a52874cde75c1.mockapi.io/cludData';
let allActivities = [];
let currentPage = 1

document.addEventListener('DOMContentLoaded', itemDetailes);
async function itemDetailes() {
    console.log("itemDetailes");
  
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
    if ( !photo || !alt || !clubName || !clubtype || !clubday || !clubContact || !clubTime || !clubemali || !clubLocation || !clubriefdescription) {
        console.error('One of the elements is not accessible');
        return;
    }
    if ( !commentsection || !pagecomment ||pagecomment.length === 0) {
        console.error('Comment section or comments are not accessible or empty');
        return;
    }
    else {
        const first=pagecomment[0];
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
        commentsection.innerHTML+=`<input class="Close_button  col btn btn-secondary" onclick="location.href='javascript:window.history.back();'" type="button" value="Close">`;
        

        const firstcom= document.getElementById("first-comment");
        if (first) {
            firstcom.innerHTML=`
                                            <strong >${first.username}</strong>
                                            <p>${first.comment}</p>
                                            <p>${first.rating}</p>
                                    `;
        }
        console.log("this is the first comment",first.name);
    }
    const deleteButton = document.getElementById('Delete-btn');
    if (!deleteButton) {
        console.error('Delete button is not accessible');
        return;
    }
    else{
        console.log("deleteButton",deleteButton);
        deleteButton.addEventListener('click', function() {
            console.log("delete button clicked");
            alert('Are you sure you want to delete this item?');

        });
    }
    const addComment=document.querySelector("input[value='add comment']");
    
    if (!addComment) {
        console.error('Add comment button is not accessible');
        return;
    }
 
    else {
        console.log("addComment",addComment);
        addComment.addEventListener('click', function() {
            const commentText = document.getElementsByTagName('textarea')[0].value;
            if (!commentText) {
                alert('Please enter a comment');
                return;
            }
            
            if (!commentText.match(/^[a-zA-Z\s]+$/)) {
                alert('Comment can only contain letters and spaces.');
                return;
            }
            
            if (confirm('Are you sure you want to add this comment?')) {
            }
        });
    }

   
}
