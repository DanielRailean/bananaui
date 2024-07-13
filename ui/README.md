# BANANA UI

appconfig (read from the BANANA_UI_CONFIG env var):

```json
{
	"oidc": {
		"authorizeEndpoint": "https://login.microsoftonline.com/{tenant}/oauth2/authorize",
		"clientId": "any",
		"selfUrl": "http://localhost:8080/oidc/callback",
		"scope": "openid email",
		"responseType": "id_token",
		"response_mode": "fragment"
	},
	"auth": {
		"enabled": false
	},
	"kongApi": {
		"endpoint": "http://localhost:8001",
		"requestHeaders": {
			"test": "value"
		}
	}
}
```
