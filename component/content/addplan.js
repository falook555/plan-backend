import { MDBDataTableV5 } from 'mdbreact'
import React, { useEffect, useState } from 'react'
import { Modal, Popconfirm } from 'antd'
import axios from 'axios'
import config from '../../config'
import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'

const api = config.api
//pull 2

const Planadd = (data) => {

    const router = useRouter()
    const [datatable, setDatatable] = React.useState({})
    const [openPlanById, setopenPlanById] = useState(false)
    const [Add, setAdd] = useState(false)
    const [Edit, setEdit] = useState(false)
    const [FormAddPlan, setFormAddPlan] = useState({ insBy: data.data.username, ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '' })
    const [FormEditPlan, setFormEditPlan] = useState({ id: '', upBy: data.data.username, ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '' })
    const [FormPlanById, setFormPlanById] = useState({ ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '' })
    const [dataActivityARR, setDataActivityARR] = useState([])
    const [dataPSIARR, setDataPSIARR] = useState([])
    const [dataTargetARR, setDataTargetARR] = useState([])
    const [dataBSARR, setDataBSARR] = useState([])
    const [dataBUDARR, setDataBUDARR] = useState([])

    const [blockA, setBlockA] = useState(true)
    const [blockB, setBlockB] = useState(true)
    const [blockC, setBlockC] = useState(true)
    const [blockD, setBlockD] = useState(true)
    const [blockE, setBlockE] = useState(true)

    const [Activity, setActivity] = useState({ id_head: '', detail: '' })
    const [PSI, setPSI] = useState({ id_head: '', detail: '' })
    const [Target, setTarget] = useState({ id_head: '', detail: '' })
    const [BS, setBS] = useState({ id_head: '', detail: '' })
    const [BUD, setBUD] = useState({ id_head: '', detail: '' })

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
            label: 'จัดการ',
            field: 'action',
        },
    ]
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
                        'action': (
                            <>
                                <div className="btn-group">
                                    <button type="button" className='btn btn-info btn-block btn-sm' onClick={() => showModalOpenPlanById(item.id)}>
                                        <i className='fas fa-eye' />
                                    </button>

                                    <button type="button" className='btn btn-warning btn-sm' onClick={() => showModalEDIT(item.id)} >
                                        <i className='fas fa-edit' />
                                    </button>
                                    <Popconfirm
                                        title="คุณต้องการลบแผนกนี้หรือไม่?"
                                        // onConfirm={() => delelte(item.id)}
                                        okText="ยืนยัน"
                                        cancelText="ยกเลิก"
                                    >
                                        <button type="button" className="btn btn-danger btn-sm">
                                            <i className="fa fa-trash" />
                                        </button>
                                    </Popconfirm>
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

    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL ADD
    const showModalADD = () => {
        setAdd(true)
    }

    const handleOkADD = async () => {
        setAdd(false)

        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/add-plan`, FormAddPlan, { headers: { "token": token } })
            res.data.status == 'success' ? toast.success('เพิ่มแผนการปฏิบัติงานสำเร็จ') : toast.error('การเพิ่มข้อมูลล้มเหลว')
            setFormAddPlan({ insBy: data.data.username, ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '' })
            getList()
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const handleCancelADD = () => {
        setAdd(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL ADD


    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL EDIT
    const showModalEDIT = async (id) => {
        setEdit(true)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${api}/get-plan-by-id/${id}`, { headers: { "token": token } })
            // console.log(res.data)
            res.data.map((item, i) => {
                // console.log(item)
                setFormEditPlan({
                    ...FormEditPlan,
                    id: item.id,
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
    }

    const handleOkEDIT = async () => {
        setEdit(false)
        // console.log(FormEditPlan)
        try {
            const token = localStorage.getItem('token')
            let res = await axios.post(`${api}/update-plan`, FormEditPlan, { headers: { "token": token } })
            res.data.status == 'success' ? toast.success('แก้ไขแผนการปฏิบัติงานสำเร็จ') : toast.error('การแก้ไขข้อมูลล้มเหลว')
            setFormEditPlan({ id: '', upBy: data.data.username, ministry_strategy: '', policy: '', kpi: '', strategy: '', result: '', project: '', total_budget: '', period: '', responsible_agency: '' })
            getList()
        } catch (error) {
            // toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            console.log(error)
        }
    }

    const handleCancelEDIT = () => {
        setEdit(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL EDIT

    // ------------------------------------------------------------------------------------------------------------------------------------------ START MODAL PLAN BY ID
    const showModalOpenPlanById = async (id) => {
        setopenPlanById(true)
        // console.log(id)
        const token = localStorage.getItem('token')
        try {
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

                setActivity({ ...Activity, id_head: item.id })
            })

        } catch (error) {
            console.log(error)
        }
        // activity
        try {
            const resActivity = await axios.get(`${api}/get-activity-by-id/${id}`, { headers: { "token": token } })
            setDataActivityARR(resActivity.data)
        } catch (error) {
            console.log(error)
        }

        // project-success-indicator
        try {
            const resPSI = await axios.get(`${api}/get-project-success-indicator-by-id/${id}`, { headers: { "token": token } })
            setDataPSIARR(resPSI.data)
        } catch (error) {
            console.log(error)
        }

        // target
        try {
            const resTarget = await axios.get(`${api}/get-target-by-id/${id}`, { headers: { "token": token } })
            setDataTargetARR(resTarget.data)
        } catch (error) {
            console.log(error)
        }

        // budget-source
        try {
            const resBS = await axios.get(`${api}/get-budget-source-by-id/${id}`, { headers: { "token": token } })
            setDataBSARR(resBS.data)
        } catch (error) {
            console.log(error)
        }

        // budget-usage-detail
        try {
            const resBUD = await axios.get(`${api}/get-budget-usage-detail-by-id/${id}`, { headers: { "token": token } })
            setDataBUDARR(resBUD.data)
        } catch (error) {
            console.log(error)
        }

    }

    const handleCancelOpenPlanById = () => {
        setopenPlanById(false)
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------ END MODAL PLAN BY ID


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
                            <h1 className="m-0">เพิ่มแผนการปฏิบัติงาน</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">หน้าแรก</li>
                                <li className="breadcrumb-item">เพิ่มแผนการปฏิบัติงาน</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">

                    <div className="card card-white">
                        <div className="card-header">
                            <div style={{ textAlign: 'right' }}>
                                <button type="button" className="btn btn-success btn-sm" onClick={showModalADD}>เพิ่มแผนการปฏิบัติงาน</button>
                            </div>
                        </div>

                        <div className='card-body'>
                            <div className="table-responsive-lg">
                                <MDBDataTableV5 hover entriesOptions={[10, 20, 30, 40, 50]} entries={10} pagesAmount={4} data={datatable} fullPagination />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* //---------------------------------------------------------------------------------------------------------------------------------------- START MODAL ADD PLAN */}
            <Modal title="เพิ่มแผนการปฏิบัติงาน" visible={Add} onOk={handleOkADD} onCancel={handleCancelADD} okText='บันทึก' cancelText='ยกเลิก' width={1500}>
                <div>
                    <div className="card-body">
                        <div className='row'>
                            <div className="form-group col-lg-6 col-12">

                                <label>ยุทธศาสตร์กระทรวง</label>
                                <input type="text" className="form-control" placeholder="ยุทธศาสตร์กระทรวง"
                                    value={FormAddPlan.ministry_strategy}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, ministry_strategy: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>สอดคล้องกับนโยบายปลัดกระทรวง</label>
                                <input type="text" className="form-control" placeholder="สอดคล้องกับนโยบายปลัดกระทรวง"
                                    value={FormAddPlan.policy}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, policy: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข</label>
                                <input type="text" className="form-control" placeholder="ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข"
                                    value={FormAddPlan.kpi}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, kpi: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>กลยุทธ์</label>
                                <input type="text" className="form-control" placeholder="กลยุทธ์"
                                    value={FormAddPlan.strategy}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, strategy: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>ผลลัพธ์/ผลผลิต</label>
                                <input type="text" className="form-control" placeholder="ผลลัพธ์/ผลผลิต"
                                    value={FormAddPlan.result}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, result: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>โครงการ/กิจกรรม</label>
                                <input type="text" className="form-control" placeholder="โครงการ/กิจกรรม"
                                    value={FormAddPlan.project}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, project: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>รวมงบประมาณทั้งโครงการ</label>
                                <input type="text" className="form-control" placeholder="รวมงบประมาณทั้งโครงการ"
                                    value={FormAddPlan.total_budget}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, total_budget: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>กำหนดระยะเวลาในการดำเนินการ</label>
                                <input type="text" className="form-control" placeholder="กำหนดระยะเวลาในการดำเนินการ"
                                    value={FormAddPlan.period}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, period: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>หน่วยงานรับผิดชอบ</label>
                                <input type="text" className="form-control" placeholder="หน่วยงานรับผิดชอบ"
                                    value={FormAddPlan.responsible_agency}
                                    onChange={e => {
                                        setFormAddPlan({ ...FormAddPlan, responsible_agency: e.target.value })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* //---------------------------------------------------------------------------------------------------------------------------------------- END MODAL ADD PLAN */}

            {/* //---------------------------------------------------------------------------------------------------------------------------------------- START MODAL EDIT PLAN */}
            <Modal title="แก้ไขแผนการปฏิบัติงาน" visible={Edit} onOk={handleOkEDIT} onCancel={handleCancelEDIT} okText='บันทึก' cancelText='ยกเลิก' width={1500}>
                <div>
                    <div className="card-body">
                        <div className='row'>
                            <div className="form-group col-lg-6 col-12">

                                <label>ยุทธศาสตร์กระทรวง</label>
                                <input type="text" className="form-control" placeholder="ยุทธศาสตร์กระทรวง"
                                    value={FormEditPlan.ministry_strategy}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, ministry_strategy: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>สอดคล้องกับนโยบายปลัดกระทรวง</label>
                                <input type="text" className="form-control" placeholder="สอดคล้องกับนโยบายปลัดกระทรวง"
                                    value={FormEditPlan.policy}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, policy: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข</label>
                                <input type="text" className="form-control" placeholder="ตอบตัวชี้วัด KPI ของกระทรวงสาธารณสุข"
                                    value={FormEditPlan.kpi}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, kpi: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>กลยุทธ์</label>
                                <input type="text" className="form-control" placeholder="กลยุทธ์"
                                    value={FormEditPlan.strategy}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, strategy: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>ผลลัพธ์/ผลผลิต</label>
                                <input type="text" className="form-control" placeholder="ผลลัพธ์/ผลผลิต"
                                    value={FormEditPlan.result}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, result: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>โครงการ/กิจกรรม</label>
                                <input type="text" className="form-control" placeholder="โครงการ/กิจกรรม"
                                    value={FormEditPlan.project}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, project: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>รวมงบประมาณทั้งโครงการ</label>
                                <input type="text" className="form-control" placeholder="รวมงบประมาณทั้งโครงการ"
                                    value={FormEditPlan.total_budget}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, total_budget: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>กำหนดระยะเวลาในการดำเนินการ</label>
                                <input type="text" className="form-control" placeholder="กำหนดระยะเวลาในการดำเนินการ"
                                    value={FormEditPlan.period}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, period: e.target.value })
                                    }}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-12">
                                <label>หน่วยงานรับผิดชอบ</label>
                                <input type="text" className="form-control" placeholder="หน่วยงานรับผิดชอบ"
                                    value={FormEditPlan.responsible_agency}
                                    onChange={e => {
                                        setFormEditPlan({ ...FormEditPlan, responsible_agency: e.target.value })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* //---------------------------------------------------------------------------------------------------------------------------------------- END MODAL EDIT PLAN */}

            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL OPEN VIEW*/}
            <Modal title={null} visible={openPlanById} onCancel={handleCancelOpenPlanById} footer={false} okText='บันทึก' cancelText='ยกเลิก' width={2500}>
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
                                        <div className='row'>
                                            <div className='col-9'>
                                                <input type="text" className="form-control form-control-sm" placeholder="กิจกรรมตามโครงการ"
                                                    value={Activity.detail}
                                                    onChange={e => {
                                                        setActivity({ ...Activity, detail: e.target.value })
                                                        if (e.target.value.length > 0) {
                                                            setBlockA(false)
                                                        } else {
                                                            setBlockA(true)
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className='col-3'>
                                                <button className='btn btn-info btn-block btn-sm' disabled={blockA}><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        {
                                            dataActivityARR.map((item1, i1) => {
                                                return <p className='mt-2' key={i1} >
                                                    {i1 + 1}) {item1.dt_activity}
                                                    &emsp;<button className='btn btn-danger btn-sm'><i className="fa fa-trash" /></button>
                                                </p>
                                            })
                                        }

                                    </td>
                                    {/** ตัวชี้วัดความสำเร็จโครงการ */}
                                    <td width={'15%'}>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <input type="text" className="form-control form-control-sm" placeholder="ตัวชี้วัดความสำเร็จโครงการ"
                                                    value={PSI.detail}
                                                    onChange={e => {
                                                        setPSI({ ...PSI, detail: e.target.value })
                                                        if (e.target.value.length > 0) {
                                                            setBlockB(false)
                                                        } else {
                                                            setBlockB(true)
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className='col-3'>
                                                <button className='btn btn-info btn-block btn-sm' disabled={blockB}><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        {
                                            dataPSIARR.map((item2, i2) => {
                                                return <p className='mt-2' key={i2} >
                                                    {i2 + 1}) {item2.dt_project_success_indicator}
                                                    &emsp;<button className='btn btn-danger btn-sm'><i className="fa fa-trash" /></button>
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** เป้าหมาย/จำนวน(ระบุพื้นที่/กลุ่มคน) */}
                                    <td width={'15%'}>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <input type="text" className="form-control form-control-sm" placeholder="เป้าหมาย/จำนวน(ระบุพื้นที่/กลุ่มคน)" />
                                            </div>
                                            <div className='col-3'>
                                                <button className='btn btn-info btn-block btn-sm'><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        {
                                            dataTargetARR.map((item3, i3) => {
                                                return <p className='mt-2' key={i3} >
                                                    {i3 + 1}) {item3.dt_target}
                                                    &emsp;<button className='btn btn-danger btn-sm'><i className="fa fa-trash" /></button>
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** แหล่งงบประมาณ */}
                                    <td width={'10%'}>
                                        <div className='row'>
                                            <div className='col-9'>
                                                <input type="text" className="form-control form-control-sm" placeholder="แหล่งงบประมาณ" />
                                            </div>
                                            <div className='col-3'>
                                                <button className='btn btn-info btn-block btn-sm'><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        {
                                            dataBSARR.map((item4, i4) => {
                                                return <p className='mt-2' key={i4} >
                                                    {i4 + 1}) {item4.dt_budget_source}
                                                    &emsp;<button className='btn btn-danger btn-sm'><i className="fa fa-trash" /></button>
                                                </p>
                                            })
                                        }
                                    </td>
                                    {/** รายละเอียดการใช้งบประมาณ (บาท) */}
                                    <td width={'15%'}>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <input type="text" className="form-control form-control-sm" placeholder="รายละเอียด" />
                                            </div>
                                            <div className='col-12 mt-2'>
                                                <input type="text" className="form-control form-control-sm" placeholder="จำนวนเงิน" />
                                            </div>
                                            <div className='col-12 mt-2'>
                                                <button className='btn btn-info btn-block btn-sm'><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        {
                                            dataBUDARR.map((item5, i5) => {
                                                return <p className='mt-2' key={i5} >
                                                    {i5 + 1}) {item5.dt_budget_usage_detail} เป็นเงิน {item5.dt_budget_usage_price} บาท
                                                    &emsp;<button className='btn btn-danger btn-sm'><i className="fa fa-trash" /></button>
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
                    </div>

                </>
            </Modal>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------ MODAL OPEN VIEW*/}

        </div >


    )
}

export default Planadd