import { client } from "../db/client";
import { ScanCommand } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

export async function getUser(event: any) {
  const response = { statusCode: 200, body: '' };

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE
    }
    const { Items } = await client.send(new ScanCommand(params));
    response.body = JSON.stringify({
      message: "Successfully retrieved all users",
      users: Items?.map((item) => unmarshall(item)),
      rawUsers: Items
    });
  } catch (err) {
    console.error(err);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to retrieve users",
      error: err.message,
      errorStack: err.stack
    });
  }

  return response;
}