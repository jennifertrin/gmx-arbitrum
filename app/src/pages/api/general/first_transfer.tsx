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
    first_transfer_on_gmx as (
      select
        min(block_timestamp) as minimum_timestamp_on_gmx,
        origin_from_address as address
      from
        arbitrum.core.fact_token_transfers
      where
        origin_to_address in (
          '0x3d6ba331e3d9702c5e8a8d254e5d8a285f223aba',
          '0xb87a436b93ffe9d75c5cfa7bacfff96430b09868'
        )
      group by
        origin_from_address
    ),
    first_transfer as (
      select
        min(block_timestamp) as minimum_timestamp,
        origin_from_address as address
      from
        arbitrum.core.fact_token_transfers
      group by
        origin_from_address
    ),
    transfer_comparison as (
      select
        t1.address as address,
        datediff(
          'day',
          minimum_timestamp,
          minimum_timestamp_on_gmx
        ) as date_diff,
        minimum_timestamp,
        minimum_timestamp_on_gmx
      from
        first_transfer t1
        join first_transfer_on_gmx t2 on t2.address = t1.address
    )
  SELECT
    to_varchar(count(distinct (address)), '999,999') as address_count,
    date_diff as days_between_first_transfer_on_arbitrum_and_gmx,
    (CASE WHEN minimum_timestamp = minimum_timestamp_on_gmx THEN 'First Transfer on Arbitrum on GMX' ELSE '' END) as first_transfer_on_gmx
  FROM
    transfer_comparison
  GROUP BY
    date_diff,
    first_transfer_on_gmx
  ORDER BY
    address_count DESC
  limit 10`,
    ttlMinutes: 10,
  };

  const result: QueryResultSet = await flipside.query.run(query);

  res.status(200).json({ result });
}
