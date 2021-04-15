let users = [];
let sortingOption = "lastName";
let sortOrder = 1;

$(document).ready(function () {
  $.get("https://jsonplaceholder.typicode.com/users", function(data){
    users = data;
    users.sort(sorting());
    $(".loader").hide()
    appendUsers();
  })

  $("#sortingOption").change(function () {
    sortingOption = $(this).val();
    users.sort(sorting());
    appendUsers();
  });

  $("#sortType").change(function () {
    if ($(this).val() === "ascending") {
      sortOrder = 1;
    } else {
      sortOrder = -1;
    }
    users.sort(sorting());
    appendUsers();
  });

  $('.modal-toggle').on('click', function (e) {
    e.preventDefault();
    $('.modal').toggleClass('is-visible');
  });

  $("#userForm").submit(function(e){
    e.preventDefault(e);
    var data = $('#userForm').serializeArray().reduce(function(obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});
    if (Object.entries(data).filter(a => a[1].length > 0).length === 0) {
      alert('Please Fill All Attributes')
      return
    }
    $(".loader").show();

    const userData = {
      "name": data["name"],
      "username": data["username"],
      "email": data["email"],
      "address": {
        "street": data["street"],
        "suite": data["suite"],
        "city": data["city"],
        "zipcode": data["zipcode"],
        "geo": {
          "lat": data["lat"],
          "lng": data["lng"],
        }
      },
      "phone": data["phone"],
      "website": data["website"],
      "company": {
        "name": data["companyName"],
        "catchPhrase": data["catchPhrase"],
        "bs": data["bs"]
      }
    }
    $.ajax({
      method: "POST",
      url: "https://jsonplaceholder.typicode.com/users",
      data: userData
    })
      .done(function (msg) {
        users.push(userData);
        users.sort(sorting());
        appendUsers();
        $('.modal').toggleClass('is-visible');
        $(".loader").hide();
      });
  });
})


function appendUsers() {
  $('#users').empty();
  for (let i = 0; i < users.length; i++){
    $('#users').append(createUserCard(users[i]));
  }
}


function sorting() {
  return function (fUser, sUser) {
    let fUserProperty = '';
    let sUserProperty = '';
    if (sortingOption === 'lastName') {
      fUserProperty = fUser.name.split(' ').slice(-1)[0] || "";
      sUserProperty = sUser.name.split(' ').slice(-1)[0] || "";  
    } else {
      fUserProperty = fUser.address.zipcode;
      sUserProperty = sUser.address.zipcode;
    }
    var result = (fUserProperty < sUserProperty) ? -1 : (fUserProperty > sUserProperty) ? 1 : 0;
    return result * sortOrder;
  }
}

function createUserCard(user) {
  const {email, name, username, phone, website, company, address: {city, street, zipcode}} = user
  return(
    `<div class="user-card">

      <div class="flexRow">
        <div class="flexRow width33">
          <p class="width30">Email:</p>
          <p class="width70">${email}</p>
        </div>
        <div class="flexRow width33">
          <p class="width30">Name:</p>
          <p class="width70">${name}</p>
        </div>
        <div class="flexRow width33">
          <p class="width30">User Name:</p>
          <p class="width70">${username}</p>
        </div>
      </div>


      <div class="flexRow">
        <div class="flexRow width33">
          <p class="width30">Website:</p>
          <p class="width70">${website}</p>
        </div>

        <div class="flexRow width33">
          <p class="width30">Phone Number:</p>
          <p class="width70">${phone}</p>
        </div>

        <div class="flexRow width33">
          <p class="width30">Company Name:</p>
          <p class="width70">${company.name}</p>
        </div>
      </div>

      <div class="flexRow">
        <div class="flexRow width33">
          <p class="width30">City:</p>
          <p class="width70">${city}</p>
        </div>

        <div class="flexRow width33">
          <p class="width30">Street:</p>
          <p class="width70">${street}</p>
        </div>

        <div class="flexRow width33">
          <p class="width30">Zipcode:</p>
          <p class="width70">${zipcode}</p>
        </div>
      </div>

    </div>`
  )
}