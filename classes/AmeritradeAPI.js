import axios from 'axios'

export default class AmeritradeAPI {
    constructor(){
        this.params = {
            indexes: [
                "$DJI", "$COMPX", "$SPX.X"
            ],
            directions: [
                "up", "down"
            ],
            change: [
                "percent", "value"
            ]
        }
    }
    async getTopMovers(){
        const topMovers = []
        const promises = []
        this.params.directions.map((direction) => {
            this.params.indexes.map((index, idx) => {
                promises.push(axios.get(`https://api.tdameritrade.com/v1/marketdata/${index}/movers?apikey=3Q73HVQLSGDSNEBJJ161LX7MTMSGGHGZ&direction=${direction}&change=value`, {
                    headers: {
                        Authorization: `Bearer ${process.env.API_KEY}`
                    }
                }).then(({ data }) => {
                    topMovers.push(data)
                })
                .catch(err => console.error(err))
                )      
            })
        })
        await Promise.all(promises)
        return topMovers
    }
}