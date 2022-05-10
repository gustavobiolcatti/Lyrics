const form = document.querySelector("#form")
const resposta = []

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com',
		'X-RapidAPI-Key': '5383dc929emshcc0a03a2f12acf7p194ca7jsn6c89dab21673'
	}
}

async function search() {
    const param = (document.getElementById("param").value.trim()).replace(" ", "%20")

    await fetch(`https://genius-song-lyrics1.p.rapidapi.com/search?q=${param}&per_page=10&page=1`, options)
	.then(response => response.json())
	.then(response => {
        const searchResult = response.response.hits

        searchResult.forEach(item => resposta.push(item.result));
    })
	.catch(err => console.error(err))
    .finally(() => {
        showResult()
    })
}

async function getLyrics(id) {
    await fetch(`https://genius-song-lyrics1.p.rapidapi.com/songs/${id}/lyrics`, options)
	.then(response => response.json())
	.then(response => {
        document.getElementById("result__lyrics").innerHTML = response.response.lyrics.lyrics.body.html        
    })
	.catch(err => console.error(err));
}

function showResult() {
    resposta.forEach((item) => {
        const result = document.getElementById("result__list").innerHTML
        document.getElementById("result__list").innerHTML = (result + `<li>${item.full_title}<button class="show-lyrics" onclick="getLyrics(${item.id})">Letra</button></li>`)
    })
}

form.addEventListener("submit", (e) => {
    e.preventDefault()

    search()
})
