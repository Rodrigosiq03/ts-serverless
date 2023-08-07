import { client } from "../db/client";
import { GetItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

export async function getUser(event: any) {
  const response = { statusCode: 200, body: '' };

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: marshall({ userId: event.queryStringParameters.userId })
    }
    const { Item } = await client.send(new GetItemCommand(params));
    response.body = JSON.stringify({
      message: "Successfully retrieved user",
      user: unmarshall(Item!),
      rawUser: Item
    });
  } catch (err) {
    console.error(err);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to retrieve user",
      error: err.message,
      errorStack: err.stack
    });
  }

  return response;
}