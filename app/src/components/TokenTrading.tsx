import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Loading from "./Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Traders() {
  //TO-DO: Componetize Traders and Token Trader components
  const [gmxDailyTraders, setGmxDailyTraders] = useState<any>();
  const [isLoadingGmxDailyTraders, setIsLoadingGmxDailyTraders] =
    useState<boolean>(false);
  const [ecosystemDailyTraders, setEcosystemDailyTraders] = useState<any>();
  const [isLoadingEcosystemDailyTraders, setIsLoadingEcosystemDailyTraders] =
    useState<boolean>(false);
  const [data, setData] = useState<any>();
  let gmxDailyTradersLabels: string[] = [];
  let gmxDailyTradersCount: number[] = [];
  let ecosystemDailyTradersLabels: string[] = [];
  let ecosystemDailyTradersCount: number[] = [];

  //TO-DO: Create utility function for fetch api
  useEffect(() => {
    setIsLoadingGmxDailyTraders(true);
    fetch("/api/trading/transactions_gmx_tokens")
      .then((res) => res.json())
      .then((data) => {
        setGmxDailyTraders(data);
        setIsLoadingGmxDailyTraders(false);
      });
  }, [setGmxDailyTraders, setIsLoadingGmxDailyTraders]);

  useEffect(() => {
    setIsLoadingEcosystemDailyTraders(true);
    fetch("/api/trading/transactions_tokens")
      .then((res) => res.json())
      .then((data) => {
        setEcosystemDailyTraders(data);
        setIsLoadingEcosystemDailyTraders(false);
      });
  }, [setIsLoadingEcosystemDailyTraders, setEcosystemDailyTraders]);

  useEffect(() => {
    if (gmxDailyTraders) {
      gmxDailyTraders.result.records.forEach(
        (item: { token_symbol: string; date: Date; transactions: number }) => {
          gmxDailyTradersLabels.push(
            item.date.toString().replace("00:00:00", "") +
              "- " +
              item.token_symbol
          );
          gmxDailyTradersCount.push(item.transactions);
        }
      );
    }
    if (ecosystemDailyTraders) {
      ecosystemDailyTraders.result.records.forEach(
        (item: { date: Date; transactions: number }) => {
          ecosystemDailyTradersLabels.push(item.date.toString());
          ecosystemDailyTradersCount.push(item.transactions);
        }
      );
    }
    //TO-DO: Find a better workaround than random length number
    if (
      gmxDailyTradersLabels.length > 10 &&
      gmxDailyTradersCount.length > 10 &&
      ecosystemDailyTradersLabels.length > 10 &&
      ecosystemDailyTradersCount.length > 10
    ) {
      setData({
        labels: gmxDailyTradersLabels,
        datasets: [
          {
            label: "Number of Transactions on GMX",
            data: gmxDailyTradersCount,
            backgroundColor: ["rgb(100, 102, 255)"],
            borderColor: ["rgb(100, 102, 255)"],
            borderWidth: 10,
            type: "bar",
          },
          {
            label: "Number of Transactions on Arbitrum",
            data: ecosystemDailyTradersCount,
            backgroundColor: ["rgb(153, 102, 255)"],
            borderColor: ["rgb(153, 102, 255)"],
            borderWidth: 1,
            type: "bar",
          },
        ],
      });
    }
  }, [
    gmxDailyTraders,
    ecosystemDailyTraders,
    ecosystemDailyTradersLabels,
    ecosystemDailyTradersCount,
    gmxDailyTradersLabels,
    gmxDailyTradersCount,
  ]);

  let options = {
    responsive: true,
    scales: {
      y: {
        min: 10,
        max: 2500000,
      },
    },
  };

  return (
    <div className="my-12 mx-16">
      {isLoadingGmxDailyTraders || !data || isLoadingEcosystemDailyTraders ? (
        <Loading />
      ) : (
        <div className="text-center w-full">
          <div className="text-lg w-full mb-12">
            GMX.io supports trades of WETH (#1 most popular token on Arbitrum),
            USDC (#2), USDT (#3), LINK (#18), FRAX, and UNI. 
            While market dominance is not necessarily linked, GMX.io has been responsible for the majority of trades in certain tokens during certain months.
          </div>
          <div className="font-bold text-lg">
            Monthly Transactions on GMX and Arbitrum (By Token)
          </div>
          <Bar className="w-1/2 h-1/2" data={data} options={options} />
        </div>
      )}
    </div>
  );
}
