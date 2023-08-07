import { client } from "../db/client";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"

export async function handler(event: any) {
  const response = { statusCode: 200, body: '' };

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: marshall({ userId: event.queryStringParameters.userId })
    }
    const _ = await client.send(new DeleteItemCommand(params));
    response.body = JSON.stringify({
      message: "Successfully deleted user",
    });
  } catch (err: any) {
    console.error(err);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to delete user",
      error: err.message,
      errorStack: err.stack
    });
  }

  return response;
}