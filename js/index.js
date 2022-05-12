const form = document.querySelector("#form")
const songList = document.getElementById("songs__list")
const lyricsBox = document.getElementById("lyrics")
const urlApi = "https://api.lyrics.ovh"

async function search() {
    const param = (document.getElementById("param").value).trim()

    await fetch(`${urlApi}/suggest/${param}`)
        .then(response => response.json())
        .then(response => {
            form.classList.remove("form--erro")

            showResult(response)
        })
        .catch(error => {
            console.log(error)

            form.classList.add("form--erro")
        })
}

function showResult(songs) {    
    songList.innerHTML = songs.data.map(item => `
        <li>
            <span>
                <strong>${item.title}</strong> - ${item.artist.name}
            </span>

            <button class="button button--show-lyrics" onclick="showLyrics('${item.artist.name}', '${item.title}')">
                <i class="button__icon button__icon--lyrics fa-solid fa-closed-captioning"></i>
            </button>
        </li>`
    ).join("")

    if (songs.prev || songs.next) {
        document.getElementById("songs__prev-next").innerHTML = `
            ${
                songs.prev
                ?
                `<button onclick="previousPage('${songs.prev}')">Anterior</button>`
                :
                ''
            }
            ${
                songs.next
                ?
                `<button onclick="nextPage('${songs.next}')">Próxima</button>`
                :
                ''
            }
        `

        return
    }

    document.getElementById("songs__prev-next").innerHTML = ""
}

async function nextPage(url) {
    await fetch(`http://cors-anywhere.herokuapp.com/${url}`)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(error => console.log(error))
}

async function showLyrics(artist, song) {
    await fetch(`${urlApi}/v1/${artist}/${song}`)
        .then(response => response.json())
        .then(response => {
            
            if (response.error) {
                lyricsBox.innerHTML = ""
                lyricsBox.innerHTML = "Nenhuma letra encontrada :("
                return
            }

            lyricsBox.innerHTML = ""

            const lyrics = response.lyrics.replace(/(\r\n|\r|\n)/g, "<br />")

            lyricsBox.innerHTML =  `<h2 class="lyrics__title">${song}</h2>
                                    <h3 class="lyrics__artist">${artist}</h3>
        
                                    <p>${lyrics}</p>`
        })
        .catch(error => console.log(error))
}

form.addEventListener("submit", (e) => {
    e.preventDefault()

    search()
})
