import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // Safely extract single string values
  const email =
    Array.isArray(query.email) ? query.email[0] : query.email ?? undefined;
  const password =
    Array.isArray(query.password) ? query.password[0] : query.password ?? undefined;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing email or password",
    });
  }

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID!,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  try {
    const response = await client.send(command);
    return {
      success: true,
      tokens: {
        idToken: response.AuthenticationResult?.IdToken,
        accessToken: response.AuthenticationResult?.AccessToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
        expiresIn: response.AuthenticationResult?.ExpiresIn,
      },
    };
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }
});

