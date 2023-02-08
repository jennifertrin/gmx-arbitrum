import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function PopularTokens() {
  const [generalStats, setGeneralStats] = useState<any>();
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingStats(true);
    fetch("/api/general/first_transfer")
      .then((res) => res.json())
      .then((data) => {
        setGeneralStats(data);
        setIsLoadingStats(false);
      });
  }, []);

  return (
    <div className="mx-12 mb-12">
      <div className="text-2xl font-bold w-full mt-6">Onboarding New Users</div>
      <div className="text-lg w-full mt-6">
        This graph displays the number of users and the time difference between
        their first transfer on Arbitrum and their first transfer on GMX.io. The
        data is arranged in descending order based on the highest number of
        users per time difference, indicating that a significant number of
        Arbitrum users have initiated their token transfers on GMX.io first.
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
                <tr key={row}>
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
