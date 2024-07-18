# IFound

## Deploy

```sh
 cp .example.env .env
 code .env #Use the Code editor you like to change inner Setting.
 docker-compose up -d #Use detach mode
```

---

## Development

This Project will use mongodb atlas for deploy (Because we use atlas search function)
But You can use docker for mongodb. (For none search api)


```sh
 docker-compose -f docker-compose.dev.yaml up
```
