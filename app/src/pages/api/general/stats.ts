import type { NextApiRequest, NextApiResponse } from 'next'
import { Flipside, Query, QueryResultSet } from "@flipsidecrypto/sdk";

type Data = {
  result: QueryResultSet
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const api_key = process.env.NEXT_SHROOM_DK_API_KEY || '';

  const flipside = new Flipside(
    api_key,
    "https://node-api.flipsidecrypto.com"
  );

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
        and date(block_timestamp) > '2021-09-30'
    ),
    gmx_transaction as (
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
        origin_to_address in (
          '0x3d6ba331e3d9702c5e8a8d254e5d8a285f223aba',
          '0xb87a436b93ffe9d75c5cfa7bacfff96430b09868'
        )
        and tx_status = 'SUCCESS'
        and event_name = 'Transfer'
        and event_inputs:value is not null
    ),
    arbitrum_transaction_info as (
      select
        t1.*,
        (t1.volume / pow(10, t3.decimals)) * t3.usdprice as VolumePrice
      from
        arbitrum_transaction t1
        join token_price t3 on t1.block_timestamp::date = t3.date
        and t1.Token_Symbol = t3.symbol
      where
        VolumePrice > 1
    ),
    gmx_transaction_info as (
      select
        t1.*,
        (t1.volume / pow(10, t3.decimals)) * t3.usdprice as VolumePrice
      from
        gmx_transaction t1
        join token_price t3 on t1.block_timestamp::date = t3.date
        and t1.Token_Symbol = t3.symbol
      where
        VolumePrice > 1
    ),
    gmx_aggregated_info as (
      select
        to_varchar(count(distinct tx_hash), '999,999,999,999') as TX_Count,
        to_varchar(
          count(distinct origin_from_address),
          '999,999,999,999'
        ) as Users_Count,
        to_varchar(sum(VolumePrice), '999,999,999,999') as Total_Volume_All_Tokens
      from
        gmx_transaction_info
    ),
    arbitrum_aggregated_info as (
      select
        to_varchar(count(distinct tx_hash), '999,999,999,999') as TX_Count,
        to_varchar(
          count(distinct origin_from_address),
          '999,999,999,999'
        ) as Users_Count,
        to_varchar(sum(VolumePrice), '999,999,999,999') as Total_Volume_All_Tokens
      from
        arbitrum_transaction_info
    )
  
  select
    'gmx.io' as Platform,
    *
  from
    gmx_aggregated_info
  UNION
  select
    'Arbitrum (since 09/2021)' as Platform,
    *
  FROM
    arbitrum_aggregated_info`,
    ttlMinutes: 10,
  };

  const result: QueryResultSet = await flipside.query.run(query);

  res.status(200).json({ result })
}
