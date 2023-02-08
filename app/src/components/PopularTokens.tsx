import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function PopularTokens() {
  const [generalStats, setGeneralStats] = useState<any>();
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingStats(true);
    fetch("/api/general/popular")
      .then((res) => res.json())
      .then((data) => {
        setGeneralStats(data);
        setIsLoadingStats(false);
      });
  }, []);

  return (
    <div className="mx-12 mb-12">
      <div className="text-2xl font-bold w-full mt-12">
        Most Popular Tokens in the Arbitrum Ecosystem
      </div>
      <div className="text-lg w-full mt-12">
        GMX.io has a utility and governance token named GMX. Staking GMX tokens
        on GMX.io platform earns users Staked, Bonus, and Fee GMX or sbfGMX
        tokens. Tracking the usage of both GMX and sbfGMX provides insight into
        the platform's popularity. To learn more about GMX.io's rewards program,
        please review{" "}
        <a
          href="https://gmxio.gitbook.io/gmx/tokenomics"
          className="text-blue-700 underline"
        >
          their docs
        </a>
        .
      </div>
      <div className="text-lg w-full mt-12">
        GMX token is ranked as the 6th most cumulatively traded token in the
        Arbitrum ecosystem. sbfGMX is ranked as the 22nd most cumulatively
        traded token in the Arbitrum ecosystem. Ecosystem token distribution
        suggests that GMX is the second most popular governance token, behind
        MAGIC. It also suggests that GMX.io is one of the most popular dapps
        with tokens, behind Treasure (creator of MAGIC).
      </div>
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
                <tr
                  key={row}
                  className={` ${
                    row.includes(
                      "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a"
                    ) ||
                    row.includes("0xd2d1162512f927a7e282ef43a362659e4f2a728f")
                      ? "font-bolder text-xl"
                      : "font-normal text-xs"
                  }`}
                >
                  {row.map((item: string) => (
                    <td
                      key={item}
                      className="px-6 py-4 font-normal  bg-white text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}
