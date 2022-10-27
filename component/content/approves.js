import { MDBDataTableV5 } from 'mdbreact'
import React, { useEffect, useState } from 'react'
import { Modal, Popconfirm } from 'antd'
import axios from 'axios'
import config from '../../config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'

const api = config.api

const Approve = (data) => {

    const router = useRouter()

    // ---------------------------------------------------------------------------------------------------- START DATATABLE
    const [datatable, setDatatable] = React.useState({})
    const [FormPlanById, setFormPlanById] = useState({ ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '' })
    const [formDiscuss, setFormDiscuss] = useState({ username: '', id: '', status: '', note: '' })
    const [openPlanById, setopenPlanById] = useState(false)
    const [openTimeline, setOpenTimeline] = useState(false)
    // ---------------------------------------------------------------------------------------------------- START GET DATA DETAIL
    const [dataActivityARR, setDataActivityARR] = useState([])
    const [dataPSIARR, setDataPSIARR] = useState([])
    const [dataTargetARR, setDataTargetARR] = useState([])
    const [dataBSARR, setDataBSARR] = useState([])
    const [dataBUDARR, setDataBUDARR] = useState([])

    useEffect(() => {
        if (data.data.status != '99') {
            router.push({
                pathname: '/main',
                query: {
                    path: 'dashboard',
                    error: 'AccessDenied'
                },
            })
        }
        getList()
    }, [])


    // ------------------------------------------------------------------------------------------------------------------------------------------- START GET DATA DETAIL
    const getActivity = async (id) => {
        // activity
        try {
            const token = localStorage.getItem('token')
            const resActivity = await axios.get(`${api}/get-activity-by-id/${id}`, { headers: { "token": token } })
            setDataActivityARR(resActivity.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getPSI = async (id) => {
        // project-success-indicator
        try {
            const token = localStorage.getItem('token')
            const resPSI = await axios.get(`${api}/get-project-success-indicator-by-id/${id}`, { headers: { "token": token } })
            setDataPSIARR(resPSI.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getTarget = async (id) => {
        // target
        try {
            const token = localStorage.getItem('token')
            const resTarget = await axios.get(`${api}/get-target-by-id/${id}`, { headers: { "token": token } })
            setDataTargetARR(resTarget.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getBS = async (id) => {
        // budget-source
        try {
            const token = localStorage.getItem('token')
            const resBS = await axios.get(`${api}/get-budget-source-by-id/${id}`, { headers: { "token": token } })
            setDataBSARR(resBS.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getBUD = async (id) => {
        // budget-usage-detail
        try {
            const token = localStorage.getItem('token')
            const resBUD = await axios.get(`${api}/get-budget-usage-detail-by-id/${id}`, { headers: { "token": token } })
            setDataBUDARR(resBUD.data)
        } catch (error) {
            console.log(error)
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------- END GET DATA DETAIL



    const columns = [
        {
            label: '#',
            field: 'id',
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
            label: 'ผลลัพธ์/ผลผลิต',
            field: 'aph_result',
        },
        {
            label: 'โครงการ/กิจกรรม',
            field: 'aph_project',
        },
        {
            label: 'รวมงบประมาณทั้งโครงการ',
            field: 'aph_total_budget',
        },
        {
            label: 'กำหนดระยะเวลาในการดำเนินการ',
            field: 'aph_period',
        },
        {
            label: 'หน่วยงานรับผิดชอบ',
            field: 'aph_responsible_agency',
        },
        {
            label: 'สถานะ',
            field: 'status',
        },
        {
            label: 'จัดการ',
            field: 'action',
        },
    ]

    // pull
    //---------------------------------------------------------------------------------------------------------------------------- START GET DATA
    const getList = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-plan-all`, { headers: { "token": token } })
            // console.log(res)
            const dataInfo = []
            res.data.map((item, i) => {
                // console.log(item)
                dataInfo.push(
                    {
                        'id': i + 1,
                        'aph_ministry_strategy': item.aph_ministry_strategy,
                        'aph_policy': item.aph_policy,
                        'aph_kpi': item.aph_kpi,
                        'aph_strategy': item.aph_strategy,
                        'aph_result': item.aph_result,
                        'aph_project': item.aph_project,
                        'aph_total_budget': item.aph_total_budget,
                        'aph_period': item.aph_period,
                        'aph_responsible_agency': item.aph_responsible_agency,
                        'status': (<><a onClick={() => showModalOpenTimeline(item.id)}>{item.aph_status == '1' ? 'ผ่านขั้นที่ 1' : item.aph_status == '2' ? 'ผ่านขั้นที่ 2' : item.aph_status == '3' ? 'ผ่านขั้นที่ 3' : item.aph_status == '4' ? 'จบโครงการ' : item.aph_status == '9' ? 'ไม่ผ่าน' : 'รออนุมัติ'}</a></>),
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
    //---------------------------------------------------------------------------------------------------------------------------- END GET DATA


    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL PLAN BY ID
    const showModalOpenPlanById = async (id) => {
        setopenPlanById(true)
        // console.log(id)
        setFormDiscuss({
            ...formDiscuss,
            username: data.data.username,
            id: id
        })
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-plan-by-id/${id}`, { headers: { "token": token } })
            // console.log(res.data)
            res.data.map((item, i) => {
                // console.log(item)
                setFormPlanById({
                    ...FormPlanById,
                    ministry_strategy: item.aph_ministry_strategy,
                    policy: item.aph_policy,
                    kpi: item.aph_kpi,
                    strategy: item.aph_strategy,
                    result: item.aph_result,
                    project: item.aph_project,
                    total_budget: item.aph_total_budget,
                    period: item.aph_period,
                    responsible_agency: item.aph_responsible_agency
                })
            })

        } catch (error) {
            console.log(error)
        }

        getActivity(id)
        getPSI(id)
        getTarget(id)
        getBS(id)
        getBUD(id)
    }

    const handleOkOpenPlanById = () => {
        setopenPlanById(false)
        console.log(formDiscuss)
    }
    const handleCancelOpenPlanById = () => {
        setopenPlanById(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL PLAN BY ID

    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL TIMELINE
    const showModalOpenTimeline = async (id) => {
        // console.log(id)
        setOpenTimeline(true)
    }

    const handleCancelOpenTimeline = () => {
        setOpenTimeline(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL TIMELINE


    return (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={2500}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={true}
                draggable={true}
                pauseOnHover={true}
                // transition={Flip}
                theme={'colored'}
            />
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0">งานประกัน</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">หน้าแรก</li>
                                <li className="breadcrumb-item">งานประกัน</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">

                    <div className="card card-warning">
                        <div className='card-body'>
                            <div className="table-responsive-lg">
                                <MDBDataTableV5 hover entriesOptions={[10, 20, 30, 40, 50]} entries={10} pagesAmount={4} data={datatable} fullPagination />
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL OPEN VIEW*/}
            <Modal title={null} visible={openPlanById} onOk={handleOkOpenPlanById} onCancel={handleCancelOpenPlanById} okText='บันทึก' cancelText='ยกเลิก' width={2500}>
                <>
                    <p className='text-center text-bold'>แผนปฏิบัติการ ประจำปีงบประมาณ 2565 เครือข่ายสุขภาพอำเภอบ้านด่านลานหอย</p>
                    <span><b>ยุทธศาสตร์กระทรวง : </b> {FormPlanById.ministry_strategy}</span><br />
                    <span><b>สอดคล้องกับนโยบายปลัดกระทรวง : </b> {FormPlanById.policy}</span><br />
                    <span><b>ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข : </b> {FormPlanById.kpi}</span><br />
                    <span><b>กลยุทธ์ : </b> {FormPlanById.strategy}</span><br />
                    <span><b>ผลลัพธ์/ผลผลิต : </b> {FormPlanById.result}</span>
                    <div className="card-body p-0">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>โครงการ/กิจกรรม</th>
                                    <th>กิจกรรมตามโครงการ</th>
                                    <th>ตัวชี้วัดความสำเร็จโครงการ</th>
                                    <th>เป้าหมาย/จำนวน(ระบุพื้นที่/กลุ่มคน)</th>
                                    <th>แหล่งงบประมาณ</th>
                                    <th>รายละเอียดการใช้งบประมาณ (บาท)</th>
                                    <th>รวมงบประมาณทั้งโครงการ</th>
                                    <th>การกำหนดระยะเวลาในการดำเนินการ</th>
                                    <th>หน่วยงานรับผิดชอบ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {/** โครงการ/กิจกรรม */}
                                    <td width={'10%'}>
                                        {FormPlanById.project}
                                    </td>
                                    {/** กิจกรรมตามโครงการ */}
                                    <td width={'15%'}>
                                        {
                                            dataActivityARR.map((item1, i1) => {
                                                // console.log(item1)
                                                return <p className='mt-2' key={i1} >
                                                    {i1 + 1}) {item1.dt_activity}
                                                </p>
                                            })
                                        }

                                    </td>
                                    {/** ตัวชี้วัดความสำเร็จโครงการ */}
                                    <td width={'15%'}>
                                        {
                                            dataPSIARR.map((item2, i2) => {
                                                return <p className='mt-2' key={i2} >
                                                    {i2 + 1}) {item2.dt_project_success_indicator}
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** เป้าหมาย/จำนวน(ระบุพื้นที่/กลุ่มคน) */}
                                    <td width={'15%'}>
                                        {
                                            dataTargetARR.map((item3, i3) => {
                                                return <p className='mt-2' key={i3} >
                                                    {i3 + 1}) {item3.dt_target}
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** แหล่งงบประมาณ */}
                                    <td width={'10%'}>
                                        {
                                            dataBSARR.map((item4, i4) => {
                                                return <p className='mt-2' key={i4} >
                                                    {i4 + 1}) {item4.dt_budget_source}
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** รายละเอียดการใช้งบประมาณ (บาท) */}
                                    <td width={'15%'}>
                                        {
                                            dataBUDARR.map((item5, i5) => {
                                                return <p className='mt-2' key={i5} >
                                                    {i5 + 1}) {item5.dt_budget_usage_detail} เป็นเงิน {item5.dt_budget_usage_price} บาท
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** รวมงบประมาณทั้งโครงการ */}
                                    <td width={'6%'}>{FormPlanById.total_budget}</td>
                                    {/** การกำหนดระยะเวลาในการดำเนินการ */}
                                    <td width={'7%'}>{FormPlanById.period}</td>
                                    {/** หน่วยงานรับผิดชอบ */}
                                    <td width={'7%'}>{FormPlanById.responsible_agency}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className='text-center'>
                                    <th colSpan={6}>
                                        รวมงบประมาณหน้านี้
                                    </th>
                                    <th colSpan={1}>
                                        {FormPlanById.total_budget}
                                    </th>
                                    <th colSpan={2}>
                                        จำนวนเงินตัวหนังสือ
                                    </th>
                                </tr>
                                <tr className='text-center'>
                                    <th colSpan={6}>
                                        รวมงบประมาณพันยอด (งบประมาณรวมหน้าก่อน + งบประมาฯหน้านี้)
                                    </th>
                                    <th colSpan={1}>
                                        {FormPlanById.total_budget}
                                    </th>
                                    <th colSpan={2}>
                                        จำนวนเงินตัวหนังสือ
                                    </th>
                                </tr>
                            </tfoot>
                        </table>

                        <div className='row mt-3'>
                            <div className='col-6 offset-lg-6'>
                                <div className='card' style={{ backgroundColor: '#f7faf9' }}>
                                    <div className='card-header border-0'>
                                        <div className='form-group'>
                                            <label><u>พิจารณาโครงการ</u></label>
                                            <select className="browser-default custom-select"
                                                onChange={e => {
                                                    setFormDiscuss({ ...formDiscuss, status: e.target.value })
                                                }}
                                            >
                                                <option value='0'>
                                                    กรุณาเลือก
                                                </option>
                                                <option value='9'>
                                                    ไม่ผ่าน
                                                </option>
                                                <option value='1'>
                                                    ผ่านขั้นที่ 1
                                                </option>
                                                <option value='2'>
                                                    ผ่านขั้นที่ 2
                                                </option>
                                                <option value='3'>
                                                    ผ่านขั้นที่ 3
                                                </option>
                                                <option value='4'>
                                                    จบโครงการ
                                                </option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label><u>เนื่องจาก</u></label>
                                            <textarea rows="5" cols="50" className="form-control" type="text" placeholder="เนื่องจาก..."
                                                onChange={e => {
                                                    setFormDiscuss({ ...formDiscuss, note: e.target.value })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            </Modal>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL OPEN VIEW*/}


            {/* // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL TIMELINE */}
            <Modal title={null} visible={openTimeline} onCancel={handleCancelOpenTimeline} footer={false} width={1000}>
                <>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="timeline">

                                    <div className="time-label">
                                        <span className="bg-yellow">เริ่มโครงการ</span>
                                    </div>

                                    <div>
                                        <i className="fas fa-user bg-green" />
                                        <div className="timeline-item">
                                            <span className="time"><i className="fas fa-clock" /> 5 mins ago</span>
                                            <h3 className="timeline-header no-border"><a href="#">Sarah Young</a> accepted your friend request</h3>
                                        </div>
                                    </div>

                                    <div className="time-label">
                                        <span className="bg-green">จบโครงการ</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            </Modal>
            {/* // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL TIMELINE */}


        </div>
    )
}

export default Approve