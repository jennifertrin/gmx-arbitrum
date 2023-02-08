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
        (item: { date: Date; transactions: number }) => {
          gmxDailyTradersLabels.push(item.date.toString());
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
    if (
      gmxDailyTradersLabels.length > 1 &&
      gmxDailyTradersCount.length > 1 &&
      ecosystemDailyTradersLabels.length > 1 &&
      ecosystemDailyTradersCount.length > 1
    ) {
      setData({
        labels: gmxDailyTradersLabels,
        datasets: [
          {
            label: "Number of Transactions",
            data: gmxDailyTradersCount,
            backgroundColor: ["rgb(100, 102, 255)"],
            borderColor: ["rgb(153, 102, 255)"],
            borderWidth: 1,
          },
          {
            label: "Number of Transactions",
            data: ecosystemDailyTradersCount,
            backgroundColor: ["rgb(153, 102, 255)"],
            borderColor: ["rgb(153, 102, 255)"],
            borderWidth: 1,
          },
        ],
        options: {
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        },
      });
    }
  }, [gmxDailyTraders, gmxDailyTradersLabels, gmxDailyTradersCount]);

  return (
    <div className="my-12 mx-16">
      {isLoadingGmxDailyTraders || !data || isLoadingEcosystemDailyTraders ? (
        <Loading />
      ) : (
        <div className="text-center w-full">
          <div className="text-lg w-full mb-12"></div>
          <div className="font-bold text-lg">
            Trading Volume on GMX and Arbitrum By Token
          </div>
          <Bar className="w-1/2 h-1/2" data={data} />
        </div>
      )}
    </div>
  );
}
