import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function Introduction() {
  const [generalStats, setGeneralStats] = useState<any>();
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingStats(true);
    fetch("/api/general/stats")
      .then((res) => res.json())
      .then((data) => {
        setGeneralStats(data);
        setIsLoadingStats(false);
      });
  }, []);

  return (
    <div className="mx-12">
      <div className="text-5xl font-bold w-full mt-12">
        GMX.io Impact on the Arbitrum Ecosystem
      </div>
      <div className="text-lg w-full mt-12">
        <a className="text-blue-700 underline">GMX.io</a> is a decentralized
        spot and perpetual exchange that supports low swap fees and zero price
        impact trades supported on Arbitrum and Avalanche chains. This analysis
        attempts to assess the impact of GMX.io on growth of the the Arbitrum
        chain.
      </div>
      <div className="text-lg w-full mt-6">
        This graph provides an overview on the transaction, user, and total
        volume on GMX.io compared to the Arbitrum ecosystem. Please note that
        Arbitrum historical data has not been back populated on Flipside.
      </div>
      <div className="text-lg w-full mt-12"></div>
      <div className="relative overflow-x-auto mt-8">
        {isLoadingStats ? <Loading /> : null}
        {generalStats ? (
          <table className="w-full px-6 text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {generalStats.result.columns.map((column: string) => (
                  <th key={column} scope="column" className="px-6 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {generalStats.result.rows.map((row: any) => (
                <tr key={row}>
                  {row.map((item: string) => (
                    <td
                      key={item}
                      className="px-6 py-4 font-normal bg-white text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        <div className="text-lg w-full mt-6">
          This suggests that gmx.io, as a whole, represents a limited portion of
          the Arbitrum ecosystem.
        </div>
      </div>
    </div>
  );
}
