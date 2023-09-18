const LANG = 'es'
const API_MASTERIES_RESUME_ENDPOINT = 'https://api.guildwars2.com/v2/account/mastery/points'
const API_MASTERIES_DETAIL_ENDPOINT = 'https://api.guildwars2.com/v2/masteries' // ?ids=1,2&lang=es'

const getAuthData = async (url, token) => {
    const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}access_token=${token}&lang=${LANG}`)
    return await res.json()
}

const getData = async url => {
    const res = await fetch(url)
    return await res.json()
}

const chunk = (array, chunkSize) => {
    const chunks = []
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
}

const getAccountMasteries = async token => {
    const res = await getAuthData(API_MASTERIES_RESUME_ENDPOINT, token)
    // if(res && res.unlocked){
    //     const chunks = chunk(res.unlocked, 200)
    //     res.unlocked = []
    //     for(let i = 0; i < chunks.length; i++){
    //         const resDetails = await getData(`${API_MASTERIES_DETAIL_ENDPOINT}?ids=${chunks[i].join(',')}&lang=${LANG}`)
    //         console.log(resDetails)
    //         // res.unlocked = resDetails
    //     }
    // }
    delete res.unlocked
    return res
}

window.addEventListener('load', () => {

    const _container = document.querySelector('#content')

    document.querySelector('#load-masteries-btn').addEventListener('click', async () => {
        const apiKey = document.querySelector('#api-key').value.trim()
        if(!apiKey){
            return alert('¡Falta la API KEY!')
        }
        const data = await getAccountMasteries(apiKey)
        const _elements = data.totals.map(zone => {
            const _div = document.createElement('div')
            _div.classList.add('mastery-zone-container')
            const _title = document.createElement('div')
            _title.classList.add('mastery-zone-title')
            const _pointsContainer = document.createElement('div')
            _pointsContainer.classList.add('mastery-zone-points-container')
            const _earned = document.createElement('div')
            _earned.classList.add('mastery-zone-total-earned')
            const _spent = document.createElement('div')
            _spent.classList.add('mastery-zone-total-spent')

            _title.innerHTML = zone.region
            _earned.innerHTML = `Ganados: ${zone.earned}`
            _spent.innerHTML = `Gastados: ${zone.spent}`

            _div.appendChild(_title)
            _pointsContainer.appendChild(_spent)
            _pointsContainer.appendChild(_earned)
            _div.appendChild(_pointsContainer)

            return _div
        })
        _elements.forEach(e => _container.appendChild(e))
    })

})