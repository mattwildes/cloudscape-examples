import os
import uuid
import boto3
from datetime import datetime
from pydantic import BaseModel
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.event_handler.api_gateway import Router

tracer = Tracer()
router = Router()
logger = Logger()

dynamodb = boto3.resource("dynamodb")
mediaconnect = boto3.client("mediaconnect")
ITEMS_TABLE_NAME = os.environ.get("ITEMS_TABLE_NAME")


class CreateItemRequest(BaseModel):
    name: str
    type: str
    status: str
    details: int


@router.get("/flows")
@tracer.capture_method
def flows():
    # table = dynamodb.Table(ITEMS_TABLE_NAME)
    flows = []
    
    response = mediaconnect.list_flows()
    
    flows.extend(response['Flows'])

    while 'NextToken' in response:
                next_token = response['NextToken']
                response = mediaconnect.list_flows(NextToken=next_token)
                flows.extend(response['Flows'])

    # return flows

    # items = response['Items']

    # while 'LastEvaluatedKey' in response:
    #     response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
    #     items.extend(response['Items'])

    return {"ok": True, "data": flows}


# @router.get("/flows/<item_id>")
# @tracer.capture_method
# def get_flow(item_id: str):
#     # table = dynamodb.Table(ITEMS_TABLE_NAME)

#     # response = table.get_item(
#     #     Key={
#     #         "itemId": item_id,
#     #     }
#     # )

#     # item = response.get('Item', None)

#     # return {"ok": True, "data": flow}

#     response = mediaconnect.list_flows()
#     flows = response['Flows']

#     while 'NextToken' in response:
#             next_token = response['NextToken']
#             response = mediaconnect.list_flows(NextToken=next_token)
#             flows.extend(response['Flows'])

#     for flow in flows:
#     if flow['Name'] == item_id:
#         # Describe the flow
#         flow_arn = flow['FlowArn']
#         response = mediaconnect.describe_flow(FlowArn=flow_arn)
#         return response['Flow']

#     # If the flow is not found, return None
#     print(f"Flow with name '{flow_name}' not found.")
#     return None



# @router.put("/flows")
# @tracer.capture_method
# def create_flow():
#     data: dict = router.current_event.json_body
#     generic_request = CreateItemRequest(**data)

#     item_id = str(uuid.uuid4())
#     timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
#     table = dynamodb.Table(ITEMS_TABLE_NAME)

#     response = table.put_item(Item={
#         "itemId": item_id,
#         "name": generic_request.name,
#         "type": generic_request.type,
#         "status": generic_request.status,
#         "details": generic_request.details,
#         "created_at": timestamp,
#         "updated_at": timestamp
#     })

#     logger.info(response)

#     return {"ok": True}


# @router.delete("/flows/<item_id>")
# @tracer.capture_method
# def delete_flow(item_id: str):
#     table = dynamodb.Table(ITEMS_TABLE_NAME)

#     response = table.delete_item(
#         Key={
#             "itemId": item_id
#         }
#     )

#     logger.info(response)

#     return {"ok": True}
