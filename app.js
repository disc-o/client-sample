const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const forge = require('node-forge')

const app = express()
const port = 3002
const private_key = forge.pki.privateKeyFromPem(
    "-----BEGIN RSA PRIVATE KEY-----\
MIIEpQIBAAKCAQEAyQ7Yyc8Fuw42W/Uq3ks2BNX/EvXVqFgw/Xm6JgwHlEVI8RKe\
1sNBa+OIlamZ4s4pa83364fh8Vk2UsZHeNsCJc37z3Xl2WJ3pUgUKgt8HH2XmmO7\
CRA3Ig7Z7IOoAKiJ06Iip1+8yi+7yUFC8jQ/tGdzVfBE9zZ00nsONMUasTqsmtzS\
Fmj3sT3BwPpF7HYJZSA1K14ssVUE/n+INeUJ05OzlRkrtkdLVGCOwa0SXif+oBaa\
+2mN3m3VECkgDx4eXx3HoTturYtLLmI5cAO8L42c0rhV1VaPBZbf4uAKr+uQ7hqs\
Pz1sJ+sXmomVQIWPOUR6noJG3a9ZV9cFcAjV+QIDAQABAoIBAEDhBZu5rkO6RlhO\
ONMauge9dl4L7jIwoz5oNWVppFh4Mx13wMHUqBvEhKKm4/2IQV2ETWg3pPVYsGrt\
iMq7AWppmcRMaytG1w0CwV7/7cDT1kP/wq8eCGx5FmF36pKr0C32t/ACuM0Vsicz\
ZAL8UUJJz7H/ooGTlQcGpoLox8BAeC/yvGAYZYKWH9Xy35LBwCm5ezqG8FkJcWVx\
gU7DOVw6DajTkxxg556D6Us1+ktTF2rvyWaRdmoDyX4rt1LysKH0hIBMVhrp28Zl\
85iiqOJwWn5jWyOPqZyo8bG+yyaQtJPNgFqE4ORoZrPx9KJQB6Z9XTcnC2tKsmGy\
qCR0wLECgYEA7oGFHjR87YWAITXsLRZwaeA7neIkueW6/1pNIxT/yWFcG7/u+qEh\
jIwC3MLVQFAqp94a0r4U1whwDwghPBpbLohOZO8kCcbyHoQ8SLS6rv00xAGvdV2Y\
delomUp45L3qnqXYU5XwE/kxGMRceTe3ocxeXrQYU0F5JbfzQZoIy4cCgYEA184o\
iXrsBTIi/ZtXDGuslzJ2CPpFwslaRWBfcP0CZkTzcUFF8AF9DDbeG/NT54mjoXI+\
jNjrlMEMA+Om+42Z4Zh6kjwg52dNBk/30ds3Nt+hLRVuQE4p6qu3kXgygQ56Do3E\
HJ6WFFRh1Quf6GormP9oUNVMoD/+QWtwBHCYsn8CgYEA68xfaHpqHIYFJFBkXDs4\
DmTja/d9adDHbNfBNXL4ZAd+gezi/yS4v3RZDBsPrFLVqTs796h3gBTWfPYDraE9\
DqcyIjYPwh7Plv4Tf6o2evTY6wPjjTxolAKcKBlppnRg9lJuqkytm4GdWagg6LL+\
ONeNYUHaXs13UaQoum3oThcCgYEAoV4Rp8OXqsbzrSkz7SCyfJiJ9GqYMW/4pTnM\
BCPcYHachoplbnLee3ynlsTbb53XEkjoBs/JUIENp/bZjO40K6GlvaVigUYYLWks\
iOpfnhOYZKrKtyD7bPOcHxV+xkv57toI09GtrWPvh6valaKWGSCacx8b3hQb3fUl\
XNyJAacCgYEA1j8n+CBCCYrNlpXtDlIOVZnZDK9WmrT5ziyj0Vr2wOYHdMzgGRUw\
EhTF2wkgIbPZ6xzy1p0rQbbfZThXh+jfB3aeKaOD0VGBRj0CTHKae8lfI4zVWQ1I\
VwRKi37iE9HS1kvWugvB3CY1NeQKOrr4B3oEj53fnT9XDKO/Z2DXW1Y=\
-----END RSA PRIVATE KEY-----")

var decrypted_challenge

app.listen(port, () => console.log(`Disco sample client listening on port ${port}!`))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    var options = {
        uri: 'http://127.0.0.1:3001/uid?callback=http%3A%2F%2F127.0.0.1%3A3002%2Fcallback',
        method: 'GET',
        headers: {
            'Authorization': "-----BEGIN CERTIFICATE-----\
                            MIIDGTCCAgECFDJp0BJ+af9z/rLYiT7P2f+xFmQKMA0GCSqGSIb3DQEBCwUAMEkx\
                            CzAJBgNVBAYTAlNHMRIwEAYDVQQIDAlTaW5nYXBvcmUxEjAQBgNVBAcMCVNpbmdh\
                            cG9yZTESMBAGA1UECgwJRHVtbXkgQ28uMB4XDTE5MDUyODEzMzcwMVoXDTIwMDUy\
                            NzEzMzcwMVowSTELMAkGA1UEBhMCU0cxEjAQBgNVBAgMCVNpbmdhcG9yZTESMBAG\
                            A1UEBwwJU2luZ2Fwb3JlMRIwEAYDVQQKDAlEdW1teSBDby4wggEiMA0GCSqGSIb3\
                            DQEBAQUAA4IBDwAwggEKAoIBAQDJDtjJzwW7DjZb9SreSzYE1f8S9dWoWDD9ebom\
                            DAeURUjxEp7Ww0Fr44iVqZnizilrzffrh+HxWTZSxkd42wIlzfvPdeXZYnelSBQq\
                            C3wcfZeaY7sJEDciDtnsg6gAqInToiKnX7zKL7vJQULyND+0Z3NV8ET3NnTSew40\
                            xRqxOqya3NIWaPexPcHA+kXsdgllIDUrXiyxVQT+f4g15QnTk7OVGSu2R0tUYI7B\
                            rRJeJ/6gFpr7aY3ebdUQKSAPHh5fHcehO26ti0suYjlwA7wvjZzSuFXVVo8Flt/i\
                            4Aqv65DuGqw/PWwn6xeaiZVAhY85RHqegkbdr1lX1wVwCNX5AgMBAAEwDQYJKoZI\
                            hvcNAQELBQADggEBAIPTbCUmc818sz16y30akXM+IUF5s/Sc2Fq4ZIiF8qn13XiI\
                            5s/M3IQz5RcrhU7+uAvspL4uVQZqH6ztZsnYSf+mQL563hWo0WUpx686D2ySPBnw\
                            KPLsjagCmyfwRtaKpm3zn/wXZJDl4HalQMDHv7Uy1Uy0P9BIxpMvFCFVu0eoW/5R\
                            pqLy6JtJtOFq/X0jvjRvdz1xYo19dx3FYk36sxzHm+yE4ch82jHU8tVW8+kYEDqF\
                            nrSt9KK7vDxAWT1MMD4EuknrxifHrFfxTf9WVfhsXX4WTK/QfFgQwTsSZaw/ITK7\
                            DlnX6jLae5qaZAsIOUjCViURMfSgSNVGR50S4ww=\
                            -----END CERTIFICATE-----"
        }
    }
    request(options, (err, resp, body) => {
        var json = JSON.parse(resp.body)
        console.log('encrypted: ' + json.challenge)
        decrypted_challenge = private_key.decrypt(json.challenge)
        console.log('decrypted: ' + decrypted_challenge)
        res.send(json.uid)
    })
})

app.post('/callback', (req, res) => {
    var url = req.body.proxy_url
    console.log(url)
    var register_options = {
        uri: url + '/auth/register?state=kjcxv787o34nldsf&client_id=0&client_name=client0&client_secret=secret&is_trusted=false',
        method: 'GET',
        headers: {
            'content-type': 'text/plain',
            'challenge': decrypted_challenge
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