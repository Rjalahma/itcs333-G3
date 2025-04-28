document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("productForm");
 
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Stop form from submitting
 
    // Select fields
    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");
    const shortDesc = document.getElementById("shortDescription");
    const detailedDesc = document.getElementById("detailedDescription");
    const productFile = document.getElementById("productFile");
 
    let valid = true;
 
    // Helper function to check each field
    function validateField(field) {
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        valid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    }
 
    validateField(productName);
    validateField(productPrice);
    validateField(shortDesc);
    validateField(detailedDesc);
 
    // Special case for file input
    if (productFile.files.length === 0) {
      productFile.classList.add("is-invalid");
      valid = false;
    } else {
      productFile.classList.remove("is-invalid");
    }
 
    if (valid) {
      alert("Form submitted successfully!");
      // You can uncomment this line to actually submit the form
      // form.submit();
    } else {
      alert("Please fill in all fields correctly before submitting.");
    }
  });
});