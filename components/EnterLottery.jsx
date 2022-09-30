import { contractAddresses, abi } from '../constants'
// const contractAddresses = require('../constants/contractAddresses.json')
// const abi = require('../constants/./abi.json')
import { useWeb3Contract, useMoralis } from 'react-moralis'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useNotification } from 'web3uikit'

export default function EnterLottery() {
  const { chainId: chainIdHex } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const dispatch = useNotification()
  const { isWeb3Enabled } = useMoralis()
  const [entranceFee, setEntranceFee] = useState('0')
  const [numberOfPlayers, setNumberOfPlayers] = useState('0')
  const [recentWinner, setRecentWinner] = useState('0')
  const lotteryAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress, // specify the networkId
    functionName: 'getEntranceFee',
    params: {},
  })

  const {
    runContractFunction: enterLottery,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: 'enterLottery',
    msgValue: entranceFee,
    params: {},
  })
  const { runContractFunction: numberPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: 'numberPlayers',
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: 'getRecentWinner',
    params: {},
  })

  async function updateUIValues() {
    const entranceFeeFromCall = (await getEntranceFee()).toString()
    const numPlayersFromCall = (await numberPlayers()).toString()
    const recentWinnerFromCall = await getRecentWinner()
    setEntranceFee(entranceFeeFromCall)
    setNumberOfPlayers(numPlayersFromCall)
    setRecentWinner(recentWinnerFromCall)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues()
    }
  }, [isWeb3Enabled])

  const handleSuccess = async (tx) => {
    await tx.wait(1)
    handleNewNotification(tx)
    updateUIValues()
  }

  const handleNewNotification = () => {
    dispatch({
      type: 'info',
      message: 'Transaction Complete!',
      title: 'Transaction Notification',
      position: 'topR',
      icon: 'bell',
    })
  }

  return (
    <div>
      {lotteryAddress ? (
        <div className="p-5">
          <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async () => {
              await enterLottery({
                onSuccess: handleSuccess,
              })
            }}
            disbaled={isLoading || isFetching}
          >
            Enter Lottery
          </button>
          <br />
          The entrance fee is : {ethers.utils.formatUnits(
            entranceFee,
            'ether'
          )}{' '}
          ETH
          <br />
          Number of players : {numberOfPlayers}
          <br />
          Recent Winner is : {recentWinner}
        </div>
      ) : (
        <div>No Lottery found!</div>
      )}
    </div>
  )
}
