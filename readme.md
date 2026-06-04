# Banana UI

## Live on GitHub Pages ->  [danielrailean.github.io/bananaui](https://danielrailean.github.io/bananaui/)

User interface (management UI) for Kong API gateway, with a focus on developer productivity and a great developer experience, alternative for Kong manager.

![UI example.](./docs/resources/ui.png)

## Features

- Supports CRUD operation for all Kong entities
- Caching of API requests (useful with thousands of entities)
- Advanced filtering for entities:
  - Boolean `'AND'` supported (ex: name == "some" && id == "my-id")
  - Field length based filtering (ex. for routes entity: paths.len == 2)
- Local user preferences:
  - API pagination size (how much is fetched in each API call)
  - UI pagination size (how much is displayed on a single page)
  - Visible fields for each entity
- Handles the Admin API pagination properly and will fetch all the entities
- Works both dynamically (check docker image) and statically -> all code is on the client side (needs a link to the Kong admin API and whitelisting for CSRF in the API itself)
- Dark mode (click on the banana icon next to the name)
- Ease of navigation among linked Kong entities
- Easy to CREATE/UPDATE entities -> access to the raw JSON body
- Loads entity schema on CREATE, loads config schema for plugins
- Copy buttons for all objects and object fields
- All links have anchor tags, which makes it easy to open in new tabs
- Supports SSO login with an ID token.
- Local settings stored in browser's `LocalStorage`, when deploying the docker image, a default config can be provided in the env var, check `ui/Readme.md`
- Built using `Svelte.kit` so easy to contribute to and extend.
- Blazingly fast (thanks to Svelte) -> 99/100 lighthouse score
- All entity fields can be searched from the same search window

## Features to be added

- 'middleware' on different events, such as
  - trim part of the route on copy
  - append parts to the route on copy
- more OIDC flows -> auth user with secret in the backend (in case of dynamic deployment)
