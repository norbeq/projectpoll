# projectpoll

## database model
![Database model](https://raw.githubusercontent.com/norbeq/projectpoll/master/docs/database_scheme.png)

## requirements
- apache2
- mariadb-server
- python 3.5.2 with libraries:
- - Flask 0.12.2
- - Flask-SocketIO 2.8.6
- - Flask-SQLAlchemy 2.2
- - Flask-Mail 0.9.1
- - Flask-MySQLdb 0.2.0
- - python-jose 1.3.2
- - validate-email 1.3
- - eventlet 0.21.0

## used
- sencha Cmd v6.2.2.36
- sencha Ext JS v6.2.0.981
- javascript libraries:
- - [decision-tree](https://github.com/lagodiuk/decision-tree-js)
- - [FileSaver](https://github.com/eligrey/FileSaver.js/)
- - [jwt-decode](https://github.com/auth0/jwt-decode)
- - [sha512](https://github.com/emn178/js-sha512)
- - [socket.io](https://cdnjs.com/libraries/socket.io)

## configurations
### Application
```python
token = {
    'key':"<SECRET KEY>",
    'expiration_seconds':'3600',
    'iss':'iss'
}
db_conf = "mysql://username:password@hostname/dbname"
mail_conf = {
    'server':"smtp-server",
    'port':465,
    'use_ssl':True,
    'username':'mail',
    'password':'password',
    'sender': 'sender@mail'
}
http_url="application url"
```
### Apache Virtual Host File
```sh
<VirtualHost *:80>
	ServerName #domain
    ServerAlias #address
    ServerAdmin webmaster@localhost

    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
</VirtualHost>
```
### Daemon Config
```sh
poll.service
[Unit]
Description=poll
After=multi-user.target

[Service]
Type=idle

Environment=VIRTUAL_ENV=$venv
Environment=PYTHONPATH=$project:$PYTHONPATH
ExecStart=$venv/bin/python $project/main.py

[Install]
WantedBy=multi-user.target
```
