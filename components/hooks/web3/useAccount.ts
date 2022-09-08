import useSWR from "swr";
import {CryptoHookFactory} from "@_types/hooks";

type AccountHookFactory = CryptoHookFactory<string, string>

export type UseAccountHook = ReturnType<AccountHookFactory>
export const hookFactory: AccountHookFactory = (deps) => (params) => {
    const swrRes = useSWR("web3/useAccount", () => {
        console.log(deps)
        console.log(params)
        return "Test User"
    })
    return swrRes;
}

