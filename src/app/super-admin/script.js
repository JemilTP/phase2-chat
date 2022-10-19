  
function openForm(){
    document.getElementById("Page").style.display = "none";
    document.getElementById("myForm").style.display="block";
    console.log("kk")
  }
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("Page").style.display = "block";
  }
  
  function reload(){
    location.reload()
  }