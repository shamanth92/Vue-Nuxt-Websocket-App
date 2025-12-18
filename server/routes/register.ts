import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const body = JSON.parse(
      Array.isArray(query.details) ? query.details[0] : query.details ?? "{}"
    );
    const client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body?.email,
      Password: body?.password,
      UserAttributes: [
        { Name: "email", Value: body?.email },
        { Name: "phone_number", Value: `+1${body.phone.split("-").join("")}` },
        { Name: "email", Value: body.email },
        { Name: "name", Value: body?.name },
        {
          Name: "picture",
          Value:
            "https://plus.unsplash.com/premium_photo-1673967831980-1d377baaded2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2F0fGVufDB8MXwwfHx8MA%3D%3D",
        },
      ],
    });
    const response = await client.send(command);
    return response;
  } catch (error) {
    return error;
  }
});
