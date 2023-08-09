async function search(groupId, token, item) {
    const url = 'https://api.tryformation.com/search';
    const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const payload = { groupIds: [groupId] };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    });

    if (response.status === 200) {
        const data = await response.json();
        return data.hits;
    } else {
        console.log(`Request failed with status code ${response.status}`);
        console.log(await response.text());
    }
}

async function connect(item) {
    const url = 'https://api.tryformation.com/token/loginToWorkspace';
    const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    };
    const payload = {
        workspace: 'demo',
        email: 'athena@tryformation.com',
        password: 'Athrap@11'
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    });

    if (response.status === 200) {
        const data = await response.json();
        const token = data.apiAccessToken.token;
        const groupId = data.groups[0].groupId;
        const groupName = data.groups[0].groupName;
        const userId = data.groups[0].userId;
        return search(groupId, token, item);
    } else {
        console.log(`Request failed with status code ${response.status}`);
    }
}

async function fetchResults() {
    const results = await connect('corner');
    console.log(results);
    return results;
}

export default fetchResults;


//import fetchResults from './convert.js';


/*
async function main() {
    const results = await fetchResults();
    console.log(`inside function: ${results.length}`);
}
main();
console.log(fetchResults());
*/