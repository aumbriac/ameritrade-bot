export default function TableBody({ direction, symbol, last, totalVolume, change }){
    return  <tr key={symbol}>
                <td style={{fontWeight: 600}}>{symbol}</td>
                <td>${last.toFixed(2)}</td>
                <td style={{color: direction === "up" ? "green" : "red"}}>${change.toFixed(2)}</td>
                <td>{totalVolume}</td>
            </tr>
}