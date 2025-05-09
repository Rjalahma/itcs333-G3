const apiUrl = 'https://85a9004b-6f70-4270-987e-d532d17c45e5-00-jmf0e13pp2ab.pike.replit.dev/main-clubs.php';
let allActivities = [];
let currentPage = 1

document.addEventListener('DOMContentLoaded', itemDetailes);
async function itemDetailes() {
    console.log("itemDetailes");
    
    // this is where the url is fetched and the id is extracted from it
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams=",urlParams);
    const activityId = urlParams.get('id');
    console.log("THIS IS THE ID ",activityId);
    const response =await fetch(apiUrl);
    if (!response.ok) {
        alert('please check your internet connection');
        console.error('Error fetching data:', response.statusText);
        return;
    }
    else{
    const data = await response.json();
    console.log("data",data);
    const activity = data.find(a => a.id == activityId);

    console.log("activity",activity);
    if(!activityId)  {
        alert ("something went wrong please refresh the page or chack your internet connection");
        
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
        // Handle the case where the comment section or comments are not accessible or empty
        console.error('Comment section or comments are not accessible or empty');   
        commentsection.innerHTML+=`
                                        <div class="comment-card  ">
                                            <strong >"still there is no comment "</strong>
                                            
                                        </div> `   

                                               
        commentsection.innerHTML+=`<input class="Close_button  col btn btn-secondary" onclick="location.href='javascript:window.history.back();'" type="button" value="Close">`;
        //  Display a message indicating no comments available
        const firstcom= document.getElementById("first-comment");
       
            firstcom.innerHTML=`
                                          <div class="comment-card  ">
                                            <strong >"still there is no comment "</strong>
                                            
                                        </div> 
                                    `;
    }
    else {
        // Handle the case where comments are available
        const first=pagecomment[0];
        console.log("pagecomment",pagecomment);
        console.log("fist name ",pagecomment[0][0]);
        for (let i = 0; i < pagecomment.length; i++) {
            // this is where all the comments are displayed
        commentsection.innerHTML+=`
                                        <div class="comment-card  ">

                                            <strong " >${pagecomment[i].comment}</strong>
                                            <p class="fw-bold">
                                                Rating out of 5: <span class="text-warning">${pagecomment[i].rating}</span>
                                            </p>

                                        </div> `   

                                                }   
        commentsection.innerHTML+=`<input class="Close_button  col btn btn-secondary" onclick="location.href='javascript:window.history.back();'" type="button" value="Close">`;
        
        // Display the first comment separately
        const firstcom= document.getElementById("first-comment");
        if (first) {
            firstcom.innerHTML=`
                                            <strong " >${first.comment}</strong>
                                            <p class="fw-bold">
                                                Rating out of 5: <span class="text-warning">${first.rating}</span>
                                            </p>
                                          

                                    `;
        }
      
    }

    // this is where the delete button action is done
    const deleteButton = document.getElementById('Delete-btn');
    if (!deleteButton) {
        alert('something went wrong please refresh the page or chack your internet connection and try again');
        return;
    }
    else{
       
        deleteButton.addEventListener('click', function() {
            // confirmation before deletion
            if (confirm('Are you sure you want to delete this item?')) {
                // fetch api to delete the item
                fetch('https://85a9004b-6f70-4270-987e-d532d17c45e5-00-jmf0e13pp2ab.pike.replit.dev/delete-club.php', {
                    method: 'DELETE',
                    headers: {
                        // 'Content-Type': 'application/json'
                    },
                    // send the id of the item to be deleted
                    body: JSON.stringify({ id: activityId })
                })
                .then(response => {
                    if (!response.ok) throw new Error("Network response was not ok");
                    if (response.status === 400){
                        alert(" There is an issue in the system please try again later")
                        return false;
                    }
                    return response.json();
                })
                .then(data => console.log("Delete successful:", data))
                .catch(error => console.error("Delete failed:", error));
            }

        });
    }
    // this is where the add comment button action is done
    const addComment=document.querySelector("input[value='add comment']");
    
    if (!addComment) {
        alert('something went wrong please refresh the page or chack your internet connection and try again');
        return;
    }
 
    else {
        // add event listener to the add comment button
        console.log("addComment",addComment);
        addComment.addEventListener('click', function() {

            const commentText = document.getElementsByTagName('textarea')[0].value;
            const rating = document.getElementById('com-rating').value;
            // cheack if comment is not empty and if it contains only letters and spaces
            if (!commentText.match(/^[a-zA-Z\s]+$/) || commentText.length==0) {
                alert('Comment can only contain letters and spaces.');
                return;
            }
            // cheack if rating is not empty 
            if (!rating) {
                alert('Please enter a rating out of 5.');
                return;
            }
            
            // fetch api to add the comment by sending the comment and rating along with the id of the item to the server
            fetch('https://85a9004b-6f70-4270-987e-d532d17c45e5-00-jmf0e13pp2ab.pike.replit.dev/add-com.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    // values to be sent to the server
                    club_id: activityId ,
                    comment: commentText,
                    rating: rating
                
                })
            })
            .then(response => {
                // check if the response is ok or not
                if (!response.ok) throw new Error("Network response was not ok");
                if (response.status === 400){
                    alert(" There is an issue in the system please try again later")
                    return false;
                
                }
                return response.json();
                
            })
            
            .then(data => console.log("Delete successful:", data))
            .catch(error => console.error("Delete failed:", error));
            
            
           
           
        });
    }

   
}}
