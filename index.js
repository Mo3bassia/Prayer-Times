// https://api.aladhan.com/v1/timings/28-07-2024?latitude=31.0321&longitude=30.4716&method=5 Location

// https://api.aladhan.com/v1/timingsByCity/28-07-2024?city=دمنهور&country=egypt&method=5 city

let geo = document.querySelector(".geo");
let show = document.querySelector(".show");
let dateElement = document.querySelector(".date");
let dayElement = document.querySelector(".day");
let gregorian = document.querySelector(".gregorian");
let hijri = document.querySelector(".hijri");
let country = document.querySelector(".country");
let city = document.querySelector(".city");
let dateChange = document.querySelector(".dateChange");
let prayers = document.querySelector(".prayers ul");

function getLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
      });
    } else {
      reject("Sorry");
    }
  });
}

geo.onclick = function () {
  getLocation()
    .then((result) => {
      let date;
      if (dateChange.value == "") {
        date = new Date();
      } else {
        date = new Date(dateChange.value);
      }
      axios
        .get(
          `https://api.aladhan.com/v1/timings/${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}?latitude=${
            result.coords.latitude
          }&longitude=${result.coords.longitude}&method=9`
        )
        .then((data) => {
          prayers.innerHTML = "";
          createPray(
            data.data.data.timings,
            data.data.data.date.hijri.weekday.ar,
            data.data.data.date.gregorian.date,
            data.data.data.date.hijri.date.replaceAll("-", "/")
          );
        });
    })
    .catch((error) => {
      alert(error);
    });
};

function check() {
  if (country.value == "" || city.value == "") {
    return false;
  } else {
    return true;
  }
}

show.onclick = function () {
  if (check() && dateChange.value == "") {
    axios
      .get(
        `https://api.aladhan.com/v1/timingsByCity?city=${city.value}&country=${country.value}&method=8`
      )
      .then((result) => {
        prayers.innerHTML = "";
        createPray(
          result.data.data.timings,
          result.data.data.date.hijri.weekday.ar,
          result.data.data.date.gregorian.date,
          result.data.data.date.hijri.date.replaceAll("-", "/")
        );
      });
  } else if (check() && dateChange.value != "") {
    let date = new Date(dateChange.value);

    axios
      .get(
        `https://api.aladhan.com/v1/timingsByCity/${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}?city=${city.value}&country=${
          country.value
        }&method=5`
      )
      .then((result) => {
        prayers.innerHTML = "";
        createPray(
          result.data.data.timings,
          result.data.data.date.hijri.weekday.ar,
          result.data.data.date.gregorian.date,
          result.data.data.date.hijri.date.replaceAll("-", "/")
        );
      });
  }
};

function createPray(object, day, date, hijriDate) {
  dayElement.textContent = day;
  gregorian.textContent = `(${date})`;
  hijri.textContent = `(${hijriDate})`;
  for (prop of Object.keys(object)) {
    let date = new Date();
    date.setHours(object[prop].split(":")[0]);
    date.setMinutes(object[prop].split(":")[1]);
    date.setSeconds(0);

    let prayer = document.createElement("li");
    prayer.classList.add("prayer");
    prayers.append(prayer);
    let title = document.createElement("span");
    title.textContent = prop;

    let value = document.createElement("span");
    value.classList.add("time");
    value.textContent = date.toLocaleTimeString().replace(":00", "");

    prayer.append(title);
    prayer.append(value);
  }
}

window.onload = function () {
  let timeNow = document.querySelector(".timeNow");
  setInterval(() => {
    timeNow.textContent = new Date().toLocaleTimeString();
  }, 500);
};
