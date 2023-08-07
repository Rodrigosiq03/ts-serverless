import { client } from "../db/client";
import { UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

export async function updateUser(event: any) {
  const response = { statusCode: 200, body: '' };

  try {
    const body = JSON.parse(event.body);
    const objKeys = Object.keys(body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: marshall({ userId: event.queryStringParameters.userId }),
      UpdateExpression: `set ${objKeys.map((key, i) => `#${key} = :${key}`).join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}),
      ExpressionAttributeValues: marshall(objKeys.reduce((acc, key) => ({ ...acc, [`:${key}`]: body[key] }), {})),
    }

    const getUserParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: marshall({ userId: event.queryStringParameters.userId })
    }

    const _ = await client.send(new UpdateItemCommand(params));
    
    const { Item } = await client.send(new GetItemCommand(getUserParams));

    response.body = JSON.stringify({
      message: "Successfully updated user",
      user: unmarshall(Item!),

    });
  } catch (err: any) {
    console.error(err);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to update user",
      error: err.message,
      errorStack: err.stack
    });
  }

  return response;
}