import { calculatePorcentage } from "@/app/utils";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import ProgressBar from "@/components/ui/ProgressBar";
import { fundAbi } from "@/contracts/abis/fund";
import { walletStarknetkitLatestAtom } from "@/state/connectedWallet";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Contract, wallet, InvokeFunctionResponse } from "starknet";

interface FundVoteProps {
  upVotes: number,
  upVotesNeeded: number,
  addr: string,
}

export const FundVote = ({ upVotes, upVotesNeeded, addr }: FundVoteProps) => {

  const wallet = useAtomValue(walletStarknetkitLatestAtom);

  const progress = calculatePorcentage(upVotes, upVotesNeeded);

  function vote() {
    const fundContract = new Contract(fundAbi, addr, wallet?.account);
    const myCall = fundContract.populate("receiveVote", []);
    wallet?.account?.execute(myCall)
      .then(async (resp: InvokeFunctionResponse) => {
        console.log("increaseBalance txH =", resp.transaction_hash);
      })
      .catch((e: any) => { console.log("error increase balance =", e) });
  }

  return (
    <div className="flex flex-col">
      <ProgressBar progress={progress} />
      <div className="flex justify-center my-2">
        <p className="text-center mx-2">{upVotes.toString()} / {upVotesNeeded.toString()} </p>
        <p>&#127775;</p>
      </div>
      <Button label="Vote" onClick={vote}></Button>
    </div>
  );
};
