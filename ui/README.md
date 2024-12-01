# BANANA UI

## Configuration

```sh
export BANANA_UI_CONFIG=
```

```json
{
 "oidc": {
  "enabled": false,
  "authorizeEndpoint": "https://localhost/oauth2/authorize",
  "clientId": "my_client_id",
  "selfUrl": "http://localhost:8080/oidc/callback",
  "scope": "openid email",
  "responseType": "id_token",
  "response_mode": "fragment"
 },
 "kongApi": {
  "endpoint": "http://localhost:8001",
  "requestHeaders": {
   "apikeyheader": "apikeyvalue"
  }
 }
}
```
