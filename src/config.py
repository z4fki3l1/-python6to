import os

class config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'abcd1234')

class DevelopmentConfig(config):
    DEBUG = True
    MYSQL_HOST = 'sql5.freesqldatabase.com'
    MYSQL_USER = 'sql5832801'
    MYSQL_PASSWORD = '71xXPsVqgM'
    MYSQL_DB = 'sql5832801'

class ProductionConfig(config):
    DEBUG = False
    MYSQL_HOST = os.environ.get('MYSQL_HOST')
    MYSQL_USER = os.environ.get('MYSQL_USER')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD')
    MYSQL_DB = os.environ.get('MYSQL_DB')
    # Muy importante para conexiones externas desde Render:
    MYSQL_CUSTOM_OPTIONS = {"ssl": {"ssl_mode": "REQUIRED"}} 

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
