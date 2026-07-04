class config:
    SECRET_KEY = 'abcd1234'

class DevelopmentConfig(config):
    DEBUG = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = ''
    MYSQL_DB = 'tienda2'


config = {
    'development': DevelopmentConfig
}