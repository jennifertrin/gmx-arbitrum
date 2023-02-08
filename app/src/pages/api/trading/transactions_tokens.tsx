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
    token_price as (
      select
        hour::date as date,
        symbol,
        decimals,
        avg(price) as usdprice
      from
        ethereum.core.fact_hourly_token_prices
      where
        symbol in (
          'USDC',
          'LINK',
          'USDT',
          'WETH',
          'WBTC',
          'DAI',
          'FRAX'
        )
        or token_address in ('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984')
      group by
        1,
        2,
        3
    ),
    arbitrum_transaction as (
      select
        block_timestamp,
        tx_hash,
        origin_from_address,
        event_inputs:value as volume,
        case
          when contract_address = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8' then 'USDC'
          when contract_address = '0xf97f4df75117a78c1a5a0dbb814af92458539fb4' then 'LINK'
          when contract_address = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1' then 'WETH'
          when contract_address = '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f' then 'WBTC'
          when contract_address = '0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0' then 'UNI'
          when contract_address = '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1' then 'DAI'
          when contract_address = '0x17fc002b466eec40dae837fc4be5c67993ddbd6f' then 'FRAX'
          when contract_address = '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9' then 'USDT'
          else contract_address
        end as Token_Symbol
      from
        arbitrum.core.fact_event_logs
      where
        tx_status = 'SUCCESS'
        and event_name = 'Transfer'
        and event_inputs:value is not null
    ),
    arbitrum_transaction_info as (
      select
        t1.*,
        (t1.volume / pow(10, t2.decimals)) * t2.usdprice as VolumePrice
      from
        arbitrum_transaction t1
        join token_price t2 on t1.block_timestamp::date = t2.date
        and t1.Token_Symbol = t2.symbol
      where
        VolumePrice > 1
    ),
    arbitrum_transaction_by_date as (
      select
        token_symbol,
        substring(
          cast(date_trunc('month', block_timestamp) as string),
          1,
          19
        ) as date,
        count(distinct tx_hash) as transactions,
        count(distinct origin_from_address) as Users_Count,
        sum(VolumePrice) as Total_Volume,
        avg(VolumePrice) as Average_Volume
      from
        arbitrum_transaction_info
      group by
        token_symbol,
        date
    )
  select
    'Arbitrum' as Platform,
    *
  from
    arbitrum_transaction_by_date`,
    ttlMinutes: 10,
  };

  const result: QueryResultSet = await flipside.query.run(query);

  res.status(200).json({ result });
}
