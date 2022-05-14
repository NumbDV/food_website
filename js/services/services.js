const postData = async (url, data) => { // async говорит что внутри функции будет асинхронный код
    const res = await fetch(url, { // fetch возвращает promise, await дожидается выполнения запроса
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });
    return await res.json(); // promise, await + async required
};

async function getResource(url) {
    let res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
}

export {postData};
export {getResource};