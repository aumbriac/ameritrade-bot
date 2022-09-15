import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { schedule } from 'node-cron'
import { readFileSync, writeFileSync } from 'fs'
import { sortByKey } from './functions/sortByKey.js'
import { isMarketOpen } from './functions/isMarketOpen.js'
import { formatNumber } from './functions/formatNumber.js'
import AmeritradeAPI from './classes/AmeritradeAPI.js'

const app = express()
dotenv.config()

app.use(cors())

app.listen(3333, () => {
    console.log(`Server running on port 3333`)
})

schedule('20 * * * *', async () => {

    if (isMarketOpen()){
        const Ameritrade = new AmeritradeAPI()
        const getTopMoversResult = await Ameritrade.getTopMovers()
        const date = new Date()
        const articles = []

        let data = [
            ...getTopMoversResult[0], 
            ...getTopMoversResult[1], 
            ...getTopMoversResult[2], 
            ...getTopMoversResult[3], 
            ...getTopMoversResult[4], 
            ...getTopMoversResult[5]
        ]
        data = sortByKey(data, "change").reverse()
        data = data.filter((v, i, a) => a.findIndex(v2 => (v2.symbol === v.symbol)) === i)
    
        await Promise.all(data.map(({
            change,
            description,
            direction,
            last,
            symbol,
            totalVolume
        }) => {
            const json = { 
                symbol, 
                description, 
                change, 
                direction, 
                last, 
                totalVolume, 
                timestamp: `${date.getFullYear()}-${date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}T${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}`, 
                body: `On ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}, ${description.split('-')[0].trim()} (${symbol}) was ${direction} $${Math.abs(change).toFixed(2)} trading at $${last.toFixed(2)} with ${formatNumber(totalVolume)} shares changing hands for the trading day.`.trim()}
            articles.push(json)
        }))
        let fileData = []
        try {
            fileData = JSON.parse(readFileSync('./articles.json')) || []
            fileData.push(articles)
            writeFileSync('./articles.json', JSON.stringify(fileData))
        } catch (err) {
            console.error(err)
            writeFileSync('./articles.json', JSON.stringify([articles]))
        }
    }
})

app.get('/getMovers', async (req, res) => {
    let fileData = []
    try {
        fileData = JSON.parse(readFileSync('./articles.json')) || []
    } catch (err) {}
    res.send(fileData.reverse())
    }
)