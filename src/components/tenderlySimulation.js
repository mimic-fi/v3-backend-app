import axios from 'axios'

export const simulateTransaction = async (chainId, blockNumber, callData, task, setSimulation) => {
  const TENDERLY_ACCOUNT_SLUG = process.env.REACT_APP_TENDERLY_ACCOUNT_SLUG;
  const TENDERLY_PROJECT_SLUG = process.env.REACT_APP_TENDERLY_PROJECT_SLUG;
  const TENDERLY_ACCESS_KEY = process.env.REACT_APP_TENDERLY_ACCESS_KEY;
  const RELAYER_ADDRESS = '0xD7252C026c3cA28D73B4DeeF62FE6ADe86eC17A9'

  setSimulation({ status: 'simulating', simulation: null })

  const GAS_PER_CHAIN = {
    '1': 200000000000, //200gwei
    '137': 200000000000,
    '10': 200000000000,
    '56': 200000000000,
    '42161': 200000000000,
    '43114': 200000000000,
    '8453': 200000000000,
    '250': 200000000000,
  }


  const { data: simulationData } = await axios.post(
    `https://api.tenderly.co/api/v1/account/${TENDERLY_ACCOUNT_SLUG}/project/${TENDERLY_PROJECT_SLUG}/simulate`,
    {
      network_id: chainId,
      block_number: blockNumber,
      from: RELAYER_ADDRESS,
      to: task,
      gas: 8000000,
      gas_price: GAS_PER_CHAIN[chainId],
      value: 0,
      input: callData,
      simulation_type: 'full', //quick
      save: true,
      state_objects: { //state_overrides
        [RELAYER_ADDRESS]: {
          balance: '100000000000000000000'
        }
      }
    },
    {
      headers: {
        'X-Access-Key': TENDERLY_ACCESS_KEY
      },
    },
  )


  setSimulation({ status: 'done', simulation: simulationData })

  const { data: sharedData } = await axios.post(
    // eslint-disable-next-line max-len
    `https://api.tenderly.co/api/v1/account/${TENDERLY_ACCOUNT_SLUG}/project/${TENDERLY_PROJECT_SLUG}/simulations/${simulationData?.simulation?.id}/share`,
    {},
    {
      headers: {
        'X-Access-Key': TENDERLY_ACCESS_KEY,
        'Content-Type': 'application/json',
      },
    },
  )

  console.log(`https://www.tdly.co/shared/simulation/${simulationData?.simulation?.id}`)





}