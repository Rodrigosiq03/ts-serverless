import { client } from "../db/client";
import { PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

export async function createUser(event: any) {
  const response = { statusCode: 201, body: '' };

  try {
    const body = JSON.parse(event.body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: marshall(body || { message: "No body provided" })
    }
    const _ = await client.send(new PutItemCommand(params));
    response.body = JSON.stringify({
      message: "Successfully created user",
      user: unmarshall(params.Item)
    });
  } catch (err: any) {
    console.error(err);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to create user",
      error: err.message,
      errorStack: err.stack
    });
  }

  return response;
}