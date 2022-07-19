function GetTime() {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();

    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;

    document.querySelector('#current-time').innerText = hour + ":" + minute;



}

function GetCountries() {

    let countries = [];

    return fetch("https://ezanvakti.herokuapp.com/ulkeler")
        .then(response => response.json())
        .then(data => {
            countries = data;

            let countryNames = "";
            let indexTurkiye = 0;
            for (let i = 0; i < countries.length; i++) {
                countryNames += `<option value="${countries[i].UlkeID}">${countries[i].UlkeAdi}</option>`
                if (countries[i].UlkeAdi == "TÜRKİYE")
                    indexTurkiye = i;
            }
            document.querySelector('#countries').innerHTML = countryNames;
            document.querySelector('#countries').selectedIndex = indexTurkiye;

            GetCities(2); //türkiye id
        })

}

function GetCities(countryID) {

    let cities = [];
    return fetch("https://ezanvakti.herokuapp.com/sehirler/" + countryID)
        .then(response => response.json())
        .then(data => {
            cities = data;

            let cityNames = "";
            let indexIstanbul = 0;
            for (let i = 0; i < cities.length; i++) {
                cityNames += `<option value="${cities[i].SehirID}">${cities[i].SehirAdi}</option>`
                if (cities[i].SehirAdi == "İSTANBUL")
                    indexIstanbul = i;
            }
            document.querySelector('#cities').innerHTML = cityNames;

            if (countryID == 2) {
                document.querySelector('#cities').selectedIndex = indexIstanbul;
                GetCounties(539);  //istanbul id
            }
            else {
                document.querySelector('#cities').selectedIndex = 0;
                GetCounties(data[0].SehirID);  //ilk ilçe
            }

        })
}

function GetCounties(cityID) {

    let counties = [];
    return fetch("https://ezanvakti.herokuapp.com/ilceler/" + cityID)
        .then(response => response.json())
        .then(data => {
            counties = data;

            let countyNames = "";
            for (let i = 0; i < counties.length; i++) {
                countyNames += `<option value="${counties[i].IlceID}">${counties[i].IlceAdi}</option>`
            }
            document.querySelector('#counties').innerHTML = countyNames;

        })
}

function GetPrayersTime(countyID) {
    let times = [];
    return fetch("https://ezanvakti.herokuapp.com/vakitler/" + countyID)
        .then(response => response.json())
        .then(data => {
            times = data;
            var date = new Date();
            var day = date.getDate();
            if (day < 10)
                day = "0" + day;
            var month = date.getMonth() + 1;
            if (month < 10)
                month = "0" + month;
            var year = date.getFullYear();

            var fullDate = day + "." + month + "." + year;
            var counter;

            for (let i = 0; i < times.length; i++) {
                if (times[i].MiladiTarihKisa == fullDate) {
                    document.querySelector('#imsak').innerText = `İmsak: ${times[i].Imsak}`;
                    document.querySelector('#gunes').innerText = `Güneş: ${times[i].Gunes}`;
                    document.querySelector('#ogle').innerText = `Öğle: ${times[i].Ogle}`;
                    document.querySelector('#ikindi').innerText = `İkindi: ${times[i].Ikindi}`;
                    document.querySelector('#aksam').innerText = `Akşam: ${times[i].Aksam}`;
                    document.querySelector('#yatsi').innerText = `Yatsı: ${times[i].Yatsi}`;

                    clearInterval(counter);
                    counter = setInterval(function () {
                        IftaraKalanSure(times[i].Aksam)
                    }, 1000);

                }
            }


        })
}


function IftaraKalanSure(aksam) {
    var now = new Date().getTime();
    var endDate = new Date();
    endDate.setHours(aksam.substr(0, 2));
    endDate.setMinutes(aksam.substr(3, 2));
    endDate.setSeconds("0");

    var t = endDate - now;

    if (t > 0) {
        var hour = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minute = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        var second = Math.floor((t % (1000 * 60)) / 1000);

        document.querySelector('#time-left').innerHTML = ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2) +
            ":" + ("0" + second).slice(-2);
    } else {
        document.querySelector('#time-left').innerHTML = "00:00:00";
    }
}


function ChangeCountry(){
    var country = document.querySelector("#countries").value;
    GetCities(country);
}

function ChangeCity() {
    var city = document.querySelector("#cities").value;
    GetCounties(city);
}

function ChangeLocation() {
    var countryInput=document.getElementById('countries');
    var country= countryInput.options[countryInput.selectedIndex].text;

    var cityInput=document.getElementById('cities');
    var city=cityInput.options[cityInput.selectedIndex].text;

    var countyInput=document.getElementById('counties');
    var county=countyInput.options[countyInput.selectedIndex].text;

   document.getElementById('country').innerText=country;
   document.getElementById('city').innerText=city;
   document.getElementById('county').innerText=county;

   GetPrayersTime(countyInput.value);

   $('#locationModal').modal('hide');
}



GetCountries();
GetPrayersTime(9541);

setInterval(function () {
    GetTime();
}, 1000)