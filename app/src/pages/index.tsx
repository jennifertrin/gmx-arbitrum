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
        </div>
        <div>
         <PopularTokens />
        </div>
        <div>
        <Traders />
        <TokenTrading />
        </div>
      </div>
    </>
  );
}
