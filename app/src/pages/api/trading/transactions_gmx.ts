import type { NextApiRequest, NextApiResponse } from "next";
import { Flipside, Query, QueryResultSet } from "@flipsidecrypto/sdk";

type Data = {
  result: QueryResultSet;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const api_key = process.env.NEXT_SHROOM_DK_API_KEY || "";

  const flipside = new Flipside(api_key, "https://node-api.flipsidecrypto.com");

  const query: Query = {
    sql: `select
    count(distinct(tx_hash)) as transactions,
    date(block_timestamp) as date
  from
    arbitrum.core.fact_event_logs
  where
    tx_status = 'SUCCESS'
    and contract_address = '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a'
  group by date
  order by date asc`,
    ttlMinutes: 10,
  };

  const result: QueryResultSet = await flipside.query.run(query);

  res.status(200).json({ result });
}
