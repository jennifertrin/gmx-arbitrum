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
  const [ecosystemData, setEcosystemData] = useState<any>();
  let gmxDailyTradersLabels: string[] = [];
  let gmxDailyTradersCount: number[] = [];
  let ecosystemDailyTradersLabels: string[] = [];
  let ecosystemDailyTradersCount: number[] = [];

  useEffect(() => {
    setIsLoadingGmxDailyTraders(true);
    fetch("/api/trading/transactions_gmx")
      .then((res) => res.json())
      .then((data) => {
        setGmxDailyTraders(data);
        setIsLoadingGmxDailyTraders(false);
      });
  }, [setGmxDailyTraders, setIsLoadingGmxDailyTraders]);

  useEffect(() => {
    if (gmxDailyTraders) {
      gmxDailyTraders.result.records.forEach(
        (item: { date: Date; transactions: number }) => {
          gmxDailyTradersLabels.push(item.date.toString());
          gmxDailyTradersCount.push(item.transactions);
        }
      );
    }
    if (gmxDailyTradersLabels.length > 10 && gmxDailyTradersCount.length > 10) {
      setData({
        labels: gmxDailyTradersLabels,
        datasets: [
          {
            label: "Number of Transactions",
            data: gmxDailyTradersCount,
            backgroundColor: ["rgb(153, 102, 255)"],
            borderColor: ["rgb(153, 102, 255)"],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [gmxDailyTraders, gmxDailyTradersLabels, gmxDailyTradersCount]);

  useEffect(() => {
    setIsLoadingEcosystemDailyTraders(true);
    fetch("/api/trading/transactions_ecosystem")
      .then((res) => res.json())
      .then((data) => {
        setEcosystemDailyTraders(data);
        setIsLoadingEcosystemDailyTraders(false);
      });
  }, [setIsLoadingEcosystemDailyTraders, setEcosystemDailyTraders]);

  useEffect(() => {
    if (ecosystemDailyTraders) {
      ecosystemDailyTraders.result.records.forEach(
        (item: { date: Date; transactions: number }) => {
          ecosystemDailyTradersLabels.push(item.date.toString());
          ecosystemDailyTradersCount.push(item.transactions);
        }
      );
    }
    if (
      ecosystemDailyTradersLabels.length > 10 &&
      ecosystemDailyTradersCount.length > 10
    ) {
      setEcosystemData({
        labels: ecosystemDailyTradersLabels,
        datasets: [
          {
            label: "Number of Transactions",
            data: ecosystemDailyTradersCount,
            backgroundColor: ["rgb(153, 102, 255)"],
            borderColor: ["rgb(153, 102, 255)"],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [
    ecosystemDailyTraders,
    ecosystemDailyTradersLabels,
    ecosystemDailyTradersCount,
  ]);

  return (
    <div className="my-12 mx-16">
      {isLoadingGmxDailyTraders || !data ? (
        <Loading />
      ) : (
        <div className="text-center w-full">
          <div className="text-lg w-full mb-12">
            GMX.io accounts for a small portion of the transactions on Arbitrum. 
            The growth of GMX.io in terms of transaction volume has correspondingly led to an increase in
            activity on Arbitrum.
          </div>
          <div className="font-bold text-lg">
            Daily Number of Transactions on GMX.io
          </div>
          <Bar className="w-1/2 h-1/2" data={data} />
        </div>
      )}
      {isLoadingEcosystemDailyTraders || !ecosystemData ? (
        <Loading />
      ) : (
        <div className="text-center w-full mt-12">
          <div className="font-bold text-lg">
            Daily Number of All Arbitrum Transactions
          </div>
          <Bar className="w-1/2 h-1/2" data={ecosystemData} />
        </div>
      )}
    </div>
  );
}
