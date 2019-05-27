const express = require('express')
const request = require('request')
var bodyParser = require('body-parser')
const app = express()
const port = 3002

app.listen(port, () => console.log(`Disco sample client listening on port ${port}!`))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/callback', (req, res) => {
    var url = req.body.proxy_url
    console.log(url)
    var register_options = {
        uri: url + '/auth/register?state=kjcxv787o34nldsf&client_id=0&client_name=client0&client_secret=secret&is_trusted=false',
        method: 'GET',
        headers: {
            'content-type': 'text/plain'
        }
    }

    var authorize_options = {
        uri: url + "/auth/authorize",
        method: 'GET',
        qs: {
            'state': 'adfhjgxzlckj32',
            'response_type': 'token',
            'client_id': 0,
            'redirect_uri': 'http%3A%2F%2F127.0.0.1%3A3000%2Fredirect',
            'scope': 'key_b+address',
            'client_secret': 'secret',
            'public_key': 'key',
            'client_name': 'client0'
        },
        followAllRedirects: false
    }
    request(authorize_options, (err, resp, body) => {
        if (resp.statusCode == 403) {
            console.log(resp.request.uri.hash)
        } else {
            request(register_options, (err, resq, body) => {
                if (resq.statusCode == 200) {
                    console.log('successfully registered')
                    request(authorize_options, (err, resp, body) => {
                        if (resp.statusCode == 403) {
                            console.log(resp.request.uri.hash)
                        } else {
                            console.log('rejected')
                        }
                    })
                } else {
                    console.log('registeration failed')
                }
            })
        }
    })
})