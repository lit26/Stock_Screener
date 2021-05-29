import React from 'react'
import './Screenertable.css'
import Datacell from './Datacell'
import {ArrowDownward, ArrowUpward} from '@material-ui/icons';

function Screenertable({screenerData, order, ascend, orderClick}) {
    return (
        <div className="Screenertable">
            <table><tbody>
            {/* Header */}
            <tr className="Screenertable__header">
                <th className={`Screenertable__col w-34`}>No.</th>
                {screenerData['header'].map((header, index)=>{
                    return (
                        <th key={header} 
                            className={`Screenertable__col w-100`} 
                            onClick={()=>orderClick(header)}>
                            <span>{header}</span>
                            {order === header && (ascend?<ArrowUpward />:<ArrowDownward/>)}
                        </th>)
                })}
            </tr>
            {/* Table */}
            {screenerData['data'].map((data, index)=>{
                return (
                    <tr key={`row_${index}`} className="Screenertable__cell">
                        <td className={`Screenertable__col w-34`}>{index+1}</td>
                        {screenerData['header'].map((header2, index2)=>{
                            return (
                                <td key={`Cell_${index}${index2}`} className={`Screenertable__col w-100`}>
                                    <Datacell lebel={header2} data={data[header2]} />
                                </td>)
                        })}
                    </tr>
                )
            })}
            </tbody></table>
        </div>
    )
}

export default Screenertable
