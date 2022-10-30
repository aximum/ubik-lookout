import axios from 'axios';
import useSWR from 'swr';

interface PerformanceSample {
  numSlots: number
  numTransactions: number
  samplePeriodSecs: number
  slot: number
}

export const fetchPerformanceSample = async (): Promise<PerformanceSample> => {
  try {
    const res = await axios({
      url: process.env.REACT_APP_API_ADDRESS as string,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        jsonrpc: '2.0',
        id: 1,
        method: 'getRecentPerformanceSamples',
        params: [1],
      },
    })
    if (res?.status === 200) {
      return res?.data?.result[0]
    }
  } catch (error) {
    console.log(error)
  }
  return {
    numSlots: NaN,
    numTransactions: NaN,
    samplePeriodSecs: NaN,
    slot: NaN
};
}

export const useTPS = (): number => {
  const { data, error } = useSWR(
    ['fetchPerformanceSample'],
    fetchPerformanceSample,
    {
      refreshInterval: 20000,
    },
  )

  if (!data || error) {
    return 0
  }

  const { numTransactions, samplePeriodSecs } = data
  return Math.floor(numTransactions / samplePeriodSecs)
}