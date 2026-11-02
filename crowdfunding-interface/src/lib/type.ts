export type FundedEvent = {
  funder: string;
  value: string;
  txHash: string;
  blockNumber: number;
};

export type WithdrawnEvent = {
  value: string;
  txHash: string;
  blockNumber: number;
};
