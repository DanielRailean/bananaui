# BANANA UI

appconfig:

```json
{
	"oidc": {
		"authorizeEndpoint": "https://login.microsoftonline.com/{tenant}/oauth2/authorize",
		"clientId": "31c26159-3169-4ad3-bd2b-86a038f5b3fc",
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
