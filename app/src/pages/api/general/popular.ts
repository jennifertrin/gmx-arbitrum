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
    sql: `with
    tokens as (
      select
        symbol,
        contract_address,
        to_varchar(count(distinct (tx_hash)), '999,999,999,999') as transactions,
        RANK() OVER (
          ORDER BY
            transactions DESC
        ) AS rank
      from
        arbitrum.core.fact_event_logs
        left join arbitrum.core.dim_contracts on address = contract_address
      where
        tx_status = 'SUCCESS'
        and symbol is not null
      group by
        contract_address,
        symbol
      order by
        transactions desc
      limit
        25
    )
  select
    *
  from
    tokens`,
    ttlMinutes: 10,
  };

  const result: QueryResultSet = await flipside.query.run(query);

  res.status(200).json({ result });
}
