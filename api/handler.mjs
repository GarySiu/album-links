import fetch from 'node-fetch'

export default function handler(request, response) {
  const hashPattern = /[a|gallery]\/(\w+)$/i
  if (!hashPattern.test(request.query['album'])) {
    return response.status(400).send('bad request');
  }

  const albumHash = request.query['album'].match(hashPattern)[1]
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Client-ID ${process.env.CLIENT_ID}`);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`https://api.imgur.com/3/album/${albumHash}`, requestOptions)
  .then(res => res.text())
  .then(result => {
    const output = JSON.stringify(JSON.parse(result).data.images.map(image => image.link))
    .replace(/[\[|\]]/g, '')
    .replace(/,/g, ',\n');
    response.setHeader('Content-Type', 'text/plain')
    response.status(200).send(output);
  })
  .catch(error => {
    console.log('error', error)
    return response.status(400).send('bad request');
  });
}
