import * as dotenv from 'dotenv';

dotenv.config({ override: true, quiet: true });

/**
 * Retrieves the value of a specified environment variable.
 * @param envVariable - Name of the env variable.
 * @returns - Throws error if variable is not set, otherwise it returns its value.
 */
function requireEnvVariable(envVariable: string): string {
  const envVariableValue = process.env[envVariable];
  if (!envVariableValue) {
    throw new Error(`Environment variable ${envVariable} is not set.`);
  }

  return envVariableValue;
}

export const BASE_URL = requireEnvVariable('BASE_URL');
export const ADMIN_EMAIL = requireEnvVariable('ADMIN_EMAIL');
export const ADMIN_PASSWORD = requireEnvVariable('ADMIN_PASSWORD');
export const USER_EMAIL = requireEnvVariable('USER_EMAIL');
export const USER_PASSWORD = requireEnvVariable('USER_PASSWORD');
