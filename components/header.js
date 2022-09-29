import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function Header() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    decativareWeb3,
    isWeb3EnableLoading,
  } = useMoralis()

  useEffect(() => {
    if (isWeb3Enabled) return
    if (typeof window != "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3()
      }
    }
  }, [isWeb3Enabled])

  return (
    <div>
      {account ? (
        <div>connected to {account}</div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3()
            if (typeof window != "undefined") {
              window.localStorage.setItem("connected", "injected")
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  )
}
