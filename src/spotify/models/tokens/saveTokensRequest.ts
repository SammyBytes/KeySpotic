export type SaveTokensRequest = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export const mapToSaveTokensRequest = (data: any): SaveTokensRequest => {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
};

export const mapToDb = (data: SaveTokensRequest) => {
  return {
    access_token: data.accessToken,
    refresh_token: data.refreshToken,
    expires_at: data.expiresIn,
  };
};
