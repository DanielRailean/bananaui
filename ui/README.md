# BANANA UI

## Configuration

```sh
export BANANA_UI_CONFIG=
```

```json
{
 "oidc": {
  "enabled": "true",
  "authorizeEndpoint": "https://localhost/oauth2/authorize",
  "clientId": "my_client_id",
  "selfUrl": "http://localhost:8080/oidc/callback",
  "scope": "openid email",
  "responseType": "id_token",
  "response_mode": "fragment"
 },
 "kongApi": {
  "endpoint": "https://localhost/api/local",
  "requestHeaders": {
   "apikeyheader": "apikeyvalue"
  }
 }
}
```
