from flask import Flask
from flask import render_template
from flask import Response
from decimal import Decimal
import json
import boto3


app = Flask(__name__)
dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('deployment_tracking')


def dyno_decode(datas):
    """ Convert each decimal value in a dict to float

        :params datas dict: object to convert
        :return dict
    """
    if isinstance(datas, Decimal):
        return float(datas)
    elif isinstance(datas, list):
        return [float(i) if isinstance(i, Decimal) else i for i in datas]
    elif isinstance(datas, dict):
        return dict([(k, dyno_decode(v)) for k, v in datas.items()])
    else:
        return datas

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/get_deployments")
def get_deployments():
    """ Return only deployments of the day

    """
    deployments = [dyno_decode(i) for i in table.scan()['Items']]
    return Response(json.dumps(deployments))
