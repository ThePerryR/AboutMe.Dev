"use client";

import React, { useEffect } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";

const Activity = () => {
  const [sdk, setSDK] = React.useState<DiscordSDK | null>(null);
  useEffect(() => {
    async function init() {
      const dsdk = new DiscordSDK(process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!);
      await dsdk.ready();
      setSDK(dsdk)
    }
    void init();
  }, []);
  if (!sdk) {
    return <div>Loading...</div>;
  }
  return <div>Discord SDK has been loaded</div>;
};

export default Activity;
