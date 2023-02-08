import FirstTransfer from "@/components/FirstTransfer";
import Introduction from "@/components/Introduction";
import PopularTokens from "@/components/PopularTokens";
import TokenTrading from "@/components/TokenTrading";
import Traders from "@/components/Traders";

export default function Home() {
  return (
    <>
      <div>
        <div>
          <Introduction />
          <FirstTransfer />
        </div>
        <div>
          <PopularTokens />
        </div>
        <div>
          <Traders />
          <TokenTrading />
        </div>
        <div className="text-lg w-full mb-12 mx-6">
          <div className="text-2xl font-bold w-full mt-12 mb-6">Conclusion</div>
          GMX's popularity among the Arbitrum community has played a significant
          role in driving the success of Arbitrum. As GMX's trade volume
          continues to grow, so does that of Arbitrum. GMX is among the top two
          dapps within the Arbitrum ecosystem. It is also is the preferred
          platform for new users to initiate their token transfers, contributing
          to a substantial number of first-time transfers on the platform.
        </div>
      </div>
    </>
  );
}
