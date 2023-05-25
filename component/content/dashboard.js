import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../../config'
import { MDBDataTableV5 } from 'mdbreact'
const api = config.api

const Dashboard = () => {
    const [dataMoneyTotal, setDataMoneyTotal] = useState(0)
    const [dataMoneyBetween, setDataMoneyBetween] = useState(0)
    const [dataMoneySuccess, setDataMoneySuccess] = useState(0)

    const [dataProjectTotal, setDataProjectTotal] = useState(0)
    const [dataProjectBetween, setDataProjectBetween] = useState(0)
    const [dataProjectSuccess, setDataProjectSuccess] = useState(0)
    const [dataProjectNot, setDataProjectNot] = useState(0)

    const [datatable, setDatatable] = useState({})

    useEffect(() => {
        getMoneyTotal()
        getMoneyBetween()
        getMoneySuccess()

        getProjectTotal()
        getProjectSuccess()
        getProjectBewteen()
        getProjectNot()

        getList()
    }, [])


    const getMoneyTotal = async () => {
        // activity
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-money-total`, { headers: { "token": token } })
            setDataMoneyTotal(res.data[0].tsum)
        } catch (error) {
            console.log(error)
        }
    }
    const getMoneyBetween = async () => {
        // activity
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-money-between`, { headers: { "token": token } })
            setDataMoneyBetween(res.data[0].tsum)
        } catch (error) {
            console.log(error)
        }
    }
    const getMoneySuccess = async () => {
        // activity
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-money-success`, { headers: { "token": token } })
            setDataMoneySuccess(res.data[0].tsum)
        } catch (error) {
            console.log(error)
        }
    }
    const getProjectTotal = async () => {
        // activity
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-project-total`, { headers: { "token": token } })
            setDataProjectTotal(res.data[0].tcount)
        } catch (error) {
            console.log(error)
        }
    }
    const getProjectSuccess = async () => {
        // activity
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-project-success`, { headers: { "token": token } })
            setDataProjectSuccess(res.data[0].tcount)
        } catch (error) {
            console.log(error)
        }
    }
    const getProjectBewteen = async () => {
        // activity
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-project-between`, { headers: { "token": token } })
            setDataProjectBetween(res.data[0].tcount)
        } catch (error) {
            console.log(error)
        }
    }
    const getProjectNot = async () => {
        // activity
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-project-not`, { headers: { "token": token } })
            setDataProjectNot(res.data[0].tcount)
        } catch (error) {
            console.log(error)
        }
    }

    const columns = [
        {
            label: '#',
            field: 'id',
        },
        {
            label: 'รหัสโครงการ',
            field: 'aph_plan_id',
        },
        {
            label: 'ยุทธศาสตร์กระทรวง',
            field: 'aph_ministry_strategy',
        },
        {
            label: 'สอดคล้องกับนโยบายปลัดกระทรวง',
            field: 'aph_policy',
        },
        {
            label: 'ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข',
            field: 'aph_kpi',
        },
        {
            label: 'กลยุทธ์',
            field: 'aph_strategy',
        },
        {
            label: 'แหล่งงบประมาณ',
            field: 'dt_budget_source',
        },
        // {
        //     label: 'ผลลัพธ์/ผลผลิต',
        //     field: 'aph_result',
        // },
        // {
        //     label: 'โครงการ/กิจกรรม',
        //     field: 'aph_project',
        // },
        // {
        //     label: 'รวมงบประมาณทั้งโครงการ',
        //     field: 'aph_total_budget',
        // },
        // {
        //     label: 'กำหนดระยะเวลาในการดำเนินการ',
        //     field: 'aph_period',
        // },
        // {
        //     label: 'หน่วยงานรับผิดชอบ',
        //     field: 'aph_responsible_agency',
        // },
        {
            label: 'สถานะ',
            field: 'status',
        },
   
    ]

    const getList = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-plan-all`, { headers: { "token": token } })
            console.log(res)
            const dataInfo = []
            res.data.map((item, i) => {
                // console.log(item)

                dataInfo.push(
                    {
                        'id': i + 1,
                        'aph_plan_id': item.aph_plan_id,
                        'aph_ministry_strategy': item.exc4,
                        'aph_policy': item.plan2,
                        'aph_kpi': item.indicator,
                        'aph_strategy': item.plan1,
                        'aph_result': item.aph_result,
                        'aph_project': item.project,
                        'aph_total_budget': item.aph_total_budget,
                        'aph_period': item.aph_period,
                        'aph_responsible_agency': item.aph_responsible_agency,
                        'dt_budget_source': item.dt_budget_source,
                        'status': (<><span className='badge badge-primary' style={{ fontSize : 13 }} >{item.aph_status == '1' ? 'ผ่านอนุมัติแผน' : item.aph_status == '2' ? 'ผ่านอนุมัติโครงการ' : item.aph_status == '3' ? 'สรุปโครงการ' : item.aph_status == '4' ? 'จบโครงการ' : item.aph_status == '9' ? 'ไม่ผ่าน' : 'รออนุมัติ'}</span></>),
                        'action': (
                            <>
                                <div className="btn-group">
                                    <button type="button" className='btn btn-info btn-sm' onClick={() => showModalOpenPlanById(item.id)}>
                                        <i className='fas fa-eye' />
                                    </button>
                                </div>
                            </>
                        )
                    }
                )
            })

            setDatatable(
                {
                    columns: columns,
                    rows: dataInfo
                }
            )
        } catch (error) {
            console.log(error)
            // toast.error('เกิดข้อผิดพลาด')
        }
    }


    return (
        <div>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0">หน้าแรก</h1>
                        </div>

                    </div>
                </div>
            </div>

            <div className='ml-5 mr-5'>
                <div class="row">
                    <div className="col-lg-6 connectedSortable ui-sortable">
                        <div className="card">
                            <div className="card-header ui-sortable-handle" style={{ cursor: 'move' }}>
                                <h3 className="card-title">
                                    <i className="fas fa-chart-pie mr-1" />
                                    จำนวนเงิน
                                </h3>

                            </div>
                            <div className="card-body">
                                <div className="tab-content p-0">
                                    <div className='row'>
                                        <div className="col-lg-12 col-6">
                                            <div className="small-box bg-info">
                                                <div className="inner">
                                                    <h3>{dataMoneyTotal == null ? 0 : dataMoneyTotal.toLocaleString()}</h3>
                                                    <p>งบประมาณทั้งหมด (บาท)</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="ion ion-bag" />
                                                </div>
                                                <a href="#" className="small-box-footer"></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-6">
                                            <div className="small-box bg-success">
                                                <div className="inner">
                                                    <h3>{dataMoneySuccess == null ? 0 : dataMoneySuccess.toLocaleString()}</h3>
                                                    <p>เบิกจ่าย+ใช้จ่าย (บาท)</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="ion ion-bag" />
                                                </div>
                                                <a href="#" className="small-box-footer"></a>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="small-box bg-warning">
                                                <div className="inner">
                                                    <h3>{dataMoneyBetween == null ? 0 : dataMoneyBetween.toLocaleString()}</h3>
                                                    <p>คงเหลือ (บาท)</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="ion ion-bag" />
                                                </div>
                                                <a href="#" className="small-box-footer"></a>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 connectedSortable ui-sortable">
                        <div className="card">
                            <div className="card-header ui-sortable-handle" style={{ cursor: 'move' }}>
                                <h3 className="card-title">
                                    <i className="fas fa-chart-pie mr-1" />
                                    จำนวนโครงการ
                                </h3>

                            </div>
                            <div className="card-body">
                                <div className="tab-content p-0">
                                    <div className='row'>
                                        <div className="col-lg-12 col-6">
                                            <div className="small-box bg-danger">
                                                <div className="inner">
                                                    <h3>{dataProjectTotal}</h3>
                                                    <p>โครงการทั้งหมด</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="ion ion-bag" />
                                                </div>
                                                <a href="#" className="small-box-footer"></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-4">
                                            <div className="small-box bg-success">
                                                <div className="inner">
                                                    <h3>{dataProjectSuccess}</h3>
                                                    <p>ดำเนินการแล้ว</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="ion ion-bag" />
                                                </div>
                                                <a href="#" className="small-box-footer"></a>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="small-box bg-warning">
                                                <div className="inner">
                                                    <h3>{dataProjectBetween}</h3>
                                                    <p>อยู่ระหว่างดำเนินการ</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="ion ion-bag" />
                                                </div>
                                                <a href="#" className="small-box-footer"></a>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="small-box bg-info">
                                                <div className="inner">
                                                    <h3>{dataProjectNot}</h3>
                                                    <p>ยังไม่ได้ดำเนินการ</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="ion ion-bag" />
                                                </div>
                                                <a href="#" className="small-box-footer"></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='ml-5 mr-5'>
                <div class="row">
                    <div className="card card-warning">
                        <div className='card-body p-0'>
                            <div className="table-responsive-lg">
                                <MDBDataTableV5 hover entriesOptions={[10, 20, 30, 40, 50]} entries={10} pagesAmount={4} data={datatable} fullPagination />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard