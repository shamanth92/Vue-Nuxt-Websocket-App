import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    const email =
      Array.isArray(query.email) ? query.email[0] : query.email ?? undefined;
    const code =
      Array.isArray(query.code) ? query.code[0] : query.code ?? undefined;

    if (!email || !code) {
      throw new Error("Missing email or confirmation code");
    }

    const client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });

    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email,
      ConfirmationCode: code,
    });

    const response = await client.send(command);
    return response;
  } catch (error) {
    return { error: String(error) };
  }
});

