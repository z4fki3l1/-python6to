class config:
    SECRET_KEY = 'abcd1234'

class DevelopmentConfig(config):
    DEBUG = True
    MYSQL_HOST = 'sql5.freesqldatabase.com'
    MYSQL_USER = 'sql5832801'
    MYSQL_PASSWORD = '71xXPsVqgM'
    MYSQL_DB = 'sql5832801'


config = {
    'development': DevelopmentConfig
}