const apiKey = 'apiKey';
const cityInput = document.getElementById('cityInput');
const suggestions = document.getElementById('suggestions');
const weatherForecastDiv = document.getElementById('weatherForecast');
const selectCityDiv = document.getElementById('selectCity');

let cities = [];

// Nacitani JSON souboru s mesty
fetch('city.list.json')
	.then(response => response.json())
	.then(data => {
		cities = data; // ulozeni dat o mestech do promenne
	})
	.catch(error => console.error('Chyba při načítání měst:', error));

// Funkce pro zobrazení navrhu mest podle vstupu
function showSuggestions(query) {
	suggestions.innerHTML = ''; // vymazani predchozich navrhu
	const filteredCities = cities.filter(city =>
		city.name.toLowerCase().includes(query.toLowerCase())
	);

	filteredCities.forEach(city => {
		const suggestionItem = document.createElement('li');
		suggestionItem.textContent = ` ${city.name}, ${city.country}`;
		suggestionItem.addEventListener('click', () => {
			cityInput.value = city.name;
			getWeatherForecast(city.name);
			suggestions.innerHTML = ''; // vymazani navrhu po vyberu mesta
		});
		suggestions.appendChild(suggestionItem);
	});

}

// Funkce pro ziskani dat o pocasi
async function getWeatherForecast(city) {
	const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=cs`;
	const response = await fetch(url);
	const data = await response.json();

	const forecastList = data.list; // ziskani predpovedi na 5 dni
	const dailyForecast = [];

	// vybirame zaznamy z indexu 4, 12, 20, 28, 36 (priblizne posledni cas)
	for (let i = 4; i < forecastList.length; i += 8) {
		dailyForecast.push(forecastList[i]);
	}

	//pormenna vybraneho mesta pro vypis
	const selectCities = data.city.name;

	//zobrazeni vybraneho mesta
	displayCity(`<i>Poloha:</i> ${selectCities}`);

	//zobrazeni predpovedi 
	displayWeatherForecast(dailyForecast);
}

//Funkce pro zobrazeni mesta 
function displayCity(selectCities) {
	return selectCityDiv.innerHTML = selectCities;
}

// Funkce pro zobrazeni predpovedi pocasi
function displayWeatherForecast(dailyForecast) {

	let forecastHTML = '<table><tr></tr><tr><th>Datum</th><th>Teplota</th><th>Popis</th></tr>';

	dailyForecast.forEach(item => {
		const date = new Date(item.dt * 1000);
		const formattedTime = date.toLocaleString('cs-CZ', {
			hour: '2-digit',
			minute: '2-digit',
			day: 'numeric',
			month: 'numeric',
		});

		const temp = item.main.temp;
		const description = item.weather[0].description;
		forecastHTML += `<tr><td>${formattedTime}</td><td>${temp}°C</td><td>${description}</td></tr>`;

	});


	forecastHTML += '</table>';
	weatherForecastDiv.innerHTML = forecastHTML;
}

// Naseptavac pro zadani mesta
cityInput.addEventListener('keyup', (e) => {
	const query = e.target.value;
	if (query.length > 1) { // zacne hledat po zadani 1 a vice znaku
		showSuggestions(query);
	} else {

		suggestions.innerHTML = ''; // skryti navrhu
	}
});







