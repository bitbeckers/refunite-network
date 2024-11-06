"use client";
import { UserRejectedRequestError } from "viem";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { sepolia } from "wagmi/chains";

import { Button } from "@/components/ui/button";

export default function ConnectPanel() {
  const { connect, error, isError, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const account = useAccount();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    const silkConnector = connectors.find((connector) => connector.id === "silk");
    if (!silkConnector) {
      console.error("Silk connector not found in wagmi config");
      return;
    }

    try {
      connect({ chainId: sepolia.id, connector: silkConnector });
    } catch (error) {
      console.error("Error connecting to Silk:", error);
      if (error instanceof UserRejectedRequestError) console.log("User aborted the transaction");
    }
  };

  return (
    <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      {!account.address ? (
        <Button onClick={handleConnect}>Connect</Button>
      ) : (
        <div className="flex items-center gap-2">
          <span>{formatAddress(account.address)}</span>
          <Button onClick={() => disconnect()}>Disconnect</Button>
        </div>
      )}
      {isError && error.message && <div className="text-red-500">{error.message}</div>}
    </div>
  );
}
