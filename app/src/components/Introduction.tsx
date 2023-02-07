import { useEffect, useState } from "react";

export default function Introduction() {
  const [generalStats, setGeneralStats] = useState<any>();

  useEffect(() => {
    fetch("/api/general/stats")
      .then((res) => res.json())
      .then((data) => {
        setGeneralStats(data);
      });
  }, []);

  return (
    <div className="h-screen w-screen">
      <div className="text-5xl font-bold mx-auto w-full ml-4 mt-12">
        GMX Impact on the Arbitrum Ecosystem
      </div>
      <div className="relative overflow-x-auto mt-8">
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
                  <tr>
                    {row.map((item: string) => (
                        <td className="px-6 py-4 font-normal bg-white text-gray-900 whitespace-nowrap dark:text-white">{item}</td>
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
