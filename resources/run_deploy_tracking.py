import boto3
import time
import random
from datetime import datetime, timedelta

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('deployment_tracking')

application_names = ["frontend", "frontend","backend","worker"]
env = ["dev","dev", "dev", "dev","preprod","preprod","prod"]
status = ["success", "success", "success", "success", "failed"]
user = ["Elliot", "Elliot", "Angela", "Darlene"]
messages = {"success": ["Deployment terminated without error"], "failed": ["Exception during cache generation. Stacktrace [.....]",
                        "Failed to retrieve new content. Github connection timeout", "Critical exception. Ecorp detected"]}

def generate_new_deployment_logs():
    """ Create a random deployment logs

        :return dict  The deployment logs
    """
    start_date = datetime.now().strftime("%Y-%m-%d %H:%M")
    deploy_duration = random.randint(3,12)
    status_choice = random.choice(status)
    end_date = (datetime.now() + timedelta(minutes=deploy_duration)).strftime("%Y-%m-%d %H:%M")
    return {"deploy_id": int(random.randint(400,20000)), "application": random.choice(application_names),
            "start_time": str(start_date), "end_time": str(end_date), "duration": int(deploy_duration),
            "environment": random.choice(env), "status" : status_choice, "user": random.choice(user),
            "message": random.choice(messages[status_choice])}

def insert_new_deploy_log():
    """ Push a new deployment log in Dynamodb

    """
    while True:
        print(table.put_item(Item=generate_new_deployment_logs()))
        time.sleep(random.randint(5,100))

if __name__ == '__main__':
    insert_new_deploy_log()





