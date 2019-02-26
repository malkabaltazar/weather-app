(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
env = {
  APPID: 'dadc60c3a964c48ced08bf3f56ed3951'
}

module.exports = env

},{}],2:[function(require,module,exports){
let env = require('./env.js');

async function fetchWeather(city, unit) {
  const response =
  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${env.APPID}&units=${unit}`)
  const weatherData = await response.json();
  return processWeather(weatherData, unit)
}

function processWeather(weatherData, unit) {
  weather = new Object;
  weather.city = weatherData.name;
  weather.country = weatherData.sys.country;
  weather.temp = weatherData.main;
  weather.clouds = weatherData.clouds.all;
  weather.description = weatherData.weather[0].description;
  weather.icon = weatherData.weather[0].main;
  if (unit == 'imperial') {
    weather.unit = '°F'
    document.getElementById('imperial').checked = true;
  } else {
    weather.unit = '°C'
  }
  return weather;
}

function display(city, unit = 'imperial') {
  fetchWeather(city, unit).then(function(weather) {
    place = document.getElementById('city');
    place.innerHTML = `${weather.city}, ${weather.country}`;
    description = document.getElementById('description');
    description.innerHTML = weather.description;
    temp = document.getElementById('temp');
    temp.innerHTML = `${weather.temp.temp}${weather.unit}`;
    clouds = document.getElementById('clouds');
    clouds.innerHTML = `${weather.clouds}`;
    icon = document.getElementById('icon');
    icon.innerHTML = `${weather.icon}`;
    humidity = document.getElementById('humidity');
    humidity.innerHTML = `${weather.temp.humidity}`;
    pressure = document.getElementById('pressure');
    pressure.innerHTML = `${weather.temp.pressure}`;
    max = document.getElementById('max');
    max.innerHTML = `${weather.temp.temp_max}${weather.unit}`;
    min = document.getElementById('min');
    min.innerHTML = `${weather.temp.temp_min}${weather.unit}`;
  });
  let units = ['metric', 'imperial'];
  for (var i = 0; i < units.length; i++) {
    let old_unit = document.getElementById(units[i]);
    let unit = old_unit.cloneNode(true);
    old_unit.parentNode.replaceChild(unit, old_unit);
    unit.addEventListener('click', function(self) {
      let unit = self.target.id;
      display(city, unit);
    });
  };
}

document.getElementById('ajax').onkeypress = function(event) {
  if (event.keycode == 13 || event.which == 13) {
    let city = document.getElementById('ajax').value;
    display(city);
  }
}

// search suggestions
// adapted from https://blog.teamtreehouse.com/creating-autocomplete-dropdowns-datalist-element
let datalist = document.getElementById('json-datalist');
let input = document.getElementById('ajax');

let request = new XMLHttpRequest();
request.onreadystatechange = function(response) {
  if (request.readyState === 4) {
    if (request.status === 200 || request.status === 0) {
      let jsonOptions = JSON.parse(request.responseText);
      jsonOptions.forEach(function(item) {
        let option = document.createElement('option');
        option.value = `${item.name}, ${item.country}`;
        datalist.appendChild(option);
      });
      input.placeholder = "input city and press enter";
    } else {
      input.placeholder = "Could not load datalist options";
      console.log(request.status)
    }
  }
};

input.placeholder = "Loading options...";

request.open('GET', 'city.list.json', true);
request.send();

},{"./env.js":1}]},{},[2]);
