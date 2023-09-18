const LANG = 'es'
const API_MASTERIES_RESUME_ENDPOINT = 'https://api.guildwars2.com/v2/account/mastery/points'
const API_MASTERIES_DETAIL_ENDPOINT = 'https://api.guildwars2.com/v2/masteries' // ?ids=1,2&lang=es'

const getAuthData = async (url, token) => {
    const res = await fetch(url, {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return await res.json()
}

const getData = async url => {
    const res = await fetch(url)
    return await res.json()
}

const getAccountMasteries = async token => {
    const res = await getAuthData(API_MASTERIES_RESUME_ENDPOINT, token)
    if(res && res.unlocked){
        const resDetails = await getData(`${API_MASTERIES_DETAIL_ENDPOINT}?ids=${res.unlocked.join(',')}&lang=${LANG}`)
        res.unlocked = resDetails
    }
    return res
}

window.addEventListener('load', () => {

    document.querySelector('#load-masteries-btn').addEventListener('click', () => {
        const apiKey = document.querySelector('#api-key').value.trim()
        if(!apiKey){
            return alert('¡Falta la API KEY!')
        }
        const data = getAccountMasteries(apiKey)
        document.querySelector('body').innerHTML = JSON.stringify(data, null, 2)
    })

})