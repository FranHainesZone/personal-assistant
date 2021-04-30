/* TO DO: 
- SPLIT UP JS 
*/ 
 
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// create new instance of speech recognition 
const recognition = new SpeechRecognition();

// create new speech synthesis//
const synth = window.speechSynthesis;
let paragraph = document.createElement('p');
const result = document.querySelector('.result');
const button = document.querySelector('.button');
result.appendChild(paragraph);
let output = '';
const outputDom = document.querySelector('#output div');

button.addEventListener('click', () =>{ 
  listen(); 
  // clear output
  outputDom.innerHTML = '';
  document.querySelector('#output .icon').classList = '';
});

const listen = () => {
  output = '';
  recognition.start();
  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    paragraph.textContent = transcript;
    if (e.results[0].isFinal) {
      if (transcript.includes('get the weather in')) {
        getWeather(transcript);
      } else if (transcript.includes('what is the time')) {
        getTime();
      } else if (transcript.includes('what is the date')) {
        getDate();
      };
    }
  }
};

const speak = (action) => {
  utterance += new SpeechSynthesisUtterance(action());
  synth.speak(utterance);
  recognition.stop();
};

// GET WEATHER
const getWeather = (transcript) => {
  const apiKey = '30e51a648705584effa10080587e6810';
  // split and get 5th result
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${transcript.split(' ')[4]}&units=metric&APPID=${apiKey}`)
    .then(function(res){
      return res.json()
    }) 
    .then(function(data) {
      console.log(data);
      let output = '';

      // CLOUDS
      if(data.weather[0].main == 'Clouds') {
        document.querySelector('#output i').className = 'icon fas fa-cloud';
      // CLEAR 
      } else if(data.weather[0].main == 'Clear') {
        document.querySelector('#output i').className = 'icon fas fa-sun';
      // ATMOSPHERE
      } else if(data.weather[0].main == 'Atmosphere'|| data.weather[0].main == 'Haze' || data.weather[0].main == 'Fog' || data.weather[0].main == 'Mist') {
        document.querySelector('#output i').className = 'icon fas fa-cloud-rain';
      // SNOW
      } else if(data.weather[0].main == 'Snow') {
        document.querySelector('#output i').className = 'icon fas fa-snowflake';
      // RAIN
      } else if(data.weather[0].main == 'Rain') {
        document.querySelector('#output i').className = 'icon fas fa-cloud-showers-heavy';
      // DRIZZLE
      } else if(data.weather[0].main == 'Drizzle') {
        document.querySelector('#output i').className = 'icon fas fa-cloud-rain';
      // THUNDERSTORM
      } else if(data.weather[0].main == 'Thunderstorm') {
        document.querySelector('#output i').className = 'icon fas fa-bolt';
      } 

      let temperature = `${data.main.temp}`;
      let newTemp = temperature.substring(0, temperature.length - 3);
      output += `<div class="weather">${data.weather[0].description}</div> <div class="temperature">${newTemp}°C</div> <div class="city">${data.name}</div>`;
      let speech = `The weather condition in ${data.name} is mostly full of ${data.weather[0].description} at a temperature of ${temperature} degrees Celcius`;
      outputDom.innerHTML = output;
      utterance = new SpeechSynthesisUtterance(speech);
      synth.speak(utterance);
    })
    .catch(function(err){
      console.log(err);
    });
};

// GET TIME
const getTime = () => {
  const time = new Date(Date.now());
  const getHours = time.getHours();
  let getMinutes = time.getMinutes();

  if (getMinutes < 10 ) {
    getMinutes = `0${getMinutes}`;
  }

  output += `<div class="time">${getHours}:${getMinutes}</div>`;
  outputDom.innerHTML = output;
  utterance = new SpeechSynthesisUtterance(`It's ${getHours} ${getMinutes}`);
  synth.speak(utterance);
};

// GET DATE
const getDate = () => {
  const fullDate = new Date(Date.now());
  const year = fullDate.getFullYear();
  let month = fullDate.getMonth();
  const date = fullDate.getDate();
  let day = fullDate.getDay();

  switch (day) {
    case 0:
      day = "Sunday"; 
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
       day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
  }

  switch (month) {
    case 0:
      month = "January";
      break;
    case 1:
      month = "February";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "August";
      break;
    case 8:
      month = "September";
      break;
    case 9:
      month = "October";
      break;
    case 10:
      month = "November";
      break;
    case 11:
      month = "December";
      break;
  }

  output += `<div class="date">${day} ${date} ${month} ${year}</div>`;
  outputDom.innerHTML = output;
  utterance = new SpeechSynthesisUtterance(`It's ${day} ${date} ${month} ${year}`);
  synth.speak(utterance);
};

const numImagesAvailable = 982  
const numItemsToGenerate = 1; 
const collectionID = 928423;

const renderGalleryItem = (randomNumber) => {
  fetch(`https://source.unsplash.com/collection/${collectionID}/?sig=${randomNumber}`)
    .then((response) => {
      console.log(response.url)
      document.body.style.backgroundImage = `url(${response.url})`;
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "top center";
      document.body.style.backgroundSize = "cover";
    });
}

for(let i = 0; i < numItemsToGenerate; i++) {
  let randomImageIndex = Math.floor(Math.random() * numImagesAvailable);
  renderGalleryItem(randomImageIndex);
}