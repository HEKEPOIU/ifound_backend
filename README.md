# IFound

## Deploy

```sh
 cp .example.env .env
 nvim .env #Use the Code editor you like to change inner Setting.
 docker-compose -f docker-compose.prod.yaml up -d #Use detach mode, it open the mongodb and IFound server
```

---

## Development

This Project will use mongodb atlas for deploy (Because we use atlas search function)
But You can use docker for mongodb On Development. (For none search api)


```sh
 docker-compose -f docker-compose.dev.yaml up -d # Open MongodbDocker.
 npm run dev
```
> After End dev, you can stop doecker compose by typing ```docker-compose -f docker-compose.dev.yaml down```.

### Generate Document

```sh
 npm run gendoc_dev # can generate swagger doc by autogen.
```

> You need run it every time you change the autogen code.

> Currently only support the Development swagger Doc page.


### API Test

[On api folder](api/) it have bruno api test file, it will always up-to-date.
(swagger page are not.)
