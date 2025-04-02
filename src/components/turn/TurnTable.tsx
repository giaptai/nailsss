
import { WindowModel } from '../../models/category/Window.model';
import WtcEmployee from '../commons/WtcEmployee';
import BlockTable from './BlockTable';
import employee1 from '../../assets/images/avatar.jpg'
import { getNowDay } from '../../const';
export default function TurnTable() {
    const tableData = [
        {
            staff: {
                name: 'Jessi',
                image: employee1,
                score: 6.3
            },
            turns: [
                {
                    turnClass: 'half',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: '',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
            ]
        },
        {
            staff: {
                name: 'Jessi',
                image: employee1,
                score: 6.3
            },
            turns: [
                {
                    turnClass: 'half',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: '',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
            ]
        },
        {
            staff: {
                name: 'Jessi',
                image: employee1,
                score: 6.3
            },
            turns: [
                {
                    turnClass: 'half',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: '',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
            ]
        },
        {
            staff: {
                name: 'Jessi',
                image: employee1,
                score: 6.3
            },
            turns: [
                {
                    turnClass: 'half',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: '',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
            ]
        },
        {
            staff: {
                name: 'Jessi',
                image: employee1,
                score: 6.3
            },
            turns: [
                {
                    turnClass: 'half',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: '',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
            ]
        },
        {
            staff: {
                name: 'Jessi',
                image: employee1,
                score: 6.3
            },
            turns: [
                {
                    turnClass: 'half',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: '',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
            ]
        },
        {
            staff: {
                name: 'Jessi',
                image: employee1,
                score: 6.3
            },
            turns: [
                {
                    turnClass: 'half',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: '',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
            ]
        },
        {
            staff: {
                name: 'Jessi',
                image: employee1,
                score: 6.3
            },
            turns: [
                {
                    turnClass: 'half',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: '',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
            ]
        },
        {
            staff: {
                name: 'Jessi',
                image: employee1,
                score: 6.3
            },
            turns: [
                {
                    turnClass: 'half',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: '',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
            ]
        },
        {
            staff: {
                name: 'Jessi',
                image: employee1,
                score: 6.3
            },
            turns: [
                {
                    turnClass: 'half',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: '',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: 'half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'MATCH',
                    middleClass: 'blue'
                },
                {
                    turnClass: 'half red',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                },
                {
                    turnClass: '',
                    topLeft: '',
                    rightBottom: '',
                    middle: 'SKIP',
                    middleClass: 'red'
                },
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
                ,
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
                ,
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
                ,
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
                ,
                {
                    turnClass: ' half purple',
                    topLeft: 'NAIL',
                    rightBottom: 'NAIL',
                    middle: '',
                    middleClass: ''
                }
            ]
        }
    ]

    return (
        <table className="table table-bordered turn-table table-responsive">
            <thead>
                {/* <div className="backdrop"></div> */}
                <tr>
                    <th scope="col" style={{textAlign:'center'}}>{getNowDay()}</th>
                    <th scope="col" className="text-center">1</th>
                    <th scope="col" className="text-center">2</th>
                    <th scope="col" className="text-center">3</th>
                    <th scope="col" className="text-center">4</th>
                    <th scope="col" className="text-center">5</th>
                    <th scope="col" className="text-center">6</th>
                    <th scope="col" className="text-center">7</th>
                    <th scope="col" className="text-center">8</th>
                    <th scope="col" className="text-center">9</th>
                    <th scope="col" className="text-center">10</th>
                    <th scope="col" className="text-center">11</th>
                    <th scope="col" className="text-center">12</th>
                    <th scope="col" className="text-center">13</th>
                    <th scope="col" className="text-center">14</th>
                    <th scope="col" className="text-center">15</th>
                </tr>
            </thead>
            <tbody>
                {
                    tableData.map((data, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    <WtcEmployee 
                                        info={{_id: '',
                                            code: '',
                                            firstName: data.staff.name,
                                            lastName: '',
                                            middleName: '',
                                            phone: data.staff.score.toString(),
                                            address: '',
                                            email: '',
                                            gender: '',
                                            avatar: data.staff.image,
                                            language: '',
                                            userId: '',
                                            roleId: '',
                                            username: '',
                                            street1: '',
                                            street2: '',
                                            state: '',
                                            city: '',
                                            zipcode: '',
                                            emergencyContactName: '',
                                            emergencyContactPhone: '',
                                            openDraw: '',
                                            selfGiftCard: '',
                                            paymentType: '',
                                            paymentValue: 0,
                                            compensation: 0,
                                            checkAndBonus: 0,
                                            check: 0,
                                            color:'#283673',
                                            positionWindow:WindowModel.initial(),
                                            positionPoint: 0}}
                                        className='employee'
                                    />
                                </td>
                                {
                                    data.turns.map((turn, indexT) => {
                                        return (
                                            <td className='td-hover-turn' key={indexT}>
                                                <BlockTable 
                                                    classBlock={turn.turnClass}
                                                    topLeft={turn.topLeft}
                                                    rightBottom={turn.rightBottom}
                                                    middle={turn.middle}
                                                    middleClass={turn.middleClass}
                                                />
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}